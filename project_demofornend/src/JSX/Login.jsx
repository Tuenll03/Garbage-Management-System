import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/Login.css'
import utils from '../utils';
import validate from '../validate';



function Login({ onNavigate }) {
  const [citizenId, setCitizenId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Load remembered Citizen ID on mount
  useEffect(() => {
    const savedId = utils.getSavedCitizenId();
    if (savedId) {
      setCitizenId(savedId);
      setRememberMe(true);
    }
  }, []);


  const handleCitizenIdChange = (e) => {
    const formatted = utils.formatCitizenId(e.target.value);
    setCitizenId(formatted);
  };
  const handlePasswordChange = (e) => {
    const clean = utils.cleanPassword(e.target.value);
    setPassword(clean);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMsg = validate.validateLogin(citizenId, password)

    if (errorMsg) {
      setMessage(errorMsg);
      setIsError(true);
      return;
    }


    // Save or remove citizen ID from localStorage based on rememberMe checkbox
    if (rememberMe) {
      utils.saveCitizenId(citizenId);
    } else {
      utils.clearCitizenId();
    }

    const data = {
      citizenId: utils.cleanCitizenId(citizenId), // ส่งค่าแบบไม่มีขีดคั่น (เช่น 1103700001010) ไปให้เซิร์ฟเวอร์
      password: password
    };

    try {
      const response = await axios.post('http://localhost:8081/login', data);

      if (response.data === "User not found") {
        setMessage("เลขบัตรประชาชนผู้ใช้และรหัสผ่านไม่ถูกต้อง");
        setIsError(true);
      } else if (response.data === "Password not match") {
        setMessage("เลขบัตรประชาชนผู้ใช้และรหัสผ่านไม่ถูกต้อง");
        setIsError(true);
      } else {
        setMessage("เข้าสู่ระบบสำเร็จ");
        setIsError(false);
        const role = response.data;
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('citizenId', utils.cleanCitizenId(citizenId));
        sessionStorage.setItem('userRole', role);
        
        let targetPage = 'homemember';
        if (role === 'Officer') {
          targetPage = 'homememberofficer';
        } else if (role === 'Admin') {
          targetPage = 'homememberadmin';
        }
        
        setTimeout(() => {
          onNavigate(targetPage);
        }, 1000);
      }
    } catch (error) {
      setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
      setIsError(true);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* Logo Section */}
        <div className="login-header">
          <div className="logo-box">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.562 12.097l1.531 2.653c.967 1.674.393 3.815-1.28 4.781-.533.307-1.136.469-1.75.469H16v2.5L11 19l5-3.5V18h2.062c.263 0 .522-.07.75-.201.718-.414.963-1.332.55-2.049l-1.532-2.653 1.732-1zM7.304 9.134l.53 6.08-2.164-1.25-1.031 1.786c-.132.228-.201.487-.201.75 0 .828.671 1.5 1.5 1.5H9v2H5.938c-1.933 0-3.5-1.567-3.5-3.5 0-.614.162-1.218.469-1.75l1.03-1.787-2.164-1.249 5.53-2.58zm6.446-6.165c.532.307.974.749 1.281 1.281l1.03 1.785 2.166-1.25-.53 6.081-5.532-2.58 2.165-1.25-1.031-1.786c-.132-.228-.321-.417-.549-.549-.717-.414-1.635-.168-2.049.549L9.169 7.903l-1.732-1L8.97 4.25c.966-1.674 3.107-2.248 4.781-1.281z" />
            </svg>
          </div>
          <h1 className="logo-title">ระบบจัดการขยะเทศบาล</h1>
        </div>

        {/* Form Title */}
        <h2 className="login-action-title">เข้าสู่ระบบ</h2>
        <div className="login-action-underline"></div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Citizen ID Input Group */}
          <div className="form-group">
            <label className="form-label">เลขบัตรประชาชน</label>
            <div className="input-container">
              <svg className="input-icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <circle cx="9" cy="10" r="2" />
                <path d="M14 9h4" />
                <path d="M14 13h4" />
                <path d="M5 16s1-1 4-1 4 1 4 1" />
              </svg>
              <input
                type="text"
                value={citizenId}
                onChange={handleCitizenIdChange}
                className="form-input"
                placeholder="0-0000-00000-00-0"
                maxLength="17"
              />
            </div>
          </div>

          {/* Password Input Group */}
          <div className="form-group">
            <label className="form-label">รหัสผ่าน</label>
            <div className="input-container">
              <svg className="input-icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                className="form-input"
                placeholder="........"
                maxLength="50"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Options Row: Remember Me & Forgot Password */}
          <div className="form-options">
            <label className="remember-me" onClick={() => setRememberMe(!rememberMe)}>
              <div className={`checkbox-custom ${rememberMe ? 'checked' : ''}`}>
                {rememberMe && (
                  <svg className="checkbox-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span>จดจำเลขบัตรประชาชน</span>
            </label>
            <a href="#forgot-password" className="forgot-password-link">ลืมรหัสผ่าน?</a>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            เข้าสู่ระบบ
          </button>

          {/* Message Alert Banner */}
          {message && (
            <div className={`message-alert ${isError ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
        </form>

        {/* Divider */}
        <div className="divider-container">
          <div className="divider-line"></div>
          <span className="divider-text">OR</span>
          <div className="divider-line"></div>
        </div>

        {/* Register Account */}
        <div className="register-container">
          <a href="#register" onClick={(e) => { e.preventDefault(); onNavigate('register'); }} className="register-link">สมัครเข้าสู่ระบบใหม่</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
