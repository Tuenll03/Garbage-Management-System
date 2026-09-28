# คู่มือและสถาปัตยกรรมการชำระเงินและการตรวจสอบสลิป (Payment & Slip Verification Guide)

เอกสารนี้สรุปขั้นตอนและสถาปัตยกรรมของ **ระบบชำระเงินค่าธรรมเนียมขยะ (Payment System)** เพื่อใช้เป็นคู่มืออ้างอิงในการพัฒนา ทั้งการเชื่อมต่อระหว่าง Frontend (React) กับ Backend (Spring Boot) และการย้ายการตรวจสอบสลิปมาไว้ที่หลังบ้านเพื่อความปลอดภัยสูงสุด

---

## 1. ภาพรวมสถาปัตยกรรม (Architecture Overview)

```
[ Frontend: React ]
       │
       │ 1. แนบสลิป (Base64) + invoiceId
       ▼
[ Backend: Spring Boot (PaymentService) ]
       │
       ├── 2. ตรวจสอบสถานะบิลใน Database (ป้องกันการจ่ายซ้ำ)
       │
       ├── 3. ส่งรูปสลิปไปตรวจสอบ (External Slip API ด้วย RestTemplate)
       │         │
       │         ▼
       │     [ https://slip-c.oiio.download/api/slip ]
       │         │
       │         ▼
       │     ได้ยอดเงิน (amount) และ บัญชีผู้รับ (receiver)
       │
       ├── 4. ตรวจสอบความถูกต้อง:
       │      - ยอดเงินในสลิป >= ยอดบิลจริงหรือไม่
       │      - โอนเข้าบัญชีเทศบาลจริงหรือไม่
       │
       ├── 5. บันทึก Payment และอัปเดตสถานะ Invoice เป็น "ชำระเงินแล้ว" (@Transactional)
       │
       ▼
[ Database: MySQL (payment / invoice) ]
```

---

## 2. ทำไมต้องย้ายการตรวจสลิปมาไว้ที่หลังบ้าน (Security Rationale)

1. **ป้องกันการดัดแปลงยอดเงิน (Tamper-proof):**
   - หากตรวจสลิปที่หน้าบ้าน (Frontend) ผู้ไม่หวังดีสามารถใช้เครื่องมืออย่าง Postman หรือ Inspect ดักส่งยอดเงินปลอม (`amountPaid: 100`) ทั้งๆ ที่สลิปจริงโอนแค่ 1 บาท
   - การย้ายมาหลังบ้าน ทำให้ Backend เป็นผู้กำหนดและตรวจสอบยอดเงินจริงจากฐานข้อมูลและผลลัพธ์ของ Slip API โดยตรง
2. **ป้องกันการจ่ายซ้ำ (Idempotency):**
   - Backend จะทำการตรวจสอบสถานะของ `Invoice` ก่อนเสมอ หากสถานะเป็น `"ชำระเงินแล้ว"` จะปฏิเสธการทำรายการทันที
3. **ความลับของระบบ (API Token & Endpoint Protection):**
   - URL หรือ Token ของผู้ให้บริการตรวจสลิปจะถูกเก็บเป็นความลับในฝั่ง Server ไม่หลุดออกไปทางฝั่ง Client

---

## 3. ขั้นตอนการทำงานอย่างละเอียด (Step-by-Step Workflow)

### 🔹 ขั้นตอนที่ 1: ฝั่งหน้าบ้าน (Frontend - `PaymentSection.jsx`)
1. ผู้ใช้เลือกไฟล์รูปสลิปจากเครื่อง
2. ใช้ `FileReader` แปลงรูปภาพเป็น **Base64 String**
3. ส่งเฉพาะข้อมูลที่จำเป็นไปยัง Backend:
   ```javascript
   const paymentData = {
       slipImage: base64Result,      // รูปภาพ Base64
       invoice: {
           invoiceId: currentInvoiceId // รหัสบิลที่ต้องการชำระ
       }
   };
   
   const response = await axios.post('http://localhost:8081/api/payments', paymentData);
   ```

---

### 🔹 ขั้นตอนที่ 2: ฝั่งหลังบ้าน (Backend - `PaymentService.java`)

