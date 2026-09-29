import React from 'react';

function AddressForm({
  registeredHouseNumber,
  onRegisteredHouseNumberChange,
  registeredVillageNo,
  onRegisteredVillageNoChange,
  registeredPostalCode,
  onRegisteredPostalCodeChange,
  registeredSubdistrict,
  onRegisteredSubdistrictChange,
  registeredDistrict,
  registeredProvince
}) {
  return (
    <>
      {/* Section 2: ที่อยู่ตามทะเบียนบ้าน */}
      <div className="section-title-container">
        <h3 className="section-title">
          <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          2. ที่อยู่ตามทะเบียนบ้าน
        </h3>
      </div>

      {/* House Number, Village No, Postal Code */}
      <div className="form-row grid-address-first">
        <div className="form-group">
          <label className="form-label">
            บ้านเลขที่ <span className="required-star">*</span>
          </label>
          <input
            type="text"
            value={registeredHouseNumber}
            onChange={onRegisteredHouseNumberChange}
            placeholder="เช่น 99/1"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            หมู่ <span className="required-star">*</span>
          </label>
          <input
            type="text"
            value={registeredVillageNo}
            onChange={onRegisteredVillageNoChange}
            placeholder="เช่น 1"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            รหัสไปรษณีย์ <span className="required-star">*</span>
          </label>
          <div className="input-container">
            <input
              type="text"
              value={registeredPostalCode}
              onChange={(e) => onRegisteredPostalCodeChange(e.target.value)}
              className="form-input form-input-with-icon"
              placeholder="51150"
              maxLength="5"
            />
            <svg className="input-icon-right-svg" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <span className="helper-text-green">ระบบจะดึงข้อมูลอัตโนมัติ</span>
        </div>
      </div>

      {/* Subdistrict, District, Province */}
      <div className="form-row grid-three-col">
        <div className="form-group">
          <label className="form-label">
            ตำบล <span className="required-star">*</span>
          </label>
          <div className="input-container">
            <select
              value={registeredSubdistrict}
              onChange={(e) => onRegisteredSubdistrictChange(e.target.value)}
              className="form-select form-select-with-sparkle"
            >
              <option value="ทุ่งหัวช้าง">ทุ่งหัวช้าง</option>
            </select>
            <span className="select-sparkle-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707" />
              </svg>
            </span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            อำเภอ <span className="required-star">*</span>
          </label>
          <div className="input-container">
            <input
              type="text"
              value={registeredDistrict}
              className="form-input locked"
              readOnly
            />
            <svg className="input-icon-lock-svg" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 02 2zm10-10V7a4 4 0 0 0-8 0v4h8z"></path>
            </svg>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            จังหวัด <span className="required-star">*</span>
          </label>
          <div className="input-container">
            <input
              type="text"
              value={registeredProvince}
              className="form-input locked"
              readOnly
            />
            <svg className="input-icon-lock-svg" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 02 2zm10-10V7a4 4 0 0 0-8 0v4h8z"></path>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddressForm;
