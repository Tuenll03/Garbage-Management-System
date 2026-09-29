import React from 'react';

function ServiceAddressSection({
    houseNumber,
    onHouseNumberChange,
    villageNo,
    onVillageNoChange,
    villageName,
    onVillageNameChange,
    detail,
    onDetailChange
}) {
    return (
        <div>
            <div className="section-header">
                <div className="section-number">2</div>
                <h3 className="section-title-text">ที่อยู่สำหรับรับบริการ</h3>
            </div>
            <div className="address-section">
                <div className="address-row-3">
                    <div className="form-group">
                        <label className="request-service-label">เลขที่บ้าน</label>
                        <input
                            type="text"
                            className="request-service-input"
                            placeholder="เช่น 123/45"
                            value={houseNumber}
                            onChange={onHouseNumberChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="request-service-label">หมู่ที่</label>
                        <select className="request-service-select" value={villageNo} onChange={onVillageNoChange}>
                            <option value="">-- เลือกหมู่ที่ --</option>
                            <option value="1">หมู่ 1</option>
                            <option value="2">หมู่ 2</option>
                            <option value="3">หมู่ 3</option>
                            <option value="8">หมู่ 8</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="request-service-label">ชื่อหมู่บ้าน</label>
                        <select className="request-service-select" value={villageName} onChange={onVillageNameChange}>
                            <option value="">-- เลือกชื่อหมู่บ้าน --</option>
                            <option value="บ้านทุ่งเป็ด">บ้านทุ่งเป็ด</option>
                            <option value="บ้านหนองป่าตึง">บ้านหนองป่าตึง</option>
                            <option value="บ้านทุ่งหัวช้าง">บ้านทุ่งหัวช้าง</option>
                            <option value="บ้านใหม่จริญญา">บ้านใหม่จริญญา</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label className="request-service-label">รายละเอียดเพิ่มเติม / จุดสังเกต</label>
                    <textarea
                        className="request-service-textarea"
                        placeholder="เช่น บ้านสีขาว ประตูรั้วสีเขียว หรือข้างร้านสะดวกซื้อ"
                        value={detail}
                        onChange={onDetailChange}
                    ></textarea>
                </div>
            </div>
        </div>
    );
}

export default ServiceAddressSection;