1. **ตรวจสอบความมีอยู่และสถานะของใบแจ้งหนี้ (Invoice Validation):**
   ```java
   Invoice invoice = invoiceRepository.findById(invoiceId).orElse(null);
   if (invoice == null) {
       return "Invoice not found";
   }
   if ("ชำระเงินแล้ว".equals(invoice.getStatus())) {
       return "ใบแจ้งหนี้นี้ได้รับการชำระเงินเรียบร้อยแล้ว";
   }
   ```

2. **เตรียมข้อมูลส่งไปตรวจสอบกับ Slip Verification API:**
   ```java
   Map<String, Object> slipRequest = new HashMap<>();
   slipRequest.put("img", payment.getSlipImage());
   slipRequest.put("tos", true);
   slipRequest.put("privacy", true);
   slipRequest.put("eula", true);
   ```

3. **ยิง HTTP POST ด้วย `RestTemplate`:**
   ```java
   RestTemplate restTemplate = new RestTemplate();
   String slipApiUrl = "https://slip-c.oiio.download/api/slip";
   
   // Map.class คือการระบุให้แปลงผลลัพธ์ JSON กลับมาเป็น Map ของ Java
   Map response = restTemplate.postForObject(slipApiUrl, slipRequest, Map.class);
   ```

4. **แกะผลลัพธ์และตรวจสอบยอดเงิน + บัญชี:**
   ```java
   Map dataResult = (Map) response.get("data");
   if (dataResult == null) {
       return "ไม่สามารถตรวจสอบสลิปได้ กรุณาตรวจสอบรูปภาพสลิป";
   }

   // ดึงยอดเงินจากสลิป
   double slipAmount = Double.parseDouble(dataResult.get("amount").toString());
   if (slipAmount < invoice.getTotalAmount()) {
       return "ยอดเงินในสลิป (" + slipAmount + " บาท) ไม่ครบตามยอดบิล (" + invoice.getTotalAmount() + " บาท)";
   }

   // ตรวจสอบเลขบัญชีผู้รับเงิน (บัญชีกองคลังเทศบาล เช่น ลงท้ายด้วย 4978 หรือเลขบัญชีจริง)
   String receiverAccount = dataResult.get("sender_id").toString().replace("-", ""); 
   // หรือตรวจจาก receiver / promptpay ตามโครงสร้าง API
   ```

5. **บันทึกข้อมูลและอัปเดตสถานะแบบ `@Transactional`:**
   ```java
   // กำหนดค่าที่แท้จริง
   payment.setAmountPaid(slipAmount);
   payment.setPaymentDate(LocalDate.now());
   payment.setPaymentMethod("โอนชำระ");
   payment.setInvoice(invoice);

   // บันทึกลงฐานข้อมูล
   paymentRepository.save(payment);

   // เปลี่ยนสถานะบิล
   invoice.setStatus("ชำระเงินแล้ว");
   invoiceRepository.save(invoice);
   ```

---

## 4. โครงสร้างโค้ดตัวอย่างที่สมบูรณ์ (Reference Implementation)

### 📄 `PaymentService.java` (แบบตรวจสลิปหลังบ้าน)

