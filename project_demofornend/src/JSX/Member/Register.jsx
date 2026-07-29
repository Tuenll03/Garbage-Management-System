import React, { useState } from 'react';
import axios from 'axios';
import '../../CSS/Register.css';
import utils from '../../utils';
import validate from '../../validate';
import PersonalInfoForm from './Register/PersonalInfoForm';
import AddressForm from './Register/AddressForm';

function Register({ onNavigate }) {
  const [citizenId, setCitizenId] = useState('');
  const [prefix, setPrefix] = useState('นาย');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birth, setBirth] = useState('');
  const [password, setPassword] = useState('');
  const [registeredHouseNumber, setRegisteredHouseNumber] = useState('');
  const [registeredVillageNo, setRegisteredVillageNo] = useState('');
  const [registeredSubdistrict, setRegisteredSubdistrict] = useState('ทุ่งหัวช้าง');
  const [registeredDistrict, setRegisteredDistrict] = useState('ทุ่งหัวช้าง');
  const [registeredProvince, setRegisteredProvince] = useState('ลำพูน');
  const [registeredPostalCode, setRegisteredPostalCode] = useState('51160');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleCitizenIdChange = (e) => {
    const formatted = utils.formatCitizenId(e.target.value);
    setCitizenId(formatted);
  };

  const handlePasswordChange = (e) => {
    const clean = utils.cleanPassword(e.target.value);
    setPassword(clean);
  };

  const handleFirstNameChange = (e) => {
    const clean = utils.cleanFirstName(e.target.value);
    setFirstName(clean);
  };

  const handleLastNameChange = (e) => {
    const clean = utils.cleanLastName(e.target.value);
    setLastName(clean);
  };
  
  const handleBirthChange = (e) => {
    const formatted = utils.formatBirth(e.target.value);
    setBirth(formatted);
  };

  const handlePhoneChange = (e) => {
    const formatted = utils.formatPhone(e.target.value);
    setPhone(formatted);
  };

  const handleRegisteredHouseNumberChange = (e) => {
    const formatted = utils.formatRegisteredHouseNumber(e.target.value);
    setRegisteredHouseNumber(formatted);
  };

  const handleRegisteredVillageNoChange = (e) => {
    const formatted = utils.formatRegisteredVillageNo(e.target.value);
    setRegisteredVillageNo(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedBirth = utils.cleanBirth(birth);

    const errorMsg = validate.vlaidateRegister(
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
    );

    if (errorMsg) {
      setMessage(errorMsg);
      setIsError(true);
      return;
    }

    const data = {
      citizenId: utils.cleanCitizenId(citizenId),
      prefix: prefix,
      firstName: firstName,
      lastName: lastName,
      birth: cleanedBirth,
      password: password,
      registeredHouseNumber: registeredHouseNumber,
      registeredVillageNo: registeredVillageNo,
      registeredSubdistrict: registeredSubdistrict,
      registeredDistrict: registeredDistrict,
      registeredProvince: registeredProvince,
      registeredPostalCode: registeredPostalCode,
      phone: utils.cleanPhone(phone)
    };

    try {
      const response = await axios.post('http://localhost:8081/api/members', data);
      if (response.data === 'success') {
        setMessage('ลงทะเบียนสมาชิกสำเร็จ! กำลังนำคุณกลับไปหน้าเข้าสู่ระบบ...');
        setIsError(false);
        setTimeout(() => {
          onNavigate('login');
        }, 2000);
      } else {
        setMessage(response.data);
        setIsError(true);
      }
    } catch (error) {
      setMessage(' เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      setIsError(true);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <form onSubmit={handleSubmit} className="register-form">
          
          {/* Section 1: ข้อมูลส่วนตัว */}
          <PersonalInfoForm
            citizenId={citizenId}
            onCitizenIdChange={handleCitizenIdChange}
            prefix={prefix}
            onPrefixChange={setPrefix}
            firstName={firstName}
            onFirstNameChange={handleFirstNameChange}
            lastName={lastName}
            onLastNameChange={handleLastNameChange}
            birth={birth}
            onBirthChange={handleBirthChange}
            phone={phone}
            onPhoneChange={handlePhoneChange}
            password={password}
            onPasswordChange={handlePasswordChange}
            showPassword={showPassword}
            onToggleShowPassword={() => setShowPassword(!showPassword)}
          />

          {/* Section 2: ที่อยู่ตามทะเบียนบ้าน */}
          <AddressForm
            registeredHouseNumber={registeredHouseNumber}
            onRegisteredHouseNumberChange={handleRegisteredHouseNumberChange}
            registeredVillageNo={registeredVillageNo}
            onRegisteredVillageNoChange={handleRegisteredVillageNoChange}
            registeredPostalCode={registeredPostalCode}
            onRegisteredPostalCodeChange={setRegisteredPostalCode}
            registeredSubdistrict={registeredSubdistrict}
            onRegisteredSubdistrictChange={setRegisteredSubdistrict}
            registeredDistrict={registeredDistrict}
            registeredProvince={registeredProvince}
          />

          <button type="submit" className="submit-btn">สมัครเข้าสู่ระบบ</button>
        </form>

        {/* Message Alert Banner */}
        {message && (
          <div className={`message-alert ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {/* Back to Login Link */}
        <div className="back-to-login-container">
          <span>เป็นสมาชิกอยู่แล้วใช่หรือไม่?</span>
          <a href="#login" onClick={(e) => { e.preventDefault(); onNavigate('login'); }} className="back-to-login-link">
            เข้าสู่ระบบที่นี่
          </a>
        </div>
      </div>
    </div>
  );
}

export default Register;
