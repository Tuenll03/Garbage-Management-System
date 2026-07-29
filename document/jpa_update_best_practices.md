# คู่มือแนวปฏิบัติที่ดีในการอัปเดตข้อมูล (JPA Update Best Practices)

เอกสารฉบับนี้อธิบายแนวคิดและเหตุผลสำคัญว่าทำไมเวลาอัปเดตข้อมูลในระบบ Spring Boot JPA จึง **ควรดึงข้อมูลเก่าออกมาก่อน แล้วทำการแก้ไขเฉพาะฟิลด์ที่ต้องการ** แทนการบันทึกวัตถุ (Object) ที่ส่งเข้ามาจากหน้าบ้านโดยตรง

---

## 1. เปรียบเทียบรูปแบบการเขียนโค้ด (Code Comparison)

### ❌ แบบที่เป็นปัญหา (บันทึกตัวแปร Request ตรงๆ)
การนำพารามิเตอร์ที่รับมาจาก HTTP Request Body ไปสั่งเซฟลงฐานข้อมูลทันที:

```java
public String updateOfficer(DocumentOfficer officer, Integer id) {
    try {
        // บันทึกออบเจ็กต์รับเข้าตรงๆ
        officerRepository.save(officer); 
        return "success";
    } catch (Exception e) {
        return "error";
    }
}
```

> **ปัญหาที่เกิดขึ้น:** 
> 1. ฟิลด์อื่น ๆ ในฐานข้อมูลที่หน้าบ้านไม่ได้ระบุส่งมาใน JSON (เช่น `password`, `citizenId`, `registeredDate`) จะถูกเขียนทับให้กลายเป็น `null` หรือค่าเริ่มต้นทันที
> 2. เกิดข้อผิดพลาด `not-null property references a null or transient value` ทันที หากฟิลด์เหล่านั้นตั้งค่าคอลัมน์เป็น `@Column(nullable = false)`

---

###  แบบที่ถูกต้อง (ดึงข้อมูลเก่ามาอัปเดตทีละฟิลด์)
การค้นหาแถวข้อมูลเดิมที่มีในตารางขึ้นมาก่อน แล้วจึงเลือกแก้ไขเฉพาะบางฟิลด์ที่ต้องการก่อนที่จะสั่งบันทึก:

```java
public String updateOfficer(DocumentOfficer officer, Integer id) {
    try {
        // 1. ดึงข้อมูลเดิมที่มีค่าครบถ้วนจากฐานข้อมูล
        DocumentOfficer mngofficer = officerRepository.findById(id).orElse(null);
        if (mngofficer == null) {
            return "Officer not found";
        }
        
        // 2. ใช้ Ternary Operator ในการอัปเดตทับเฉพาะฟิลด์ที่ส่งเข้ามาใหม่ (ถ้าไม่ส่งมาให้ใช้ค่าเดิม)
        mngofficer.setFirstName(officer.getFirstName() != null ? officer.getFirstName() : mngofficer.getFirstName());
        mngofficer.setLastName(officer.getLastName() != null ? officer.getLastName() : mngofficer.getLastName());
        
        // 3. บันทึก Managed Entity ตัวที่ถูกแก้ไขแล้วลงฐานข้อมูล
        officerRepository.save(mngofficer); 
        return "success";
    } catch (Exception e) {
        return "error";
    }
}
```

---

## 2. ทำไมวิธีดึงข้อมูลเดิมขึ้นมาก่อนถึงดีที่สุด?

### 🛡️ ป้องกันปัญหารุ่นเก่าสูญหาย (Null Overwrite Protection)
ในหน้าบ้าน (Frontend) โดยปกติผู้ใช้จะไม่ได้แก้ไขข้อมูลทุกฟิลด์พร้อมกันเสมอไป (เช่น เปลี่ยนแค่ชื่อ แต่ไม่ได้เปลี่ยนรหัสผ่าน) การโหลดข้อมูลเดิมมาครอบทับเฉพาะฟิลด์ที่แก้ไข ช่วยรับประกันว่าข้อมูลสำคัญอื่นๆ จะยังอยู่ในสภาพสมบูรณ์ ไม่หายไป

