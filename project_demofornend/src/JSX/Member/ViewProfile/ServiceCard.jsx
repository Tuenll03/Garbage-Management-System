import React from 'react';
import utils from '../../../utils';

function ServiceCard({
    services,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    onChangeDetail
}) {
    if (services.length === 0) {
        return (
            <div className="profile-section-card">
                <div className="card-header">
                    <div className="card-title-box">
                        <div className="card-icon-container">
                            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 11 11 13 15 9"></polyline></svg>
                        </div>
                        <h3 className="card-title">3. รายละเอียดข้อมูลการรับบริการและที่ตั้ง</h3>
                    </div>
                </div>
                <div className="text-center" style={{ color: '#94a3b8', padding: '20px 0' }}>
                    ไม่พบข้อมูลคำขอรับบริการขยะ
                </div>
            </div>
        );
    }

    return (
        <>
            {services.map((service, index) => {
                return (
                    <div key={service.serviceId} className="profile-section-card">
                        <div className="card-header">
                            <div className="card-title-box">
                                <div className="card-icon-container">
                                    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 11 11 13 15 9"></polyline></svg>
                                </div>
                                <h3 className="card-title">
                                    {`3.${index + 1} รายละเอียดข้อมูลการรับบริการและที่ตั้ง (${service.buildingType} - หลังที่ ${index + 1})`}
                                </h3>
                            </div>
                            <div className="card-actions-box">
                                <button onClick={() => alert("ระบบยังไม่พร้อมใช้งานการยกเลิกบริการ")} className="btn-cancel-service">
                                    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    ยกเลิกบริการ
                                </button>
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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                            {/* ที่ตั้งบ้านที่รับบริการ */}
                            <div className="service-sub-title">
                                <div className="accent-line-title">
                                    <div className="accent-line"></div>
                                    ที่ตั้งบ้านที่รับบริการ
                                </div>
                            </div>

                            <div className="fields-grid-3">
                                <div className="field-item">
                                    <span className="field-label">เลขที่บ้าน</span>
                                    <p className="field-value">{service.houseNumber}</p>
                                </div>
                                <div className="field-item">
                                    <span className="field-label">หมู่</span>
                                    <p className="field-value">{service.villageNo}</p>
                                </div>
                                <div className="field-item">
                                    <span className="field-label">บ้าน</span>
                                    <p className="field-value">{service.villageName || '-'}</p>
                                </div>
                            </div>

                            {/* จุดสังเกต (รายละเอียดเพิ่มเติม) Alert Box */}
                            <div className="detail-alert-box">
                                <div className="detail-icon-box">
                                    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </div>
                                <div className="detail-content-box">
                                    <span className="detail-content-label">รายละเอียดเพิ่มเติม / จุดสังเกต</span>
                                    {isEditing ? (
                                        <textarea
                                            name="detail"
                                            className="service-detail-textarea"
                                            value={service.detail || ''}
                                            onChange={(e) => onChangeDetail(index, e.target.value)}
                                        />
                                    ) : (
                                        <span className="detail-content-value">{service.detail || 'ไม่ได้ระบุ'}</span>
                                    )}
                                </div>
                            </div>

                            {/* ข้อมูลการรับบริการ */}
                            <div className="service-sub-title" style={{ marginTop: '10px' }}>
                                <div className="accent-line-title">
                                    <div className="accent-line"></div>
                                    ข้อมูลการรับบริการ
                                </div>
                            </div>

                            <div className="fields-grid-4">
                                <div className="field-item">
                                    <span className="field-label">
                                        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="16"></line><line x1="15" y1="22" x2="15" y2="16"></line><line x1="9" y1="16" x2="15" y2="16"></line><path d="M8 6h2v2H8V6zm4 0h2v2h-2V6zm4 0h2v2h-2V6zM8 10h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"></path></svg>
                                        ประเภทการจัดเก็บ
                                    </span>
                                    <p className="field-value">{service.buildingType}</p>
                                    <span className="meta-subtitle">BUILDING TYPE</span>
                                </div>
                                <div className="field-item">
                                    <span className="field-label">
                                        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        การเก็บค่าธรรมเนียม
                                    </span>
                                    <p className="field-value">{service.serviceType}</p>
                                    <span className="meta-subtitle">SERVICE TYPE</span>
                                </div>
                                <div className="field-item">
                                    <span className="field-label">
                                        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                        ปริมาณขยะ
                                    </span>
                                    <p className="field-value">ไม่เกิน {service.garbageWeight} กก./สัปดาห์</p>
                                    <span className="meta-subtitle">GARBAGE WEIGHT</span>
                                </div>
                                <div className="field-item">
                                    <span className="field-label">
                                        <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        วันที่เริ่ม
                                    </span>
                                    <p className="field-value">{utils.formatThaiDate(utils.convertCEtoBE(service.startDate))}</p>
                                    <span className="meta-subtitle">START DATE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}

export default ServiceCard;
