import React from 'react';

function AddressCard({
    member,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    formData,
    onChange
}) {
    return (
        <div className="profile-section-card">
            <div className="card-header">
                <div className="card-title-box">
                    <div className="card-icon-container">
                        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    </div>
                    <h3 className="card-title">2. ที่อยู่ตามทะเบียนประชาชน</h3>
                </div>
                <div className="card-actions-box">
                    {isEditing ? (
                        <>
                            <button onClick={onSave} className="btn-save-profile">บันทึก</button>
                            <button onClick={onCancel} className="btn-cancel-profile">ยกเลิก</button>
                        </>
                    ) : (
                        <button onClick={onEdit} className="btn-edit-profile">
                            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path></svg>
                            แก้ไขข้อมูล
                        </button>
                    )}
                </div>
            </div>

            <div className="fields-grid-3">
                {/* บ้านเลขที่ */}
                <div className="field-item">
                    <span className="field-label">บ้านเลขที่ตามทะเบียนประชาชน</span>
                    {isEditing ? (
                        <input
                            type="text"
                            name="registeredHouseNumber"
                            value={formData.registeredHouseNumber || ''}
                            onChange={onChange}
                            className="field-input"
                        />
                    ) : (
                        <p className="field-value">{member?.registeredHouseNumber}</p>
                    )}
                </div>

                {/* หมู่ */}
                <div className="field-item">
                    <span className="field-label">หมู่ตามทะเบียนประชาชน</span>
                    {isEditing ? (
                        <input
                            type="text"
                            name="registeredVillageNo"
                            value={formData.registeredVillageNo || ''}
                            onChange={onChange}
                            className="field-input"
                        />
                    ) : (
                        <p className="field-value">{member?.registeredVillageNo}</p>
                    )}
                </div>

                {/* ตำบล / แขวง */}
                <div className="field-item">
                    <span className="field-label">ตำบล / แขวง</span>
                    {isEditing ? (
                        <select
                            name="registeredSubdistrict"
                            value={formData.registeredSubdistrict || ''}
                            onChange={onChange}
                            className="field-select"
                        >
                            <option value="ทุ่งหัวช้าง">ทุ่งหัวช้าง</option>
                            <option value="หัวขัว">หัวขัว</option>
                            <option value="แม่ปันเดง">แม่ปันเดง</option>
                        </select>
                    ) : (
                        <p className="field-value">{member?.registeredSubdistrict}</p>
                    )}
                </div>

                {/* อำเภอ / เขต */}
                <div className="field-item">
                    <span className="field-label">อำเภอ / เขต</span>
                    <p className="field-value">{member?.registeredDistrict}</p>
                </div>

                {/* จังหวัด */}
                <div className="field-item">
                    <span className="field-label">จังหวัด</span>
                    <p className="field-value">{member?.registeredProvince}</p>
                </div>

                {/* รหัสไปรษณีย์ */}
                <div className="field-item">
                    <span className="field-label">รหัสไปรษณีย์</span>
                    <p className="field-value">{member?.registeredPostalCode}</p>
                </div>
            </div>
        </div>
    );
}

export default AddressCard;