### 🚫 ป้องกันข้อจำกัดฐานข้อมูลพัง (Constraint Compliance)
ตารางในฐานข้อมูลมักจะมีการกำหนดค่าที่ห้ามเป็น Null หรือค่าคีย์เฉพาะ วิธีนี้ทำให้เราไม่ต้องคอยส่งรหัสผ่านหรือคีย์สำคัญทุกครั้งที่ยิง API แก้ไขข้อมูลส่วนอื่น

### ⚡ เพิ่มประสิทธิภาพด้วยระบบ Dirty Checking
Hibernate มีกลไกการติดตามสถานะของ Entity (Managed State) เมื่อดึงข้อมูลด้วย `findById()` และทำการตั้งค่าใหม่ผ่าน Setter ตัว Hibernate จะตรวจจับเฉพาะจุดที่แตกต่างจริง ๆ (Dirty checking) และส่ง SQL `UPDATE` แค่เฉพาะคอลัมน์ที่มีการเปลี่ยนแปลงไปสู่ MySQL เท่านั้น ซึ่งปลอดภัยและทำงานได้มีประสิทธิภาพสูงสุด

---

## 3. ระบบตั้งเวลากับการอัปเดตข้อมูลอัตโนมัติ (Spring Boot Scheduling & Auto-generation)

ในระบบงานนี้ มีการตั้งเวลาออกใบแจ้งหนี้อัตโนมัติ (Invoice) สำหรับงานบริการ (Service) ที่มีสถานะการอนุมัติแล้ว โดยการออกแบบระบบนี้ประกอบด้วย 2 ส่วนหลัก:

### A) การเปิดใช้งาน Scheduling ที่คลาสหลัก
ต้องระบุแอนโนเทชัน `@EnableScheduling` เพื่อเปิดใช้งานคุณลักษณะตารางงานอัตโนมัติใน Spring Boot:
```java
@SpringBootApplication
@EnableScheduling // <-- บังคับใส่เพื่อให้ตัวตั้งเวลาทำงาน
public class DemoApplication { ... }
```

### B) การเขียนเมธอดตัวตั้งเวลา `@Scheduled`
ในตัวอย่างนี้ เราได้ตั้งเวลาทำงานโดยระบุ Cron Expression และใส่ระบบป้องกันข้อมูลซ้ำซ้อน:
```java
// ทำงานอัตโนมัติ ทุกๆ 10 วินาที สำหรับการทดสอบ (หรือเปลี่ยนเป็น "0 0 0 1 * ?" สำหรับทุกวันที่ 1 ของเดือน)
@Scheduled(cron = "*/10 * * * * *")
public void autoGenerateMonthlyInvoices() {
    try {
        // 1. ดึงข้อมูลงานบริการทั้งหมดขึ้นมา
        List<Service> services = serviceRepository.findAll();
        for (Service service : services) {
            
            // 2. กรองเฉพาะบริการที่ได้รับการ "อนุมัติ"
            if ("อนุมัติ".equals(service.getStatus())) {

                // 3. ป้องกันการออกใบแจ้งหนี้ซ้ำ (Duplicate Prevention)
                // ตรวจสอบว่าในระบบเคยมี Invoice ที่ผูกกับ Service ID นี้ไปแล้วหรือยัง
                boolean alreadyExists = false;
                List<Invoice> existingInvoices = invoiceRepository.findAll();
                for (Invoice inv : existingInvoices) {
                    if (inv.getService() != null && inv.getService().getServiceId() == service.getServiceId()) {
                        alreadyExists = true;
                        break;
                    }
                }

                // 4. หากยังไม่เคยสร้าง Invoice ให้สร้างใหม่ขึ้นมาทันที
                if (!alreadyExists) {
                    Invoice invoice = new Invoice();
                    invoice.setService(service);
                    invoice.setInvoiceDate(LocalDate.now()); // วันที่ ณ ปัจจุบัน
                    invoice.setDueDate(LocalDate.now().plusDays(15)); // วันครบกำหนด (บวก 15 วัน)
                    
                    String dateStr = LocalDate.now().toString().replace("-", "");
                    int randomNum = (int) (Math.random() * 9000) + 1000;
                    invoice.setInvoiceNumber("INV-" + dateStr + "-" + randomNum);
                    invoice.setTotalAmount(service.getPrice()); // ดึงยอดค่าบริการ
                    invoice.setStatus("ค้างชำระ"); // สถานะค้างชำระเงินเริ่มต้น

                    invoiceRepository.save(invoice);
                }
            }
        }
    } catch (Exception e) {
        System.err.println(e.getMessage());
    }
}
```

