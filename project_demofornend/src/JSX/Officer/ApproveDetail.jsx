import React, { useState, useEffect } from 'react'
import axios from 'axios'
import utils from '../../utils';
import '../../CSS/ApproveDetail.css';

function ApproveDetail({ onNavigate }) {
    const [officer, setOfficer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [service, setService] = useState(null);
    const [member, setMember] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchOfficer = async () => {
            const storedCitizenId = sessionStorage.getItem('citizenId');
            // จริงตรงนี้สามารถลบได้ไม่จำเปนตรวจซ้ำหลายลบเพราะมีการตรวจใน App
            if (!storedCitizenId) {
                // If not logged in, force return to login
                onNavigate('login');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8081/api/officers/citizenId/${storedCitizenId}`);
                const foundOfficer = response.data;

                //เหลือแค่ตัวนี้พอ
                if (foundOfficer) {
                    setOfficer(foundOfficer);
                } else {
                    onNavigate('login');
                }
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูลเจ้าหน้าที่:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOfficer();
    }, [onNavigate]);


    useEffect(() => {
        const storedServiceId = sessionStorage.getItem('selectedServiceId');
        console.log(storedServiceId);

        const fetchServiceDetail = async () => {
            const response = await axios.get(`http://localhost:8081/api/services/${storedServiceId}`);
            const foundService = response.data;
            setService(foundService);

            const foundMember = response.data.member
            setMember(foundMember);
        }

        fetchServiceDetail();
    }, []);

    const officerName = officer ? `${officer.prefix || ''}${officer.firstName} ${officer.lastName}` : "ไม่ระบุชื่อ";


    const villageText = service?.villageName
        ? (service.villageName.startsWith("หมู่บ้าน") ? service.villageName : `หมู่บ้าน${service.villageName}`)
        : "";



    const aprroveService = async () => {
        try {
            const data = {
                officer: { officerId: officer.officerId } // ส่งข้อมูลไอดีเจ้าหน้าที่ที่กดอนุมัติไปด้วย
            };
            const response = await axios.put(`http://localhost:8081/api/services/${service.serviceId}/approve`, data);
            if (response.data === "success") {
                setMessage("อนุมัติบริการสำเร็จ");

                // ดึงข้อมูลใหม่มาอัพเดทสเตทให้หน้าเว็บแสดงผลทันที
                const updated = await axios.get(`http://localhost:8081/api/services/${service.serviceId}`);
                setService(updated.data);
                setMember(updated.data.member);
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการอนุมัติบริการ:", error);
        }
    }

    const rejectService = async () => {
        try {
            const data = {
                officer: { officerId: officer.officerId } // ส่งข้อมูลไอดีเจ้าหน้าที่ที่กดอนุมัติไปด้วย
            };
            const response = await axios.put(`http://localhost:8081/api/services/${service.serviceId}/reject`, data);
            if (response.data === "success") {
                setMessage("ไม่ผ่านการอนุมัติบริการ");
                // ดึงข้อมูลใหม่มาอัพเดทสเตทให้หน้าเว็บแสดงผลทันที
                const updated = await axios.get(`http://localhost:8081/api/services/${service.serviceId}`);
                setService(updated.data);
                setMember(updated.data.member);
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการไม่อนุมัติบริการ:", error);
        }
    }

    if (loading || !service || !member) {
        return (
            <div className="homemember-loading">
                <div className="spinner"></div>
                <p>กำลังโหลดข้อมูล...</p>
            </div>
        );
    }


    return (
        <div className="homemember-wrapper">
            {/* Navigation Bar */}
            <nav className="homemember-navbar">
                <div className="navbar-brand">
                    <div className="navbar-logo-box">
                        <svg className="navbar-logo-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.562 12.097l1.531 2.653c.967 1.674.393 3.815-1.28 4.781-.533.307-1.136.469-1.75.469H16v2.5L11 19l5-3.5V18h2.062c.263 0 .522-.07.75-.201.718-.414.963-1.332.55-2.049l-1.532-2.653 1.732-1zM7.304 9.134l.53 6.08-2.164-1.25-1.031 1.786c-.132.228-.201.487-.201.75 0 .828.671 1.5 1.5 1.5H9v2H5.938c-1.933 0-3.5-1.567-3.5-3.5 0-.614.162-1.218.469-1.75l1.03-1.787-2.164-1.249 5.53-2.58zm6.446-6.165c.532.307.974.749 1.281 1.281l1.03 1.785 2.166-1.25-.53 6.081-5.532-2.58 2.165-1.25-1.031-1.786c-.132-.228-.321-.417-.549-.549-.717-.414-1.635-.168-2.049.549L9.169 7.903l-1.732-1L8.97 4.25c.966-1.674 3.107-2.248 4.781-1.281z" />
                        </svg>
                    </div>
                    <div className="navbar-title-container">
                        <h1 className="navbar-title">ระบบจัดการขยะเทศบาล</h1>
                        <p className="navbar-subtitle">เทศบาลตำบลทุ่งหัวช้าง</p>
                    </div>
                </div>

                <div className="navbar-actions">
                    <button className="back-home-button" onClick={() => onNavigate('homeOfficer')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        หน้าหลัก
                    </button>
                    <div className="user-badge" style={{ cursor: 'default' }}>
                        <div className="user-avatar-dot"></div>
                        <span>{officerName} ({officer?.position || 'เจ้าหน้าที่'})</span>
                    </div>
                </div>
            </nav>

            <main className="approve-detail-container">
                <div className="detail-header-nav">
                    <button className="back-list-btn" onClick={() => onNavigate('listApprove')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        กลับสู่ตารางคำขอ
                    </button>
                </div>

                <div className="detail-card">
                    {/* 1. ข้อมูลส่วนตัว */}
                    <div className="detail-section">
                        <h4 className="detail-section-header">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="section-icon">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            1. ข้อมูลส่วนตัว
                        </h4>

                        <div className="detail-fields-grid">
                            <div className="detail-field-item">
                                <span className="field-label">ชื่อผู้สมัคร (APPLICANT NAME)</span>
                                <span className="field-value">{member.prefix}{member.firstName} {member.lastName}</span>
                            </div>

                            <div className="detail-field-item">
                                <span className="field-label">เลขบัตรประจำตัวประชาชน (ID CARD)</span>
                                <span className="field-value">{utils.maskCitizenId(member.citizenId)}</span>
                            </div>

                            <div className="detail-field-item">
                                <span className="field-label">วันเกิด (BIRTH DATE)</span>
                                <span className="field-value">{utils.formatThaiDate(utils.convertCEtoBE(member.birth))}</span>
                            </div>

                            <div className="detail-field-item">
                                <span className="field-label">เบอร์ติดต่อ (PHONE)</span>
                                <span className="field-value">{utils.formatPhone(member.phone)}</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. ที่อยู่ตามทะเบียนบ้าน */}
                    <div className="detail-section">
                        <h4 className="detail-section-header">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="section-icon">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                            2. ที่อยู่ตามทะเบียนบ้าน
                        </h4>

                        <div className="address-card-box">
                            {member.registeredHouseNumber} หมู่ที่ {member.registeredVillageNo} ตำบล{member.registeredSubdistrict} อำเภอ{member.registeredDistrict} จังหวัด{member.registeredProvince} รหัสไปรษณีย์ {member.registeredPostalCode}
                        </div>
                    </div>

                    {/* 3. รายละเอียดข้อมูลการรับบริการ */}
                    <div className="detail-section">
                        <h4 className="detail-section-header">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="section-icon">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            3. รายละเอียดข้อมูลการรับบริการ
                        </h4>

                        <div className="service-location-box">
                            <span className="location-title">สถานที่รับบริการ (SERVICE LOCATION)</span>
                            <span className="location-value">บ้านเลขที่ {service.houseNumber} หมู่ที่ {service.villageNo} {villageText}</span>
                            {service.detail && (
                                <>
                                    <div className="location-divider"></div>
                                    <span className="location-detail">{service.detail}</span>
                                </>
                            )}
                        </div>

                        <div className="detail-fields-grid">
                            <div className="detail-field-item">
                                <span className="field-label">ประเภทอาคาร (BUILDING)</span>
                                <span className="field-value">{service.buildingType || '-'}</span>
                            </div>

                            <div className="detail-field-item">
                                <span className="field-label">ประเภทบริการ (SERVICE)</span>
                                <span className="field-value">{service.serviceType || 'บริการรายเดือน'}</span>
                            </div>

                            <div className="detail-field-item">
                                <span className="field-label">ปริมาณขยะ (WEIGHT)</span>
                                <span className="field-value">ไม่เกิน {service.garbageWeight} กก./สัปดาห์</span>
                            </div>
                        </div>
                    </div>

                    {/* ปุ่มการอนุมัติ/ไม่อนุมัติ */}
                    <div className="action-buttons-container">
                        {(service.status === "รอดำเนินการ" || service.status === "รอตรวจสอบ") ? (
                            <>
                                <button className="btn-officer-approve" onClick={aprroveService}>
                                    อนุมัติ
                                </button>
                                <button className="btn-officer-reject" onClick={rejectService}>
                                    ไม่ผ่านการอนุมัติ
                                </button>
                            </>
                        ) : (
                            <div className="status-info-box">
                                คำขอนี้ได้รับการดำเนินการแล้ว สถานะปัจจุบัน: <span style={{ color: service.status === 'อนุมัติ' ? '#16a34a' : '#ef4444' }}>{service.status}</span>
                            </div>
                        )}
                    </div>

                    {message && (
                        <div className="status-message-alert">
                            {message}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default ApproveDetail