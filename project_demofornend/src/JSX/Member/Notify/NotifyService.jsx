import React, { useState, useEffect } from 'react';
import axios from 'axios';
import utils from '../../../utils';
import '../../../CSS/NotifyMember.css';

function NotifyService({ memberId }) {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!memberId) return;
        const fetchServiceData = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/services/member/${memberId}`);
                const sortedServices = response.data.sort((a, b) => b.serviceId - a.serviceId);
                setServices(sortedServices);

                // บันทึกจำนวนรายการที่อนุมัติทั้งหมดลงเครื่อง เพื่อล้างค่าจุดแดงบนหน้าแรก
                const approvedCount = sortedServices.filter(s => s.status === 'อนุมัติ').length;
                localStorage.setItem('seenApprovedCount', approvedCount.toString());
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูลบริการ:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServiceData();
    }, [memberId]);

    if (loading) {
        return (
            <div className="homemember-loading" style={{ minHeight: '100px', background: 'transparent', boxShadow: 'none', border: 'none' }}>
                <div className="spinner"></div>
                <p>กำลังโหลดข้อมูลบริการ...</p>
            </div>
        );
    }

    return (
        <>
            {services.length === 0 ? (
                <div className="notify-empty">
                    <svg className="notify-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <h3 className="notify-empty-title">ไม่พบข้อมูลสถานะการสมัคร</h3>
                    <p className="notify-empty-desc">คุณยังไม่ได้ทำการยื่นขอรับบริการจัดการขยะใดๆ ในระบบขณะนี้</p>
                </div>
            ) : (
                <div className="notify-cards-list">
                    {services.map((item) => {
                        const isApproved = item.status === 'อนุมัติ';
                        return (
                            <div key={item.serviceId} className={`notify-status-card ${isApproved ? 'approved' : 'pending'}`}>
                                <div className="status-section">
                                    <span className="status-label-top">สถานะการพิจารณา</span>

                                    <div className="status-badge-container">
                                        {isApproved ? (
                                            <>
                                                <span className="status-badge-icon approved">
                                                    <svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30">
                                                        <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-13 5l-4-4 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                    </svg>
                                                </span>
                                                <h3 className="status-title-text approved">อนุมัติเรียบร้อย</h3>
                                            </>
                                        ) : (
                                            <>
                                                <span className="status-badge-icon pending">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="26" height="26">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <polyline points="12 6 12 12 16 14" />
                                                    </svg>
                                                </span>
                                                <h3 className="status-title-text pending">อยู่ระหว่างการพิจารณา</h3>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <hr className="notify-info-divider" />

                                <div className="notify-card-details-grid">
                                    <div className="info-grid-item">
                                        <span className="info-grid-label">ประเภทอาคาร / สถานที่</span>
                                        <span className="info-grid-value">{item.buildingType}</span>
                                    </div>
                                    <div className="info-grid-item">
                                        <span className="info-grid-label">รูปแบบการชำระเงิน</span>
                                        <span className="info-grid-value">{item.serviceType}</span>
                                    </div>
                                    <div className="info-grid-item">
                                        <span className="info-grid-label">ปริมาณขยะโดยประมาณ</span>
                                        <span className="info-grid-value">{item.garbageWeight} กิโลกรัม/สัปดาห์</span>
                                    </div>
                                    <div className="info-grid-item">
                                        <span className="info-grid-label">ค่าธรรมเนียมบริการ</span>
                                        <span className="info-grid-value">
                                            {item.serviceType === 'ชำระรายเดือน' ? `${item.price} บาท/เดือน` : `${item.price * 12} บาท/ปี`}
                                        </span>
                                    </div>
                                    <div className="info-grid-item" style={{ gridColumn: 'span 2' }}>
                                        <span className="info-grid-label">ที่อยู่รับบริการ</span>
                                        <span className="info-grid-value">
                                            บ้านเลขที่ {item.houseNumber} หมู่ {item.villageNo} {item.villageName ? `หมู่บ้าน${item.villageName}` : ''}
                                            {item.detail ? ` (${item.detail})` : ''}
                                        </span>
                                    </div>
                                </div>

                                <div className="notify-card-footer">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="notify-footer-icon" style={{ width: '16px', height: '16px' }}>
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    <span>ยื่นคำร้องเมื่อ: {utils.formatThaiDate(utils.convertCEtoBE(item.requestDate))}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}

export default NotifyService;
