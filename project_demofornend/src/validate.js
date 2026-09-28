const validate = {
    // validate page Login
    validateLogin: (citizenId, password) => {
        if (!citizenId) {
            return "กรุณากรอกข้อมูลให้ถูกต้อง";
        }

        if (!password) {
            return "กรุณากรอกข้อมูลให้ถูกต้อง";
        }
        return null;
    },
    // validate page register member
    validateRegisterMember: (
        citizenId,
        firstName,
        lastName,
        birth,
        phone,
        password,
        registeredHouseNumber,
        registeredVillageNo,
        cleanedBirth
    ) => {
        // ตรวจสอบข้อมูลก่อนส่งฟอร์ม (เรียงลำดับจากบนลงล่าง)
        const cleanedId = citizenId ? citizenId.replace(/\D/g, '') : '';
        if (!cleanedId || !cleanedId.match(/^\d{13}$/)) {
            return "กรุณากรอกเลขประจำตัวประชาชนให้ครบ 13 หลัก";
        }

        if (!firstName || firstName.length < 2 || firstName.length > 50) {
            return "กรุณากรอกชื่อความยาว 2-50 ตัวอักษร";
        }

        if (!lastName || lastName.length < 2 || lastName.length > 50) {
            return "กรุณากรอกนามสกุลความยาว 2-50 ตัวอักษร";
        }

        if (!birth) {
            return "กรุณากรอกข้อมูล วันเดือนปีเกิด";
        }

        const birthPattern = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/;
        const match = birth.match(birthPattern);
        if (!match) {
            return "วันเดือนปีเกิดต้องอยู่ในรูปแบบ วัน-เดือน-ปี พ.ศ. (เช่น 14-05-2545)";
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
            return "กรุณากรอกเบอร์โทรศัพท์";
        }

        const formatPhone = /^(06|08|09)[0-9]{8}$/
        const validatePhone = phone.replace(/-/g, '')
        if (!formatPhone.test(validatePhone)) {
            return "เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 06, 08 หรือ 09 และมี 10 หลัก";
        }


        if (!password) {
            return "กรุณากรอกข้อมูล รหัสผ่าน";
        }


        if (!registeredHouseNumber) {
            return "กรุณากรอกบ้านเลขที่";
        }

        if (!registeredVillageNo) {
            return "กรุณากรอกหมู่ที่";
        }

        return null;
    },

    // alias รองรับชื่อเดิม
    get vlaidateRegister() {
        return this.validateRegisterMember;
    },

    //validate page requestservice
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
            return "กรุณาเลือก หมู่ที่";
        }


        if (!villageName) {
            return "กรุณาเลือก ชื่อหมู่บ้าน";
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
    },

    manageAnnouncements: (
        topic,
        detail,
        date
    ) => {
        if (!topic) {
            return "กรุณากรอกข้อมูล หัวข้อข่าวสาร";
        }

        if (topic.length < 2 || topic.length > 50) {
            return "กรุณากรอกข้อมูล หัวข้อข่าวสาร 2-50 ตัวอักษร";
        }

        if (!date) {
            return "กรุณากรอกข้อมูล วันที่";
        }

        if (!detail) {
            return "กรุณากรอกข้อมูล รายละเอียด";
        }

        if (detail.length < 15) {
            return "กรุณากรอกข้อมูล รายละเอียด 15 ตัวอักษรขึ้นไป";
        }
    },

    vlaidateAddOfficer: (
        citizenId,
        position,
        firstName,
        lastName,
        password,

    ) => {

        const cleanedId = citizenId ? citizenId.replace(/\D/g, '') : '';
        if (!cleanedId || !cleanedId.match(/^\d{13}$/)) {
            return "กรุณากรอกข้อมูล เลขประจำตัวประชาชน";
        }


        if (!position || position.length < 2 || position.length > 50) {
            return "กรุณากรอกข้อมูล ตำแหน่ง";
        }

        if (!firstName || firstName.length < 2 || firstName.length > 50) {
            return "กรุณากรอกข้อมูล ชื่อ";
        }

        if (!lastName || lastName.length < 2 || lastName.length > 50) {
            return "กรุณากรอกข้อมูล สกุล";
        }

        if (!password || password.length < 2 || password.length > 50) {
            return "กรุณากรอกข้อมูล รหัสผ่าน";
        }


    }
}
export default validate;