---

## 4. เจาะลึกอธิบายการทำงานของโค้ดตัวตั้งเวลา (Detailed Code Explanation)

เพื่อให้เข้าใจกลไกและคำสั่งต่าง ๆ ที่ถูกเขียนไว้ในเมธอด `autoGenerateMonthlyInvoices` มี 3 จุดสำคัญที่ควรทำความเข้าใจดังนี้:

### 1) การใช้ Cron Expression (`cron = "*/10 * * * * *"`)
คำสั่งตั้งเวลาทำงานจะถูกอ่านเป็น 6 ลำดับเวลาย่อย ( seconds / minutes / hours / day of month / month / day of week )
* เครื่องหมาย **`*/10`** ในหลักแรก (วินาที) หมายความว่า **"ให้โค้ดทำงานโดยอัตโนมัติในทุก ๆ 10 วินาที"** (ใช้เพื่อความสะดวกในการทดสอบ)
* เมื่อระบบขึ้นใช้นานจริง (Production) ควรเปลี่ยนเป็น `"0 0 0 1 * ?"` ซึ่งหมายความว่า **"ให้โค้ดเริ่มทำงานอัตโนมัติที่เวลาเที่ยงคืน (00:00:00 น.) ของทุกวันที่ 1 ของเดือน"**

### 2) การเปรียบเทียบข้อความแบบปลอดภัยต่อค่าว่าง (`"อนุมัติ".equals(...)`)
ในจาวา หากเราเขียนเช็คค่าสถานะด้วยรูปแบบทั่วไปอย่าง `service.getStatus().equals("อนุมัติ")` แล้วหากบริการตัวนั้นเก็บค่าสถานะในฐานข้อมูลเป็นค่าว่าง (`null`) ตัวโปรแกรมจะพังทันทีด้วยข้อผิดพลาด `NullPointerException` (พยายามเรียกใช้ฟังก์ชันจากตัวแปรว่าง)
* การเขียนนำด้วยสตริงจริง **`"อนุมัติ".equals(service.getStatus())`** ช่วยป้องกันปัญหานี้ได้ 100% เพราะหากสถานะเป็น null โปรแกรมจะไม่พัง แต่จะประเมินผลเป็น `false` (ไม่เข้าเงื่อนไข) ให้โดยปลอดภัย

### 3) ระบบเช็คข้อมูลบิลซ้ำซ้อน (`alreadyExists` logic)
```java
boolean alreadyExists = false;
List<Invoice> existingInvoices = invoiceRepository.findAll();
for (Invoice inv : existingInvoices) {
    if (inv.getService() != null && inv.getService().getServiceId() == service.getServiceId()) {
        alreadyExists = true;
        break; // หยุดหาเมื่อเจอว่าซ้ำแล้ว
    }
}
```
* **ความจำเป็น**: เนื่องจากตัวตั้งเวลาทำงานทุก 10 วินาที หากไม่มีการเช็ค ข้อมูลบิล (Invoice) ของบริการที่ผ่านการอนุมัติแล้วจะโดนสร้างใหม่ซ้ำๆ กองรวมกันจนฐานข้อมูลบวมและผิดหลักการเงิน
* **วิธีการเช็ค**:
  1. เราตั้งธงเริ่มต้นว่า `alreadyExists = false` (ถือว่ายังไม่เคยมีบิลมาก่อน)
  2. ดึงรายการบิลเก่าทั้งหมดในระบบขึ้นมาวนตรวจสอบ
  3. ตรวจสอบว่าในบรรดาบิลเหล่านั้น มีใบแจ้งหนี้ใบใดที่เคยเชื่อมโยงบริการ ID นี้ไว้แล้วหรือยัง (`inv.getService().getServiceId() == service.getServiceId()`)
  4. หากมีอยู่แล้ว เราจะเซ็ตค่า `alreadyExists = true` และสั่ง `break` เพื่อหยุดค้นหาทันที
  5. เฉพาะบริการที่ส่งค่า `alreadyExists` เป็น `false` เท่านั้นที่จะได้รับการสร้างใบแจ้งหนี้ใบใหม่

