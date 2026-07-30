# ♻️ Garbage Service & Billing Management System

ระบบบริหารจัดการงานบริการและจัดทำเอกสารค่าธรรมเนียมจัดเก็บขยะมูลฝอย พัฒนาขึ้นเพื่อเปลี่ยนผ่านการทำงานของหน่วยงานจัดเก็บขยะในท้องถิ่นให้เป็นระบบดิจิทัล ช่วยลดขั้นตอนการทำงานและอำนวยความสะดวกให้แก่ประชาชน

> ⚠️ **Status: Work In Progress (กำลังอยู่ระหว่างการพัฒนา)**

---

## 🛠️ เทคโนโลยีและเครื่องมือที่ใช้งาน (Technologies Used)

### 🖥️ Backend Stack
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)

### 🎨 Frontend Stack
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### 🗄️ Database & Tools
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

---

## 📂 โครงสร้างระบบ (Project Structure)
ระบบพัฒนาในรูปแบบแยกส่วนการทำงาน (Decoupled Architecture) ระหว่างหน้าบ้านและหลังบ้าน:
* **`project_demo01`**: ฝั่งระบบหลังบ้าน (Backend API) พัฒนาด้วย **Spring Boot (Java)** ในรูปแบบ MVC Architecture 
* **`project_demofornend`**: ฝั่งส่วนติดต่อผู้ใช้ (Frontend Web UI) พัฒนาด้วย **React.js & JavaScript**
* **`document`**: เก็บรวบรวมเอกสารการวิเคราะห์ ออกแบบระบบ และโครงสร้างฐานข้อมูล (ER-Diagram)

---

## 👥 ระบบผู้ใช้งาน (Role-based Access Control)
1.  **Admin (ผู้ดูแลระบบ):** บริหารจัดการภาพรวมระบบ, สมาชิก, เจ้าหน้าที่ และข่าวประชาสัมพันธ์
2.  **Document Officer (เจ้าหน้าที่เอกสาร):** จัดการและออกเอกสารใบแจ้งหนี้ (Invoice) รวมถึงตรวจสอบข้อมูลการชำระเงิน (Payment)
3.  **Member (ประชาชนทั่วไป):** สมัครสมาชิก, ชำระค่าธรรมเนียมขยะรายเดือน, ติดตามข่าวสาร และยื่นคำร้องของานบริการต่าง ๆ

---

## 💡 ฟีเจอร์เด่นของระบบ (Core Modules & Entities)

* **Member Management (`Member`):** ระบบทะเบียนข้อมูลสมาชิกและครัวเรือนผู้รับบริการ
* **Billing & Invoice System (`Invoice`):** ออกใบแจ้งหนี้ค่าธรรมเนียมการจัดเก็บขยะรายเดือนของแต่ละครัวเรือน
* **Payment Tracking (`Payment`):** ระบบบันทึกประวัติการชำระเงินค่าธรรมเนียมและสลิปหลักฐาน
* **Service Request (`Service`):** ระบบยื่นคำร้องขอรับบริการพิเศษ (เช่น การขอถังขยะใหม่, บริการขนย้ายขยะชิ้นใหญ่)
* **Announcement & Notification (`Announcement`, `Notification`):** ระบบประกาศตารางเวลาการเดินรถจัดเก็บขยะ และแจ้งเตือนบิลค้างชำระ

---

## 🚀 ขั้นตอนการติดตั้งและการเริ่มใช้งาน (Setup Instruction)

### 1) การติดตั้งฝั่ง Backend
1. ตรวจสอบให้แน่ใจว่าติดตั้ง Java JDK 17 และ MySQL Database แล้ว
2. เข้าสู่โฟลเดอร์ระบบหลังบ้าน:
   ```bash
   cd project_demo01