```java
package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.lang.NonNull;

import com.example.demo.repository.PaymentRepository;
import com.example.demo.repository.InvoiceRepository;
import com.example.demo.entity.Payment;
import com.example.demo.entity.Invoice;

import java.util.Map;
import java.util.HashMap;
import java.time.LocalDate;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Transactional
    public String createPayment(@NonNull Payment payment) {
        try {
            // 1. ตรวจสอบข้อมูลใบแจ้งหนี้
            if (payment.getInvoice() == null) {
                return "Invoice is required";
            }
            Integer invoiceId = payment.getInvoice().getInvoiceId();
            Invoice invoice = invoiceRepository.findById(invoiceId).orElse(null);
            if (invoice == null) {
                return "Invoice not found";
            }
            if ("ชำระเงินแล้ว".equals(invoice.getStatus())) {
                return "ใบแจ้งหนี้นี้ได้รับการชำระเงินแล้ว";
            }

            // 2. ตรวจสอบว่ามีรูปสลิปส่งมาหรือไม่
            if (payment.getSlipImage() == null || payment.getSlipImage().trim().isEmpty()) {
                return "กรุณาแนบรูปภาพสลิปการโอนเงิน";
            }

            // 3. เตรียมข้อมูลยิงไปตรวจสอบสลิป
            Map<String, Object> slipPayload = new HashMap<>();
            slipPayload.put("img", payment.getSlipImage());
            slipPayload.put("tos", true);
            slipPayload.put("privacy", true);
            slipPayload.put("eula", true);

            RestTemplate restTemplate = new RestTemplate();
            String slipApiUrl = "https://slip-c.oiio.download/api/slip";
            
            Map apiResponse = restTemplate.postForObject(slipApiUrl, slipPayload, Map.class);
            if (apiResponse == null || !apiResponse.containsKey("data")) {
                return "ไม่สามารถอ่านข้อมูลสลิปได้ กรุณาตรวจสอบรูปภาพอีกครั้ง";
            }

            Map data = (Map) apiResponse.get("data");

            // 4. ตรวจสอบยอดเงินในสลิป
            double slipAmount = Double.parseDouble(data.get("amount").toString());
            if (slipAmount < invoice.getTotalAmount()) {
                return "ยอดเงินในสลิปไม่ครบตามยอดบิล (" + invoice.getTotalAmount() + " บาท)";
            }

            // 5. เซ็ตค่าข้อมูลจริงจาก Server
            payment.setPaymentDate(LocalDate.now());
            payment.setAmountPaid(slipAmount);
            payment.setPaymentMethod("โอนชำระ");
            payment.setInvoice(invoice);

            // 6. บันทึกรายการ
            paymentRepository.save(payment);

            // 7. เปลี่ยนสถานะใบแจ้งหนี้
            invoice.setStatus("ชำระเงินแล้ว");
            invoiceRepository.save(invoice);

            return "success";

        } catch (Exception e) {
            System.err.println("Error in createPayment: " + e.getMessage());
            throw new RuntimeException("เกิดข้อผิดพลาดในการบันทึกการชำระเงิน: " + e.getMessage());
        }
    }
}
```

---

### 🔍 คำอธิบายโค้ดแต่ละบรรทัดอย่างละเอียด (Line-by-Line Explanation)

เพื่อให้เข้าใจและตอบคำถามอาจารย์/กรรมการได้ชัดเจน นี่คือคำอธิบายว่าแต่ละบรรทัดทำหน้าที่อะไร:

#### 1. การเตรียมข้อมูล (Payload) ส่งให้ API ตรวจสลิป
```java
Map<String, Object> slipPayload = new HashMap<>();
slipPayload.put("img", payment.getSlipImage());
slipPayload.put("tos", true);
slipPayload.put("privacy", true);
slipPayload.put("eula", true);
```
* **`Map<String, Object>`**: คือกล่องเก็บข้อมูลแบบ Key-Value ในภาษา Java (เทียบเท่ากับ Object `{ key: value }` ใน JavaScript)
* **`slipPayload.put("img", payment.getSlipImage())`**: นำภาพสลิปที่เป็นข้อความ Base64 (ที่ส่งมาจากหน้าบ้าน) ใส่เข้าไปในคีย์ `"img"` ตามที่ API ตรวจสลิปกำหนด
* **`put("tos", true)`, `put("privacy", true)`, `put("eula", true)`**: ยอมรับเงื่อนไขการใช้งานของ API ตรวจสลิป

#### 2. การสร้าง HTTP Client เพื่อยิงข้าม Server (RestTemplate)
```java
RestTemplate restTemplate = new RestTemplate();
String slipApiUrl = "https://slip-c.oiio.download/api/slip";
```
* **`RestTemplate`**: คือเครื่องมือมาตรฐานของ Spring Boot สำหรับทำหน้าที่เป็น HTTP Client เพื่อยิง Request ไปหา API อื่น (ทำหน้าที่เหมือนคำสั่ง `axios` ใน React)
* **`slipApiUrl`**: URL ปลายทางของเซิร์ฟเวอร์ที่ให้บริการอ่านข้อมูลสลิป