---

## 5. ตัวอย่างการใช้ Transaction ควบคุมการทำงานหลายตาราง (Cross-Table Transactional Update)

ในกรณีที่เราต้องการบันทึกข้อมูลตารางหนึ่ง แล้วส่งผลไปอัปเดตอีกตารางหนึ่ง (เช่น บันทึกการชำระเงิน `Payment` แล้วไปเปลี่ยนสถานะใบแจ้งหนี้ `Invoice` เป็น "ชำระเงินแล้ว") เพื่อให้ข้อมูลทำงานสอดคล้องกันอย่างปลอดภัย ไม่หลุดหายระหว่างทาง

เราจะห่อคำสั่งทั้งหมดไว้ในเมธอดเดียวกัน และกำกับด้วย `@Transactional` ของ Spring:

```java
package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.repository.InvoiceRepository;
import com.example.demo.entity.Payment;
import com.example.demo.entity.Invoice;
import java.util.List;
import java.time.LocalDate;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Transactional // <-- บังคับใช้ เพื่อสร้างระบบ Transactional
    public String createPayment(Payment payment) {
        try {
            // 1. ตรวจสอบและดึงข้อมูลของใบแจ้งหนี้ (Invoice) ที่จะชำระ
            if (payment.getInvoice() == null) {
                return "Invoice is required";
            }
            Integer invoiceId = payment.getInvoice().getInvoiceId();
            Invoice invoice = invoiceRepository.findById(invoiceId).orElse(null);
            if (invoice == null) {
                return "Invoice not found";
            }

            // 2. เติมข้อมูลที่จำเป็นลงในออบเจ็กต์ Payment
            payment.setPaymentDate(LocalDate.now());
            payment.setInvoice(invoice);

            // 3. บันทึกประวัติการจ่ายเงินลงในตาราง payment
            paymentRepository.save(payment);

            // 4. ทำการอัปเดตสถานะของใบแจ้งหนี้เดิมลงในตาราง invoice
            invoice.setStatus("ชำระเงินแล้ว");
            invoiceRepository.save(invoice); // บันทึกการอัปเดตสถานะใบเดิม

            return "Payment created and Invoice status updated successfully";
        } catch (Exception e) {
            System.err.println(e.getMessage());
            return "error";
        }
    }
}
```

> **ข้อดี**: หากขั้นตอนใดขั้นตอนหนึ่งเกิดข้อผิดพลาดขึ้น (เช่น เซฟบิลไม่สำเร็จหลังจากเซฟจ่ายเงินไปแล้ว) ตัว `@Transactional` จะสั่งยกเลิกงานทั้งหมดที่ทำไปก่อนหน้ากลับสู่สถานะเดิม (Rollback) ทันที เพื่อไม่ให้มีข้อมูลการจ่ายเงินลอยอยู่โดยไม่มีการตัดบิล

---

## 6. ความรู้พื้นฐาน: Transaction คืออะไร? (Database Transaction)

