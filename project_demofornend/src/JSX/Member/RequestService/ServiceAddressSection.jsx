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
                        <input
                            type="text"
                            className="request-service-input"
                            placeholder="เช่น 5"
                            value={villageNo}
                            onChange={onVillageNoChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="request-service-label">ชื่อหมู่บ้าน/โครงการ</label>
                        <input
                            type="text"
                            className="request-service-input"
                            placeholder="เช่น หมู่บ้านสุขใจ"
                            value={villageName}
                            onChange={onVillageNameChange}
                        />
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
