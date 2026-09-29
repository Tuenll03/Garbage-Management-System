import React from 'react';

function AddressCard({
    member,
    isEditing,
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
                    <p className="field-value">{member?.registeredSubdistrict}</p>
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