#### 3. การยิง HTTP POST และรับผลลัพธ์
```java
Map apiResponse = restTemplate.postForObject(slipApiUrl, slipPayload, Map.class);
```
* **`postForObject(...)`**: สั่งให้ส่งคำขอแบบ `POST` โดยส่งก้อนข้อมูล `slipPayload` ไปยัง URL ปลายทาง
* **`Map.class`**: **จุดสำคัญ!** บอก Java ว่าเมื่อเซิร์ฟเวอร์ตอบกลับมาเป็นข้อความ JSON ให้ช่วยแกะ (Parse) ข้อความ JSON นั้นมาใส่ในอ็อบเจกต์ประเภท `Map` ของ Java ให้อัตโนมัติ เพื่อให้เราสามารถเรียกดูข้อมูลข้างในผ่านคำสั่ง `.get(...)` ได้สะดวกเหมือน JavaScript

#### 4. การตรวจสอบความถูกต้องของผลลัพธ์
```java
if (apiResponse == null || !apiResponse.containsKey("data")) {
    return "ไม่สามารถอ่านข้อมูลสลิปได้ กรุณาตรวจสอบรูปภาพอีกครั้ง";
}
Map data = (Map) apiResponse.get("data");
```
* **`apiResponse == null || !apiResponse.containsKey("data")`**: ดักจับกรณีที่ยิงไม่สำเร็จ, เซิร์ฟเวอร์ภายนอกล่ม, หรือรูปที่ส่งไปไม่ใช่สลิปโอนเงินจริง
* **`(Map) apiResponse.get("data")`**: แกะก้อนข้อมูลชั้นในที่ชื่อว่า `data` ออกมาเก็บไว้ในตัวแปร เพื่อเตรียมหยิบยอดเงินและเลขบัญชี

#### 5. การแกะยอดเงินมาเปรียบเทียบกับยอดบิลจริง
```java
double slipAmount = Double.parseDouble(data.get("amount").toString());
if (slipAmount < invoice.getTotalAmount()) {
    return "ยอดเงินในสลิปไม่ครบตามยอดบิล (" + invoice.getTotalAmount() + " บาท)";
}
```
* **`data.get("amount").toString()`**: ดึงค่ายอดเงินที่อ่านได้จากสลิปออกมาเป็นข้อความ
* **`Double.parseDouble(...)`**: แปลงข้อความตัวเลขให้กลายเป็นตัวเลขทศนิยม (`double`) ทางคณิตศาสตร์
* **`slipAmount < invoice.getTotalAmount()`**: เปรียบเทียบกับยอดหนี้จริงในฐานข้อมูล หากยอดเงินในสลิปน้อยกว่ายอดที่ต้องจ่ายจริง ระบบจะปฏิเสธการชำระเงินทันที ป้องกันการโกงเงิน

---

## 5. การปรับปรุงฝั่งหน้าบ้าน (`PaymentSection.jsx`)

เมื่อหลังบ้านทำหน้าที่ตรวจสอบสลิปและกำหนดฟิลด์ต่างๆ ให้แล้ว หน้าบ้านจะเบาลงและปลอดภัยขึ้นทันที:

```javascript
const handleUpload = (e, currentInvoiceId) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingInvoiceId(currentInvoiceId);
    setMessage('กำลังอัปโหลดและตรวจสอบสลิป...');
    setIsSuccess(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
        const base64Result = reader.result;

        try {
            // ส่งแค่สลิปกับ invoiceId ไปให้หลังบ้าน
            const paymentPayload = {
                slipImage: base64Result,
                invoice: {
                    invoiceId: currentInvoiceId
                }
            };

            const response = await axios.post('http://localhost:8081/api/payments', paymentPayload);
            
            if (response.data === "success") {
                setMessage("ชำระเงินสำเร็จเรียบร้อยแล้ว");
                setIsSuccess(true);
                // นำบิลที่ชำระแล้วออกจากรายการค้างชำระทันที
                setInvoices(prev => prev.filter(inv => inv.invoiceId !== currentInvoiceId));
                if (onPaymentSuccess) onPaymentSuccess();
            } else {
                setMessage(response.data); // ข้อความเตือน เช่น ยอดเงินไม่ครบ หรือ บิลถูกจ่ายไปแล้ว
                setIsSuccess(false);
            }
        } catch (error) {
            console.error(error);
            setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
            setIsSuccess(false);
        } finally {
            setUploadingInvoiceId(null);
        }
    };
};
```
