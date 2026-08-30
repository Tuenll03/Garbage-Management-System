# คู่มือการติดตั้งและใช้งาน JasperReports ในระบบเทศบาล 📄✨

คู่มือนี้จะอธิบายขั้นตอนการทำระบบออกใบเสร็จรับเงิน PDF ด้วย **JasperReports** ร่วมกับหลังบ้าน **Spring Boot (Java)** และหน้าบ้าน **React** โดยเรียงลำดับขั้นตอนที่จำเป็นเพื่อให้ทำงานง่ายและเข้าใจง่ายที่สุด

---

## 🗺️ แผนภาพการเดินทางของข้อมูล (Data Flow)

เพื่อให้เห็นภาพรวมการทำงานร่วมกันระหว่างหน้าบ้าน (React) และหลังบ้าน (Spring Boot) เมื่อผู้ใช้ต้องการดาวน์โหลดบิล PDF สามารถอธิบายการเดินทางของข้อมูลได้ดังนี้ครับ:

```text
[ 1. หน้าจอเว็บ React ] 
      │ 
      ▼ (กดปุ่มขอเปิดบิล PDF ส่งคำขอไปหลังบ้าน: GET /api/invoices/1/pdf)
[ 2. Controller หลังบ้าน (InvoiceController) ]
      │
      ▼ (รับคำขอ แล้วส่ง ID บิลเลขที่ 1 ไปให้ Service ทำงาน)
[ 3. Service หลังบ้าน (InvoiceService) ] 
      │
      ├─► โหลดแบบฟอร์มเปล่า (.jrxml) มาเตรียมคอมไพล์ในหน่วยความจำ
      ├─► เปิดท่อเชื่อมต่อฐานข้อมูล (Connection) 
      │         │
      │         ▼ (ส่งค่า BILL_ID = 1 เข้าไปรันคิวรีดึงข้อมูลบิลเลขที่ 1)
      │   [ 4. ฐานข้อมูล MySQL ]
      │         │
      │         ▼ (ส่งข้อมูลบิล เช่น ชื่อลูกค้า, จำนวนเงิน, สถานะ กลับมา)
      ├─► หยอดข้อมูลที่ดึงได้ลงช่องต่าง ๆ ในแบบฟอร์มบิล (ด้วย fillReport)
      ├─► เรียกใช้ไฟล์ฟอนต์ (THSarabunNew.ttf) มาวาดวาดฟอนต์ภาษาไทยและฝังตัวหนังสือ
      ├─► แปลงร่างรายงานทั้งหมดให้ออกมาเป็นข้อมูลดิบของไฟล์ PDF (byte[])
      │
      ▼ (ส่งข้อมูลดิบ PDF กลับไปให้ Controller)
[ 5. Controller หลังบ้าน ]
      │
      ▼ (แปะป้ายระบุว่านี่คือไฟล์ PDF นะ แล้วส่งผ่านอินเทอร์เน็ตกลับไป)
[ 6. เว็บบราวเซอร์ผู้ใช้ ] ➡️ (เปิดหน้าต่างใหม่โชว์ใบเสร็จ PDF ภาษาไทยสวยงามดึงข้อมูลถูกต้อง)
```

---

## 📌 ขั้นตอนที่ 1: การออกแบบหน้าตาเทมเพลตใบเสร็จ (Jaspersoft Studio)

