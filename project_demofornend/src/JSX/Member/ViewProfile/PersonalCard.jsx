import React from 'react';
import utils from '../../../utils';

function PersonalCard({
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
                        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <h3 className="card-title">
                        1. ข้อมูลส่วนตัว
                        <span className="badge-verified">VERIFIED</span>
                    </h3>
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


                {/* คำนำหน้า */}
                <div className="field-item">
                    <span className="field-label">
                        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        คำนำหน้า
                    </span>
                    {isEditing ? (
                        <select
                            name="prefix"
                            value={formData.prefix || ''}
                            onChange={onChange}
                            className="field-select"
                        >
                            <option value="นาย">นาย</option>
                            <option value="นาง">นาง</option>
                            <option value="นางสาว">นางสาว</option>
                        </select>
                    ) : (
                        <p className="field-value">{member?.prefix}</p>
                    )}
                </div>

                {/* ชื่อ */}
                <div className="field-item">
                    <span className="field-label">
                        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        ชื่อ
                    </span>
                    {isEditing ? (
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName || ''}
                            onChange={onChange}
                            className="field-input"
                        />
                    ) : (
                        <p className="field-value">{member?.firstName}</p>
                    )}
                </div>

                {/* นามสกุล */}
                <div className="field-item">
                    <span className="field-label">
                        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        นามสกุล
                    </span>
                    {isEditing ? (
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName || ''}
                            onChange={onChange}
                            className="field-input"
                        />
                    ) : (
                        <p className="field-value">{member?.lastName}</p>
                    )}
                </div>


                {/* เลขบัตรประชาชน */}
                <div className="field-item">
                    <span className="field-label">
                        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="4"></line><line x1="8" y1="2" x2="8" y2="4"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        เลขประจำตัวประชาชน
                    </span>
                    <p className="field-value">{utils.maskCitizenId(member?.citizenId)}</p>
                </div>

                {/* วันเกิด */}
                <div className="field-item">
                    <span className="field-label">
                        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        วันเกิด
                    </span>
                    {isEditing ? (
                        <input
                            type="text"
                            name="birth"
                            value={formData.birth || ''}
                            onChange={onChange}
                            className="field-input"
                        />
                    ) : (
                        <p className="field-value">{utils.formatThaiDate(utils.convertCEtoBE(member?.birth))}</p>
                    )}
                </div>

                {/* เบอร์โทรศัพท์ */}
                <div className="field-item">
                    <span className="field-label">
                        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        เบอร์โทรศัพท์
                    </span>
                    {isEditing ? (
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={onChange}
                            className="field-input"
                        />
                    ) : (
                        <p className="field-value">{utils.formatPhone(member?.phone)}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PersonalCard;
