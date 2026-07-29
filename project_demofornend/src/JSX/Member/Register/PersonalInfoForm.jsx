import React from 'react';

function PersonalInfoForm({
  citizenId,
  onCitizenIdChange,
  prefix,
  onPrefixChange,
  firstName,
  onFirstNameChange,
  lastName,
  onLastNameChange,
  birth,
  onBirthChange,
  phone,
  onPhoneChange,
  password,
  onPasswordChange,
  showPassword,
  onToggleShowPassword
}) {
  return (
    <>
      {/* Section 1: ข้อมูลส่วนตัว */}
      <div className="section-title-container">
        <h3 className="section-title">
          <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          1. ข้อมูลส่วนตัว
        </h3>
      </div>

      {/* Citizen ID */}
      <div className="form-row grid-full-width">
        <div className="form-group">
          <label className="form-label">
            เลขประจำตัวประชาชน <span className="required-star">*</span>
          </label>
          <div className="input-container">
            <input
              type="text"
              value={citizenId}
              onChange={onCitizenIdChange}
              className="form-input"
              placeholder="ระบุเลข 13 หลัก"
              maxLength="17"
            />
          </div>
        </div>
      </div>

      {/* Prefix, First Name, Last Name */}
      <div className="form-row grid-prefix-name">
        <div className="form-group">
          <label className="form-label">
            คำนำหน้า <span className="required-star">*</span>
          </label>
          <select
            value={prefix}
            onChange={(e) => onPrefixChange(e.target.value)}
            className="form-select"
          >
            <option value="นาย">นาย</option>
            <option value="นาง">นาง</option>
            <option value="นางสาว">นางสาว</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            ชื่อ <span className="required-star">*</span>
          </label>
          <input
            type="text"
            value={firstName}
            onChange={onFirstNameChange}
            placeholder="ระบุชื่อ"
            className="form-input"
            maxLength="50"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            นามสกุล <span className="required-star">*</span>
          </label>
          <input
            type="text"
            value={lastName}
            onChange={onLastNameChange}
            placeholder="ระบุนามสกุล"
            className="form-input"
            maxLength="50"
          />
        </div>
      </div>

      {/* Birth Date, Phone Number */}
      <div className="form-row grid-two-col">
        <div className="form-group">
          <label className="form-label">
            วันเดือนปีเกิด <span className="required-star">*</span>
          </label>
          <input
            type="text"
            value={birth}
            onChange={onBirthChange}
            placeholder="mm/dd/yyyy"
            className="form-input"
            maxLength="10"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            เบอร์โทรศัพท์ <span className="required-star">*</span>
          </label>
          <input
            type="text"
            value={phone}
            onChange={onPhoneChange}
            className="form-input"
            maxLength="12"
            placeholder="08x-xxx-xxxx"
          />
        </div>
      </div>

      {/* Password Input Group */}
      <div className="form-row grid-full-width">
        <div className="form-group">
          <label className="form-label">
            รหัสผ่าน <span className="required-star">*</span>
          </label>
          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={onPasswordChange}
              className="form-input form-input-with-icon"
              placeholder="........"
              maxLength="50"
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={onToggleShowPassword}
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
      </div>
    </>
  );
}

export default PersonalInfoForm;
