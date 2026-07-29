# คู่มือการติดตั้งและใช้งาน JasperReports ในระบบเทศบาล 📄✨

คู่มือนี้จะอธิบายขั้นตอนการทำระบบออกใบเสร็จรับเงิน PDF ด้วย **JasperReports** ร่วมกับหลังบ้าน **Spring Boot (Java)** และหน้าบ้าน **React** โดยเรียงลำดับขั้นตอนที่จำเป็นเพื่อให้ทำงานง่ายและเข้าใจง่ายที่สุด

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

ให้เปิดไฟล์ `pom.xml` ของหลังบ้าน Spring Boot แล้วเพิ่มไลบรารีของ JasperReports เข้าไปในบล็อก `<dependencies>` ดังนี้ครับ:

```xml
<!-- JasperReports Library -->
<dependency>
    <groupId>net.sf.jasperreports</groupId>
    <artifactId>jasperreports</artifactId>
    <version>6.20.0</version>
</dependency>
```

---

## 📌 ขั้นตอนที่ 3: วิธีป้องกันฟอนต์ภาษาไทยพัง (Font Extension)

เพื่อไม่ให้ตัวอักษรภาษาไทยแสดงผลเพี้ยน หรือกลายเป็นช่องสี่เหลี่ยม เราจะนำฟอนต์ภาษาไทย (เช่น `THSarabunNew.ttf` หรือ `Kanit-Regular.ttf`) ใส่เข้าไปในโฟลเดอร์ของ Java ตรง ๆ ครับ:

1. นำไฟล์ฟอนต์ `.ttf` ไปเซฟไว้ในโฟลเดอร์: `src/main/resources/fonts/`
2. สร้างไฟล์ชื่อ `jasperreports_extension.properties` ไว้ในโฟลเดอร์ `src/main/resources/` ใส่บรรทัดนี้:
   ```properties
   net.sf.jasperreports.extension.registry.factory.fonts=net.sf.jasperreports.engine.fonts.SimpleFontExtensionsRegistryFactory
   net.sf.jasperreports.extension.simple.font.families.fonts=fonts/fonts.xml
   ```
3. สร้างไฟล์ชื่อ `fonts.xml` ไว้ในโฟลเดอร์ `src/main/resources/fonts/` เพื่อแมปฟอนต์ดังนี้:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <fontFamilies>
       <fontFamily name="TH Sarabun New">
           <normal>fonts/THSarabunNew.ttf</normal>
           <bold>fonts/THSarabunNew-Bold.ttf</bold>
           <pdfEncoding>Identity-H</pdfEncoding>
           <pdfEmbedded>true</pdfEmbedded>
       </fontFamily>
   </fontFamilies>
   ```

---

## 📌 ขั้นตอนที่ 4: การเขียนโค้ด Java ดึงข้อมูลมาเติมในรายงาน

สร้างส่วนบริการ **Service** ใน Java เพื่อทำหน้าที่โหลดไฟล์เทมเพลต ดึงข้อมูลมาเติม และส่งกลับไปเป็นสตรีมข้อมูล PDF:

```java
package com.example.demo.service;

import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.stereotype.Service;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReceiptReportService {

    public byte[] generateReceiptPdf(Map<String, Object> parameters, List<?> billingItems) throws Exception {
        // 1. โหลดเทมเพลตใบเสร็จจากโฟลเดอร์ Resources
        InputStream reportStream = getClass().getResourceAsStream("/reports/receipt.jrxml");
        
        // 2. คอมไพล์ไฟล์ดีไซน์เป็น JasperReport
        JasperReport jasperReport = JasperCompileManager.compileReport(reportStream);
        
        // 3. ผูกข้อมูลรายการบิล (Fields)
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(billingItems);
        
        // 4. ผสมพารามิเตอร์และตารางข้อมูลเข้าด้วยกัน
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);
        
        // 5. ส่งออกเป็นอาร์เรย์ข้อมูลไบนารี PDF
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }
}
```

และเขียน **Controller** เพื่อยิง API ให้บราวเซอร์กดเรียกดาวน์โหลดได้:

```java
package com.example.demo.controller;

import com.example.demo.service.ReceiptReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReceiptReportService receiptReportService;

    @GetMapping("/receipt/{paymentId}")
    public ResponseEntity<byte[]> getReceiptPdf(@PathVariable Integer paymentId) {
        try {
            // ดึงข้อมูลและกำหนดพารามิเตอร์ เช่น ชื่อและที่อยู่จากฐานข้อมูล
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("receipt_id", "REC-" + paymentId);
            parameters.put("member_name", "นายสมชาย ใจดี");
            parameters.put("payment_date", "26 กรกฎาคม 2569");

            // รายการสิ่งของที่จะแสดงในใบเสร็จ
            ArrayList<Map<String, Object>> billingItems = new ArrayList<>();
            Map<String, Object> item1 = new HashMap<>();
            item1.put("service_type", "ค่าธรรมเนียมจัดเก็บขยะทั่วไป");
            item1.put("amount_paid", 150.0);
            billingItems.add(item1);

            // ผลิตไฟล์ PDF
            byte[] pdfBytes = receiptReportService.generateReceiptPdf(parameters, billingItems);

            // ส่งข้อมูลกลับไปหา React ในรูปแบบ PDF
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "receipt-" + paymentId + ".pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
```

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