1. **ดาวน์โหลดโปรแกรม**: ไปที่ [Jaspersoft Studio Download](https://community.jaspersoft.com/project/jaspersoft-studio/) โหลดซอฟต์แวร์ฟรีมาลงในเครื่องคอมพิวเตอร์ของคุณ
2. **สร้างรายงานใหม่**:
   - เปิดโปรแกรม ➡️ เลือก `File > New > Jasper Report`
   - เลือกกระดาษขนาดที่เหมาะสม (เช่น `A4` หรือ `Receipt` ขนาดเล็กตามต้องการ)
3. **กำหนดส่วนประกอบสำคัญ (Parameters & Fields)**:
   - **Parameters** (ข้อมูลคงที่ที่ส่งข้ามไป): คลิกขวาที่ Parameters ➡️ เลือก Create Parameter เช่น `member_name`, `receipt_id`, `payment_date`
   - **Fields** (ข้อมูลในตารางบิลที่จะลูป): เช่น `invoice_id`, `amount_paid`, `service_type`
4. **ออกแบบ Layout**: ลากวางข้อความ (Static Text), ช่องใส่ตัวแปร (Text Field) และ โลโก้ภาพเทศบาล จัดระยะขอบให้เรียบร้อย
5. **เซฟไฟล์**: บันทึกรายงาน จะได้ไฟล์นามสกุล `.jrxml` (เช่น `receipt.jrxml`) นำไฟล์นี้มาเก็บไว้ใช้ในขั้นตอนเขียนโค้ดต่อไป

---

## 📌 ขั้นตอนที่ 2: ตั้งค่าหลังบ้าน Spring Boot (`pom.xml`)

ให้เปิดไฟล์ `pom.xml` ของหลังบ้าน Spring Boot แล้วเพิ่มไลบรารีของ JasperReports และไลบรารีอื่น ๆ ที่จำเป็น เช่น iText และ ICU4J (สำหรับช่วยแปลงจำนวนเงินตัวเลขเป็นตัวหนังสือภาษาไทยผ่าน `RuleBasedNumberFormat`) เข้าไปในบล็อก `<dependencies>` ดังนี้ครับ:

```xml
<!-- JasperReports Core -->
<dependency>
    <groupId>net.sf.jasperreports</groupId>
    <artifactId>jasperreports</artifactId>
    <version>6.20.0</version>
</dependency>
<!-- PDF rendering support (ใช้ iText ในการช่วยแปลงเป็น PDF) -->
<dependency>
    <groupId>com.lowagie</groupId>
    <artifactId>itext</artifactId>
    <version>2.1.7</version>
</dependency>
<!-- ICU4J for number/currency spelling out in Thai (RuleBasedNumberFormat) -->
<dependency>
    <groupId>com.ibm.icu</groupId>
    <artifactId>icu4j</artifactId>
    <version>74.2</version>
</dependency>
```

---

## 📌 ขั้นตอนที่ 3: วิธีป้องกันฟอนต์ภาษาไทยพัง (Font Extension)

เพื่อไม่ให้ตัวอักษรภาษาไทยแสดงผลเพี้ยน หรือกลายเป็นช่องสี่เหลี่ยม เราจะนำฟอนต์ภาษาไทย (เช่น `THSarabunNew.ttf`) ใส่เข้าไปในโฟลเดอร์ของ Java ตรง ๆ เพื่อให้สามารถแสดงผลได้ทุกแพลตฟอร์มครับ:

1. นำไฟล์ฟอนต์ `.ttf` ไปเซฟไว้ในโฟลเดอร์: `src/main/resources/fonts/` (ควรมีให้ครบทุกสไตล์ทั้ง Regular, Bold, Italic, BoldItalic)
2. สร้างไฟล์ชื่อ `jasperreports_extension.properties` ไว้ในโฟลเดอร์ `src/main/resources/` ใส่บรรทัดนี้เพื่อลงทะเบียน Font Registry Factory:
   ```properties
   net.sf.jasperreports.extension.registry.factory.simple.font.families=net.sf.jasperreports.engine.fonts.SimpleFontExtensionsRegistryFactory
   net.sf.jasperreports.extension.simple.font.families.myfonts=fonts/fonts.xml
   ```
3. สร้างไฟล์ชื่อ `fonts.xml` ไว้ในโฟลเดอร์ `src/main/resources/fonts/` เพื่อแมปชื่อฟอนต์ที่ใช้ใน JRXML เข้ากับไฟล์ฟอนต์จริง ๆ และตั้งค่าให้ฝังฟอนต์เข้าไปในไฟล์ PDF:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <fontFamilies>
       <fontFamily name="TH Sarabun New">
           <normal><![CDATA[fonts/THSarabunNew.ttf]]></normal>
           <bold><![CDATA[fonts/THSarabunNew-Bold.ttf]]></bold>
           <italic><![CDATA[fonts/THSarabunNew-Italic.ttf]]></italic>
           <boldItalic><![CDATA[fonts/THSarabunNew-BoldItalic.ttf]]></boldItalic>
           <pdfEncoding>Identity-H</pdfEncoding>
           <pdfEmbedded>true</pdfEmbedded>
       </fontFamily>
   </fontFamilies>
   ```

---

## 📌 ขั้นตอนที่ 4: การเขียนโค้ด Java ดึงข้อมูลมาเติมในรายงาน

สร้างส่วนบริการ **Service** ใน Java เพื่อทำหน้าที่โหลดไฟล์เทมเพลต คอมไพล์ ดึงข้อมูลจากฐานข้อมูลมาประมวลผลเติมลงในรายงาน และส่งออกข้อมูลเป็น PDF:

### โค้ดส่วน Service (`InvoiceService.java`)
```java
public byte[] generateInvoicePdf(int invoiceId) throws Exception {
    // 1. อ่านไฟล์แบบฟอร์มดีไซน์ดิบ .jrxml จากโฟลเดอร์ resources
    InputStream reportStream = getClass().getResourceAsStream("/reports/demoInvoice.jrxml");
    
    // 2. คอมไพล์ไฟล์ดีไซน์ดิบ (.jrxml) ให้กลายเป็น Object รายงาน (JasperReport) ที่พร้อมประมวลผล
    JasperReport jasperReport = JasperCompileManager.compileReport(reportStream);
    
    // 3. เตรียม Parameter สำหรับส่งเข้าไปกรองข้อมูลใน Query SQL ของ Jasper
    Map<String, Object> parameters = new HashMap<>();
    parameters.put("BILL_ID", invoiceId);
    
    // 4. ดึงข้อมูลจากฐานข้อมูล และเติมลงในรายงานด้วยคำสั่ง fillReport
    try (Connection conn = dataSource.getConnection()) {
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, conn);
        
        // 5. แปลงและส่งออกรายงานที่เสร็จแล้วเป็น Array ของข้อมูลไบนารี PDF
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }
}
```

#### 🔍 อธิบายการทำงานส่วน Service แบบละเอียดรายบรรทัด:
* **`getClass().getResourceAsStream("/reports/demoInvoice.jrxml")`**: 
  ดึงข้อมูลไฟล์เทมเพลตรายงาน (`demoInvoice.jrxml`) ที่เก็บไว้ในแฟ้มข้อมูล `src/main/resources/reports/` ของแอปพลิเคชันออกมาในรูปของ `InputStream` (กระแสข้อมูลไบนารี)
* **`JasperCompileManager.compileReport(reportStream)`**: 
  *ทำไมต้องคอมไพล์?* เนื่องจากไฟล์ `.jrxml` เป็นเพียงข้อความภาษา XML โครงสร้างการลากวางเท่านั้น ระบบของ Java ไม่สามารถคำนวณสูตรหรือใช้ฟังก์ชันสะกดตัวเลขภาษาไทย (เช่น `RuleBasedNumberFormat`) ได้โดยตรง เราจึงต้องใช้ตัว Compile ของ Jasper แปลงจากไฟล์ XML ให้อยู่ในรูปของวัตถุ `JasperReport` ในหน่วยความจำก่อน (เทียบเท่าไฟล์ `.jasper`)
* **`parameters.put("BILL_ID", invoiceId)`**: 
  เป็นการจัดส่งคีย์ Parameter ชื่อ `"BILL_ID"` และค่าของตัวแปร `invoiceId` เข้าสู่กระบวนการออกรายงาน ซึ่งในไฟล์ `.jrxml` จะนำคีย์นี้ไปแมปเข้ากับตัวแปร `$P{BILL_ID}` เพื่อใช้กรองเงื่อนไขคิวรี SQL ของรายงาน (`Where inv.invoice_id = $P{BILL_ID}`)
* **`try (Connection conn = dataSource.getConnection())`**: 
  เป็นการเปิดสายเชื่อมต่อฐานข้อมูล (Database Connection) เพื่อขอดึงข้อมูลมาใช้ทำรายงาน โดยการเขียนไว้ในวงเล็บ `try (...)` เป็นโครงสร้างพิเศษ (เรียกว่า `try-with-resources`) ที่คอยควบคุมว่า **"ไม่ว่าจะออกรายงานสำเร็จหรือเกิด Error พังกลางคัน ระบบจะทำการปิดสายฐานข้อมูลนี้คืนให้อัตโนมัติทันที"** เปรียบเสมือนการบังคับให้วางสายโทรศัพท์เมื่อคุยเสร็จ เพื่อป้องกันปัญหาสายดึงข้อมูลค้างจนฐานข้อมูลเต็ม (Connection Leak) และเดี้ยงในที่สุดครับ
* **`JasperFillManager.fillReport(jasperReport, parameters, conn)`**: 
  เป็นคำสั่งนำเอาโครงร่างรายงานที่คอมไพล์แล้ว (`jasperReport`) ไปประมวลผลดึงข้อมูลจาก SQL โดยใช้การเชื่อมต่อฐานข้อมูล (`conn`) และเติมข้อมูลตามพารามิเตอร์ (`parameters`) ที่ส่งไป จนได้เอกสารรายงานที่มีข้อมูลสมบูรณ์พร้อมพิมพ์ออกมาเป็นวัตถุ `JasperPrint`
* **`JasperExportManager.exportReportToPdf(jasperPrint)`**: 
  รับช่วงต่อจากวัตถุรายงานที่เติมข้อมูลสมบูรณ์แล้ว (`jasperPrint`) มาทำการ Render และส่งออกข้อมูลแปลงเป็นเอกสารไฟล์ PDF ในรูปแบบของอาร์เรย์ไบนารี (`byte[]`) เพื่อส่งต่อให้ Controller
---

### โค้ดส่วน Controller (`InvoiceController.java`)
```java
@GetMapping("/{id}/pdf")
public ResponseEntity<byte[]> downloadInvoicePdf(@PathVariable int id) {
    try {
        // 1. เรียกใช้งาน Service เพื่อเจเนอเรตข้อมูล PDF ออกมาเป็น byte[]
        byte[] pdfBytes = invoiceService.generateInvoicePdf(id);
        
        // 2. ตั้งค่า HttpHeaders เพื่อสื่อสารกับเว็บบราวเซอร์ผู้ใช้งาน
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);

        // สั่งให้บราวเซอร์แสดงผลเป็นหน้าพรีวิว (inline) แทนการขึ้นป๊อปอัปให้กดดาวน์โหลดอัตโนมัติทันที
        headers.setContentDispositionFormData("inline", "invoice-" + id + ".pdf");
        
        // 3. ส่งข้อมูล PDF พร้อม Headers และสถานะ OK กลับไปให้ผู้ใช้งาน
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    } catch (Exception e) {
        // 4. บันทึกประวัติข้อผิดพลาดในระบบหลังบ้าน และส่งสถานะ 500 กลับไป
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
```

#### 🔍 อธิบายการทำงานส่วน Controller แบบละเอียดรายบรรทัด:
* **`@GetMapping("/{id}/pdf")`**: 
  กำหนด URL Endpoint สำหรับขอไฟล์ PDF โดยรับค่าไอดีเอกสารผ่าน Path (เช่น `/api/invoices/1/pdf`)
* **`@PathVariable int id`**: 
  ดึงค่าไอดีของเอกสารจากตำแหน่ง URL ด้านบนเพื่อส่งต่อให้กับ Service นำไปค้นหาเอกสารในฐานข้อมูล
* **`headers.setContentType(MediaType.APPLICATION_PDF)`**: 
  แจ้งประเภทข้อมูลผลลัพธ์กลับไปยังเบราเซอร์ปลายทาง (Content-Type) ให้รับทราบว่าข้อมูลที่ส่งกลับไปนี้ไม่ใช่ข้อมูลข้อความหรือ JSON ทั่วไป แต่เป็นเอกสารไฟล์ PDF
* **`headers.setContentDispositionFormData("inline", ...)`**: 
  * `"inline"`: แจ้งคำสั่งแก่หน้าเว็บเบราว์เซอร์ให้ทำการเปิดหน้าจอพรีวิวดูเนื้อหาไฟล์ PDF ขึ้นมาบนหน้าเบราว์เซอร์ทันที
  * `"attachment"`: หากต้องการบังคับให้ดาวน์โหลดลงเครื่องทันทีเมื่อคลิก ให้เปลี่ยนค่าตรงนี้เป็นคำสั่ง `"attachment"` แทน
* **`ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()`**: 
  ทำหน้าที่ส่ง HTTP Status **500 Internal Server Error** กลับไปยังฝั่งไคลเอนต์ (React) หากเกิดข้อผิดพลาดใด ๆ ขึ้นระหว่างการสร้างไฟล์ (เช่น ปัญหาระบบฐานข้อมูลล่ม หรือระบบค้นหาฟอนต์ไม่เจอ) พร้อมทั้งสั่งบันทึกการสแต็ก Trace ด้วย `e.printStackTrace()` ลงใน System Console หลังบ้านเพื่อการสืบค้นย้อนหลัง

---

## 📌 ขั้นตอนที่ 5: การดึงไฟล์ PDF มาเปิดแสดงผลฝั่ง React

การดึงข้อมูลจาก API หลังบ้านมาสร้างเป็นลิงก์เปิดดูบนบราวเซอร์หน้าต่างใหม่:

```javascript
import axios from 'axios';

const handlePrintReceipt = async (paymentId) => {
    try {
        // ยิงดึงไฟล์เป็นชนิด blob (Binary Large Object)
        const response = await axios.get(`http://localhost:8081/api/reports/receipt/${paymentId}`, {
            responseType: 'blob' 
        });

        // แปลงไบนารี PDF ให้กลายเป็น URL ชั่วคราวของเบราว์เซอร์
        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);

        // เปิดหน้าต่างใหม่เพื่อแสดงผล PDF และพร้อมสั่งพริ้นท์ทันที
        window.open(fileURL, '_blank');

    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดใบเสร็จ:", error);
        alert("ไม่สามารถสร้างไฟล์ใบเสร็จได้ กรุณาลองใหม่อีกครั้ง");
    }
};
```
