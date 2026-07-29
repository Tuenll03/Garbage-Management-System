const validate = {
    validateLogin: (citizenId, password) => {
        // validate page Login
        if (!citizenId) {
            return "กรุณากรอกข้อมูลให้ถูกต้อง";
        }

        if (!password) {
            return "กรุณากรอกข้อมูลให้ถูกต้อง";
        }
        return null;
    },
    // validate page register
    vlaidateRegister: (
        citizenId,
        prefix,
        firstName,
        lastName,
        birth,
        password,
        registeredHouseNumber,
        registeredVillageNo,
        phone,
        cleanedBirth
    ) => {
        // ตรวจสอบข้อมูลก่อนส่งฟอร์ม (เรียงลำดับจากบนลงล่าง)
        const cleanedId = citizenId ? citizenId.replace(/\D/g, '') : '';
        if (!cleanedId || !cleanedId.match(/^\d{13}$/)) {
            return "กรุณากรอกข้อมูล เลขประจำตัวประชาชน";
        }

        if (!firstName || firstName.length < 2 || firstName.length > 50) {
            return "กรุณากรอกข้อมูล ชื่อ";
        }

        if (!lastName || lastName.length < 2 || lastName.length > 50) {
            return "กรุณากรอกข้อมูล นามสกุล";
        }


        if (!password) {
            return "กรุณากรอกข้อมูล รหัสผ่าน";
        }


        if (!birth) {
            return "กรุณากรอกข้อมูล วันเดือนปีเกิด";
        }

        const birthPattern = /^(\d{2})-(\d{2})-(\d{4})$/;
        const match = birth.match(birthPattern);
        if (!match) {
            return "วันเดือนปีเกิดต้องอยู่ในรูปแบบ วัน-เดือน-ปี พ.ศ. (เช่น 14-05-2564)";
        }

        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const yearBE = parseInt(match[3], 10);
        const yearCE = yearBE - 543;

        const birthDate = new Date(yearCE, month - 1, day);
        if (
            birthDate.getFullYear() !== yearCE ||
            birthDate.getMonth() !== month - 1 ||
            birthDate.getDate() !== day
        ) {
            return "วันเดือนปีเกิดไม่ถูกต้อง";
        }
        const today = new Date();
        if (birthDate >= today) {
            return "วันเดือนปีเกิดต้องเป็นวันที่ในอดีต";
        }

        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 20) {
            return "ผู้สมัครต้องมีอายุตั้งแต่ 20 ปีขึ้นไป";
        }

        if (age > 100) {
            return "ผู้สมัครต้องมีอายุไม่เกิน 100 ปี";
        }

        if (!cleanedBirth) {
            return 'รูปแบบวันเกิดไม่ถูกต้อง หรือวันที่ไม่เป็นจริง';
        }

        if (!phone) {
            return "กรุณากรอกข้อมูลให้ถูกต้อง";
        }

        const formatPhone = /^(06|08|09)[0-9]{8}$/
        const validatePhone = phone.replace(/-/g, '')
        if (!formatPhone.test(validatePhone)) {
            return "เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 06, 08, หรือ 09 เบอร์โทรศัพท์ต้องประกอบด้วยตัวเลขเท่านั้น และมีความยาว 10 ตัว";
        }


        if (!registeredHouseNumber) {
            return "กรุณากรอกข้อมูล  บ้านเลขที่";
        }

        if (!registeredVillageNo) {
            return "กรุณากรอกข้อมูล หมู่ที่";
        }

        return null;
    },
    validateRequestService: (
        houseNumber,
        villageNo,
        villageName,
        detail
    ) => {
        if (!houseNumber) {
            return "กรุณากรอกข้อมูล บ้านเลขที่";
        }

        if (!villageNo) {
            return "กรุณากรอกข้อมูล หมู่ที่";
        }

        if (villageNo.length < 0) {
            return "ห้ามกรอกเลข 0";
        }

        if (!villageName) {
            return "กรุณากรอกข้อมูล ชื่อหมู่บ้าน";
        }

        if (villageName.length < 9) {
            return "กรุณากรอกชื่อหมู่บ้าน 9 ตัวอักษรขึ้นไป";
        }

        if (!detail) {
            return "กรุณากรอกข้อมูล รายละเอียด";
        }

        if (detail.length < 15) {
            return "กรุณากรอกรายละเอียด 15 ตัวอักษรขึ้นไป";
        }

        return null;
    },
    validateUpdateProfile: (
        firstName,
        lastName,
        birth,
        phone,
        registeredHouseNumber,
        registeredVillageNo,
    ) => {

        if (!firstName || firstName.length < 2 || firstName.length > 50) {
            return "กรุณากรอกข้อมูล ชื่อ";
        }

        if (!lastName || lastName.length < 2 || lastName.length > 50) {
            return "กรุณากรอกข้อมูล นามสกุล";
        }
        if (!birth) {
            return "กรุณากรอกข้อมูล วันเดือนปีเกิด";
        }

        const birthPattern = /^(\d{2})-(\d{2})-(\d{4})$/;
        const match = birth.match(birthPattern);
        if (!match) {
            return "วันเดือนปีเกิดต้องอยู่ในรูปแบบ วัน-เดือน-ปี พ.ศ. (เช่น 14-05-2564)";
        }

        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const yearBE = parseInt(match[3], 10);
        const yearCE = yearBE - 543;

        const birthDate = new Date(yearCE, month - 1, day);
        if (
            birthDate.getFullYear() !== yearCE ||
            birthDate.getMonth() !== month - 1 ||
            birthDate.getDate() !== day
        ) {
            return "วันเดือนปีเกิดไม่ถูกต้อง";
        }
        const today = new Date();
        if (birthDate >= today) {
            return "วันเดือนปีเกิดต้องเป็นวันที่ในอดีต";
        }

        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 20) {
            return "ผู้สมัครต้องมีอายุตั้งแต่ 20 ปีขึ้นไป";
        }

        if (age > 100) {
            return "ผู้สมัครต้องมีอายุไม่เกิน 100 ปี";
        }


        if (!phone) {
            return "กรุณากรอกข้อมูลให้ถูกต้อง";
        }

        const formatPhone = /^(06|08|09)[0-9]{8}$/
        const validatePhone = phone.replace(/-/g, '')
        if (!formatPhone.test(validatePhone)) {
            return "เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 06, 08, หรือ 09 เบอร์โทรศัพท์ต้องประกอบด้วยตัวเลขเท่านั้น และมีความยาว 10 ตัว";
        }

        if (!registeredHouseNumber) {
            return "กรุณากรอกข้อมูล  บ้านเลขที่";
        }

        if (!registeredVillageNo) {
            return "กรุณากรอกข้อมูล หมู่ที่";
        }

    },
    validateUpdateService: (
        detail
    ) => {
        if (!detail) {
            return "กรุณากรอกข้อมูล รายละเอียด";
        }

        if (detail.length < 15) {
            return "กรุณากรอกรายละเอียด 15 ตัวอักษรขึ้นไป";
        }



    }



}
export default validate;