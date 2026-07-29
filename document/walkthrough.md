# บันทึกสรุปการปรับปรุงระบบหลังบ้าน (Backend API Refactoring Walkthrough)

เอกสารนี้สรุปการแก้ไขปรับปรุงโครงสร้างโค้ดหลังบ้าน (Backend Code Cleanup) เพื่อให้เป็นระเบียบตามมาตรฐาน และแก้ไขข้อผิดพลาดในเรื่องของคีย์หลักของฐานข้อมูลชนกัน

---

## 1. รายละเอียดการปรับปรุงโค้ด (Code Changes)

### 🛠️ การตั้งค่าการสร้างไอดีอัตโนมัติ (Auto-increment)
แก้ไขปัญหา `Duplicate entry` และ `doesn't have a default value` โดยการใส่ข้อกำหนดสร้างไอดีอัตโนมัติที่คีย์หลักของเอนทิตีที่เหลือ:
* **[Service.java](file:///d:/2568/2568_2/project_demo01/src/main/java/com/example/demo/entity/Service.java)**: เพิ่ม `@GeneratedValue(strategy = GenerationType.IDENTITY)` ในฟิลด์ `serviceId`
* **[Announcement.java](file:///d:/2568/2568_2/project_demo01/src/main/java/com/example/demo/entity/Announcement.java)**: เพิ่ม `@GeneratedValue(strategy = GenerationType.IDENTITY)` ในฟิลด์ `announcementId`

### 📁 แก้ไขชื่อไฟล์สะกดผิด (Naming Typo Fixes)
* สร้าง [MemberController.java](file:///d:/2568/2568_2/project_demo01/src/main/java/com/example/demo/controller/MemberController.java) และเปลี่ยนชื่อคลาสเป็น `MemberController` เพื่อแทนที่ตัวเดิมที่สะกดผิด (`MemberContrller`)
* สร้าง [BackendApiController.java](file:///d:/2568/2568_2/project_demo01/src/main/java/com/example/demo/controller/BackendApiController.java) และเปลี่ยนชื่อคลาสเป็น `BackendApiController` เพื่อแทนที่ตัวเดิมที่สะกดผิด (`BlackendApiController`)
* เคลียร์เนื้อหาไฟล์เก่าให้เป็นค่าว่างเพื่อความปลอดภัยและไม่ให้ระบบสแกนเส้นทางชนกัน

### 🔗 จัดระเบียบเส้นทาง API (API Mappings)
ปรับปรุงค่าพาธให้ขึ้นต้นด้วย `/api/` และใช้คำนามที่สื่อความหมายเหมือนกันหมดในทุกคอนโทรลเลอร์:
* **Member**: [MemberController.java](file:///d:/2568/2568_2/project_demo01/src/main/java/com/example/demo/controller/MemberController.java) -> `/api/members`
* **Admin**: [AdminController.java](file:///d:/2568/2568_2/project_demo01/src/main/java/com/example/demo/controller/AdminController.java) -> `/api/admins`
* **Service**: [ServiceController.java](file:///d:/2568/2568_2/project_demo01/src/main/java/com/example/demo/controller/ServiceController.java) -> `/api/services`
* **Invoice**: [InvoiceController.java](file:///d:/2568/2568_2/project_demo01/src/main/java/com/example/demo/controller/InvoiceController.java) -> `/api/invoices`
* **Payment**: [PaymentController.java](file:///d:/2568/2568_2/project_demo01/src/main/java/com/example/demo/controller/PaymentController.java) -> `/api/payments`
* **Officer**: [OfficerController.java](file:///d:/2568/2568_2/project_demo01/src/main/java/com/example/demo/controller/OfficerController.java) -> `/api/officers`
* **Announcement**: [AnnouncementController.java](file:///d:/2568/2568_2/project_demo01/src/main/java/com/example/demo/controller/AnnouncementController.java) -> `/api/announcements`

### 🌐 คอนฟิก CORS ส่วนกลาง (Global CORS Setup)
* สร้างคลาสคอนฟิก [CorsConfig.java](file:///d:/2568/2568_2/project_demo01/src/main/java/com/example/demo/config/CorsConfig.java) เพื่อเปิดสิทธิ์การดึงข้อมูลจากภายนอกทุกเส้นทาง (`/**`) จากทุกโดเมนและพอร์ต
* ลบโค้ด `@CrossOrigin(origins = "*")` ในแต่ละคอนโทรลเลอร์ออกทั้งหมดเพื่อความสะอาดและง่ายแก่การตั้งค่าจากจุดเดียว

---

## 2. ขั้นตอนการเคลียร์ฐานข้อมูลเดิม (Database Reset Steps)

> [!WARNING]
> การลบตาราง (Drop Table) จะทำให้ข้อมูลจำลองเดิมทั้งหมดหายไป แต่จะช่วยสร้างตารางที่มีความสัมพันธ์และคีย์หลักที่สมบูรณ์แบบโดยไร้ปัญหาระบบค้าง

รันสคริปต์นี้ในฐานข้อมูล MySQL เพื่อเคลียร์โครงสร้างตารางเดิมก่อน (โดยต้องเรียงลำดับการลบจากตารางย่อยที่มี Foreign Key ก่อนเพื่อไม่ให้ติด Constraint):

```sql
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS invoice;
DROP TABLE IF EXISTS service;
DROP TABLE IF EXISTS announcement;
```

เมื่อสั่งรันสคริปต์ด้านบนเรียบร้อยแล้ว ให้สั่ง **Restart Spring Boot** ตัว Hibernate จะอ่านโค้ดใน Entity ที่แก้ไขใหม่ และสร้างตารางขึ้นมาใหม่แบบ `AUTO_INCREMENT` ตั้งแต่เลข 1 ให้โดยอัตโนมัติ

---

## 3. สรุปเส้นทางการเรียกใช้งาน API ใหม่ (New API Routes)

| ฟีเจอร์ / Entity | พาธควบคุม (Base Path) | ตัวอย่างการยิงดึงข้อมูล (GET) |
| :--- | :--- | :--- |
| **Member** | `/api/members` | `GET http://localhost:8081/api/members` <br> `GET http://localhost:8081/api/members/{id}` |
| **Admin** | `/api/admins` | `GET http://localhost:8081/api/admins` <br> `GET http://localhost:8081/api/admins/{id}` |
| **Service** | `/api/services` | `GET http://localhost:8081/api/services` <br> `GET http://localhost:8081/api/services/member/{memberId}` |
| **Invoice** | `/api/invoices` | `GET http://localhost:8081/api/invoices` <br> `GET http://localhost:8081/api/invoices/member/{memberId}` |
| **Payment** | `/api/payments` | `GET http://localhost:8081/api/payments` <br> `GET http://localhost:8081/api/payments/member/{memberId}` |
| **Officer** | `/api/officers` | `GET http://localhost:8081/api/officers` <br> `GET http://localhost:8081/api/officers/{id}` |
| **Announcement** | `/api/announcements` | `GET http://localhost:8081/api/announcements` |

---

## 4. ข้อเสนอแนะฟีเจอร์เพิ่มเติมสำหรับพัฒนาระบบจริง (Missing Backend Features Roadmap)

หัวข้อด้านล่างนี้คือระบบย่อยที่แนะนำให้พัฒนาเพิ่มเติมสำหรับการนำไปทำหน้าบ้าน (Frontend) เพื่อใช้งานจริง:

1. **ระบบล็อกอินตรวจสอบสิทธิ์ (Login / Authentication)**
   - **ปัญหา:** มีฟิลด์ `password` ใน Entity แต่ยังไม่มี API ตรวจสอบว่า Username + Password ถูกต้องหรือไม่
   - **แนวทางแก้ไข:** ควรเพิ่ม Endpoint สำหรับทริกเกอร์การล็อกอิน เช่น `/api/members/login` และ `/api/officers/login` เพื่อตรวจสอบข้อมูลและยืนยันกลับไปยังหน้าบ้าน

2. **ระบบดึงข้อมูลเฉพาะบุคคล (User-scoped Queries)**
   - **ปัญหา:** API ปัจจุบันดึงข้อมูลทั้งหมดมาแสดงผล (เหมาะสำหรับ Admin) แต่ยังไม่มี API ดึงเฉพาะใบแจ้งหนี้หรือประวัติการขอรับบริการของสมาชิกแต่ละคน
   - **แนวทางแก้ไข:** เพิ่ม Endpoint เช่น:
     - `GET /api/invoices/member/{memberId}` (ดึงเฉพาะใบแจ้งหนี้ของสมาชิกที่เจาะจง)
     - `GET /api/services/member/{memberId}` (ดึงประวัติคำร้องของสมาชิกที่เจาะจง)

3. **ฟังก์ชันปฏิเสธการชำระเงิน (Reject Payment Flow)**
   - **ปัญหา:** ระบบมีเฉพาะการกดเปลี่ยนสถานะเป็นชำระเงินแล้วทันทีที่ส่งสลิป แต่ยังไม่มีฟังก์ชันหากสลิปปลอม/ยอดโอนไม่ตรง
   - **แนวทางแก้ไข:** เพิ่มระบบสำหรับตรวจสอบและกดปฏิเสธสลิป (Reject) โดยให้ระบบเปลี่ยนสถานะกลับไปเป็น "ค้างชำระ" หรือ "ชำระเงินไม่ถูกต้อง" เพื่อให้สมาชิกส่งภาพสลิปใบใหม่เข้ามาได้

4. **การคัดกรองประเภทของประกาศ (Announcement Filtering)**
   - **ปัญหา:** ดึงประกาศทุกอันโดยปะปนกัน
   - **แนวทางแก้ไข:** เพิ่มการฟิลเตอร์ตามความสำคัญหรือประเภทของประกาศ (เช่น ประชาสัมพันธ์ทั่วไป หรือ ด่วนที่สุด) เพื่อให้ฝั่งหน้าบ้านสามารถดึงไปแสดงแยกแยะได้ง่ายขึ้น

---

## 5. ทำไมต้องกรองสิทธิ์และแยกการดูข้อมูลที่หลังบ้าน (Backend vs Frontend Data Filtering)

เพื่อความเข้าใจที่ดีในการพัฒนาระบบจริง นี่คือเหตุผลทางวิศวกรรมซอฟต์แวร์ว่าทำไมเราต้องใช้หลังบ้านในการกรองข้อมูลเฉพาะบุคคล แทนที่จะส่งข้อมูลทั้งหมดไปให้หน้าบ้านกรองเอง:

1. **ความปลอดภัยของข้อมูล (Security & PDPA)**
   - **หลักการ:** หากหลังบ้านส่งข้อมูลสมาชิกและธุรกรรมของทุกคนไปให้หน้าบ้านกรองแสดงผล ผู้ใช้ทั่วไปจะสามารถเปิดแท็บ **Inspect (F12) -> Network** ในเบราว์เซอร์ เพื่อแอบดูข้อมูลดิบ (JSON) ของคนอื่นทั้งหมดได้
   - **การป้องกัน:** การกรองที่หลังบ้านด้วยคำสั่ง SQL (`WHERE member_id = ?`) ทำให้หน้าบ้านได้รับข้อมูลเฉพาะส่วนที่ตนเองมีสิทธิ์เข้าถึงเท่านั้น ป้องกันการรั่วไหลของข้อมูลส่วนบุคคล

2. **ประสิทธิภาพและความเร็วในการรับส่งข้อมูล (Performance)**
   - **หลักการ:** หากมีข้อมูลใบแจ้งหนี้เป็นหมื่นๆ รายการ การส่งข้อมูลทั้งหมดไปหน้าบ้านจะทำให้ดาวน์โหลดช้า สิ้นเปลืองแบนด์วิดท์ และทำให้แอปพลิเคชันหน้าบ้านค้างหรือช้ามาก
   - **การป้องกัน:** หลังบ้านทำการกรองและส่งข้อมูลกลับไปเพียง 5-10 รายการที่สัมพันธ์กับคนๆ นั้น ทำให้ระบบทำงานเร็วระดับมิลลิวินาที

3. **ป้องกันการปลอมแปลงสิทธิ์ (Tampering Protection)**
   - **หลักการ:** โค้ดที่รันอยู่บนเบราว์เซอร์ฝั่งหน้าบ้านสามารถแก้ค่าตัวแปรสิทธิ์ (เช่น เปลี่ยนบทบาทตัวเองจาก `MEMBER` เป็น `ADMIN` ในหน่วยความจำชั่วคราว)
   - **การป้องกัน:** การควบคุมสิทธิ์ในการกรองที่หลังบ้านจะปลอดภัยที่สุด เพราะผู้ใช้งานทั่วไปจะไม่สามารถเขียนสคริปต์แก้ไขเงื่อนไขในฐานข้อมูลหลังบ้านได้
