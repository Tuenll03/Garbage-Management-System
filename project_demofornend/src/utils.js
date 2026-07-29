const utils = {
  //Login
  //Format Citizen ID
  formatCitizenId: (value) => {
    if (!value) return '';
    const clean = value.replace(/\D/g, '').substring(0, 13);
    const parts = [];
    if (clean.length > 0) parts.push(clean.substring(0, 1));
    if (clean.length > 1) parts.push(clean.substring(1, 5));
    if (clean.length > 5) parts.push(clean.substring(5, 10));
    if (clean.length > 10) parts.push(clean.substring(10, 12));
    if (clean.length > 12) parts.push(clean.substring(12, 13));
    return parts.join('-');
  },
  //Format Password
  cleanPassword: (value) => {
    if (!value) return '';
    return value.replace(/\D/g, '').substring(0, 50);
  },
  //ทำหน้าเรียก citizenid ที่บันทึกเบราว์เซอร์
  getSavedCitizenId: () => localStorage.getItem('rememberedCitizenId'),
  //ทำหน้าที่บันทึก citizenid เบราว์เซอร์
  saveCitizenId: (id) => localStorage.setItem('rememberedCitizenId', id),
  //ทำหน้าที่ลบ citizenid เบราว์เซอร์
  clearCitizenId: () => localStorage.removeItem('rememberedCitizenId'),

  //Register
  //Format First Name
  cleanFirstName: (value) => {
    if (!value) return '';
    return value.replace(/[^ก-ฮะ-์]/g, '').substring(0, 50);
  },
  //Format Last Name
  cleanLastName: (value) => {
    if (!value) return '';
    return value.replace(/[^ก-ฮะ-์]/g, '').substring(0, 50);
  },
  //Format Birth
  formatBirth: (value) => {
    if (!value) return '';
    const clean = value.replace(/\D/g, '').substring(0, 8);
    let parts = [];
    if (clean.length > 0) parts.push(clean.substring(0, 2));
    if (clean.length > 2) parts.push(clean.substring(2, 4));
    if (clean.length > 4) parts.push(clean.substring(4, 8));
    return parts.join('-');
  },
  //Format Phone
  formatPhone: (value) => {
    if (!value) return '';
    const clean = value.replace(/\D/g, '').substring(0, 10);
    let parts = [];
    if (clean.length > 0) parts.push(clean.substring(0, 3));
    if (clean.length > 3) parts.push(clean.substring(3, 6));
    if (clean.length > 6) parts.push(clean.substring(6, 10));
    return parts.join('-');
  },
  //Format HouseNumber
  formatRegisteredHouseNumber: (value) => {
    if (!value) return '';
    // กรองเอาเฉพาะตัวเลข [0-9] และเครื่องหมาย / เท่านั้น (ยาวสูงสุด 10 ตัวอักษร)
    return value.replace(/[^0-9/]/g, '').substring(0, 10);
  },
  //Format VillageNo
  formatRegisteredVillageNo: (value) => {
    if (!value) return '';
    // กรองเอาเฉพาะตัวเลข [0-9]  เท่านั้น (ยาวสูงสุด 10 ตัวอักษร)
    return value.replace(/[^0-9]/g, '').substring(0, 10);
  },
  // ทำหน้าที่ทำความสะอาด citizenid
  cleanCitizenId: (citizenId) => {
    if (!citizenId) return '';
    return citizenId.replace(/\D/g, '');
  },
  // ทำหน้าที่ทำความสะอาด phone
  cleanPhone: (phone) => {
    if (!phone) return '';
    return phone.replace(/\D/g, '');
  },
  //Formate Birth
  cleanBirth: (birth) => {
    if (!birth) return null;
    const pattern = /^(\d{2})-(\d{2})-(\d{4})$/;
    const m = birth.trim().match(pattern);
    if (!m) return null;
    const day = parseInt(m[1], 10);
    const month = parseInt(m[2], 10);
    const yearBE = parseInt(m[3], 10);
    const yearCE = yearBE - 543;
    const d = new Date(yearCE, month - 1, day);
    if (d.getFullYear() !== yearCE ||
      d.getMonth() !== month - 1 ||
      d.getDate() !== day) return null;
    return `${yearCE}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  },

  //Format VillageName
  formatVillageName: (value) => {
    if (!value) return '';
    return value.replace(/[^ก-ฮะ-์]/g, '').substring(0, 50);
  },
  //Format Detail
  formatDetail: (value) => {
    if (!value) return '';
    return value.replace(/[^ก-ฮะ-์]/g, '').substring(0, 255);
  },
  // ทำหน้าที่ทำความสะอาด date
  cleanDate: (date) => {
    if (!date || !(date instanceof Date)) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มจาก 0 จึงต้องบวก 1
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  },
  //ViewProfile
  maskCitizenId: (value) => {
    if (!value) return '';
    // 1. ดึงเฉพาะตัวเลขออกมา
    const clean = value.replace(/\D/g, '');
    // 2. ดึงมาแค่ 4 ตัวแรก (เช่น 1100) และเติมตัว 'X' หรือ '*' ให้ครบ 13 หลัก
    const masked = clean.substring(0, 4).padEnd(13, 'X');

    // 3. จัด Format ให้มีขีดคั่นแบบเลขบัตรประชาชน
    const parts = [];
    parts.push(masked.substring(0, 1));
    parts.push(masked.substring(1, 5));
    parts.push(masked.substring(5, 10));
    parts.push(masked.substring(10, 12));
    parts.push(masked.substring(12, 13));
    return parts.join('-');
  },
  // chang ce to be
  convertCEtoBE: (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const yearCE = parseInt(parts[0], 10);
    const month = parts[1];
    const day = parts[2];
    const yearBE = yearCE + 543; // แปลง ค.ศ. เป็น พ.ศ.
    return `${day}-${month}-${yearBE}`;
  },
  // แปลง เดือน เป็น ภาษาไทย
  formatThaiDate: (dateStr) => {
    const MONTHS = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const day = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1;
    const year = parts[2];
    return `${day} ${MONTHS[monthIndex] || ''} ${year}`;
  }
}

export default utils;