**Transaction (ธุรกรรมฐานข้อมูล)** คือ **กลุ่มของชุดคำสั่งงานที่ทำงานร่วมกันเป็นหน่วยเดียว** เพื่อรับประกันว่าข้อมูลในระบบจะถูกต้องและน่าเชื่อถือ 100% โดยมีหลักการทำงานสั้นๆ คือ **"ทำสำเร็จทั้งหมด หรือ ไม่ทำเลย (All or Nothing)"**

### 💡 การเปรียบเทียบในชีวิตจริง (โอนเงินธนาคาร)
สมมติว่าคุณต้องการโอนเงิน 500 บาท ไปให้เพื่อน ขั้นตอนนี้มี 2 งานย่อยที่ต้องทำ:
1. **หักเงินจากบัญชีของคุณ 500 บาท** (สำเร็จ)
2. **เพิ่มเงินเข้าบัญชีของเพื่อน 500 บาท** (ล้มเหลว เช่น ระบบปลายทางขัดข้อง หรือหมายเลขบัญชีไม่ถูกต้อง)

* **ถ้าไม่มีระบบ Transaction (ไม่มีตัวควบคุม)**: บัญชีของคุณโดนหักเงินไปแล้วฟรี ๆ 500 บาท แต่เงินเพื่อนไม่เข้า ระบบเกิดความเสียหาย ข้อมูลขัดแย้งกันอย่างรุนแรง
* **ถ้ามีระบบ Transaction**: เมื่อขั้นตอนที่ 2 ล้มเหลว ระบบจะทำการ **ย้อนคืน (Rollback)** ไปยกเลิกขั้นตอนที่ 1 ทันที ทำให้ยอดเงิน 500 บาทกลับเข้ามาในบัญชีของคุณเหมือนไม่มีอะไรเกิดขึ้นเลย ข้อมูลจะปลอดภัยและถูกต้องเสมอ

### ⚙️ คุณสมบัติหลักของ Transaction (หลักการ ACID)
1. **Atomicity (ความเป็นหนึ่งเดียว)**: งานย่อย ๆ ต้องรันให้สำเร็จครบทุกตัว หากตัวใดตัวหนึ่งพัง ทั้งหมดจะถูกยกเลิก (Rollback) เสมือนว่าไม่มีอะไรเกิดขึ้นเลย
2. **Consistency (ความสอดคล้อง)**: ข้อมูลก่อนทำและหลังทำธุรกรรมต้องมีความถูกต้องตามกฎเกณฑ์เสมอ (เช่น ยอดเงินรวมของทั้งสองบัญชีก่อนโอนและหลังโอนต้องเท่าเดิม)
3. **Isolation (ความเป็นอิสระ)**: หากมีคนทำธุรกรรมโอนเงินพร้อมกันหลาย ๆ คน แต่ละรายการจะทำงานแยกกันเป็นอิสระ ไม่รบกวนหรือปนข้อมูลกัน
4. **Durability (ความคงทน)**: เมื่อธุรกรรมนั้นทำสำเร็จแล้ว ข้อมูลจะถูกบันทึกลงฮาร์ดดิสก์อย่างถาวร แม้เซิร์ฟเวอร์จะไฟดับข้อมูลก็จะไม่สูญหาย

### 💻 การนำมาใช้ใน Spring Boot (`@Transactional`)
เมื่อเราใส่แอนโนเทชัน `@Transactional` เหนือเมธอดใด ๆ ใน Service ตัว Spring Framework จะทำการดูแลเรื่องการควบคุมความปลอดภัยของข้อมูลให้โดยอัตโนมัติ:
* **ถ้าโค้ดในเมธอดทำงานสำเร็จจนจบ**: Spring จะทำการ **Commit** (ยืนยันการเขียนข้อมูลลงฐานข้อมูลจริง ๆ)
* **ถ้าโค้ดเกิด Error กลางทาง (โยน Exception)**: Spring จะทำการ **Rollback** (ล้างคำสั่งที่เซฟและแก้ไขไปก่อนหน้าออกทั้งหมด) เพื่อรักษาสภาพความถูกต้องของฐานข้อมูลเอาไว้ครับ

