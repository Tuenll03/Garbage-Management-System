import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../CSS/HomeMember.css';
import '../../CSS/HomeOfficer.css';


function HomeOfficer({ onNavigate }) {
    const [officer, setOfficer] = useState(null);
    const [loading, setLoading] = useState(true);

    // Stats state
    const [pendingRequests, setPendingRequests] = useState(0);
    const [pendingPayments, setPendingPayments] = useState(0);
    const [activeAnnouncements, setActiveAnnouncements] = useState(0);

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

    // Fetch dashboard counts when officer profile is loaded
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                // 1. ดึงจำนวนคำขอใหม่ที่ "รอดำเนินการ"
                const servicesRes = await axios.get('http://localhost:8081/api/services');
                const pendingSrv = servicesRes.data.filter(s => s.status === 'รอดำเนินการ');
                setPendingRequests(pendingSrv.length);

                // 2. ดึงจำนวนบิลที่ "ค้างชำระ"
                const invoicesRes = await axios.get('http://localhost:8081/api/invoices');
                const pendingInv = invoicesRes.data.filter(inv => inv.status === 'ค้างชำระ');
                setPendingPayments(pendingInv.length);

                // 3. ดึงจำนวนประกาศข่าวสารทั้งหมด
                const announcementsRes = await axios.get('http://localhost:8081/api/announcements');
                setActiveAnnouncements(announcementsRes.data.length);
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสถิติแดชบอร์ด:", error);
            }
        };


        fetchCounts();
    }, [officer]);

    const handleLogout = () => {
        onNavigate('login');
    };

    if (loading) {
        return (
            <div className="homemember-loading">
                <div className="spinner"></div>
                <p>กำลังโหลดข้อมูลสมาชิก...</p>
            </div>
        );
    }

    const officerName = officer ? `${officer.prefix || ''}${officer.firstName} ${officer.lastName}` : "ไม่ระบุชื่อ";

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
                    <div className="user-badge" style={{ cursor: 'default' }}>
                        <div className="user-avatar-dot"></div>
                        <span>{officerName} ({officer?.position || 'เจ้าหน้าที่'})</span>
                    </div>

                    <button className="logout-btn" onClick={handleLogout}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        ออกจากระบบ
                    </button>
                </div>
            </nav>

            {/* Main Content Dashboard Container */}
            <main className="homemember-container">
                <h2 className="officer-main-title">หน้าหลักเจ้าหน้าที่</h2>

                {/* Stats Grid */}
                <section className="officer-stats-grid">
                    <div className="officer-stat-card">
                        <span className="officer-stat-label">คำขอใหม่ (รอตรวจสอบ)</span>
                        <span className="officer-stat-number pending-requests">{pendingRequests}</span>
                    </div>

                    <div className="officer-stat-card">
                        <span className="officer-stat-label">รอการชำระเงิน</span>
                        <span className="officer-stat-number pending-payments">{pendingPayments}</span>
                    </div>

                    <div className="officer-stat-card">
                        <span className="officer-stat-label">ประกาศที่ใช้งานอยู่</span>
                        <span className="officer-stat-number active-announcements">{activeAnnouncements}</span>
                    </div>
                </section>

                {/* Quick Menu Section */}
                <section className="quick-menu-section">
                    <h3 className="quick-menu-title">
                        <span className="title-icon-bar"></span>
                        เมนูลัด
                    </h3>
                    <div className="quick-menu-grid">
                        <div className="menu-card" onClick={() => onNavigate('listApprove')}>
                            <div className="menu-icon-container requests">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <circle cx="8" cy="9" r="1" />
                                </svg>
                            </div>
                            <span className="menu-label">จัดการคำขอ</span>
                        </div>

                        <div className="menu-card" onClick={() => onNavigate('verifyPayments')}>
                            <div className="menu-icon-container payments">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                                    <line x1="12" y1="20" x2="12" y2="4" />
                                    <path d="M12 10h4a2 2 0 0 0 0-4h-4" />
                                    <path d="M12 18h4a2 2 0 0 0 0-4h-4" />
                                </svg>
                            </div>
                            <span className="menu-label">ตรวจสอบการชำระเงิน</span>
                        </div>

                        <div className="menu-card" onClick={() => onNavigate('manageAnnouncements')}>
                            <div className="menu-icon-container announcements">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                </svg>
                            </div>
                            <span className="menu-label">จัดการประกาศ</span>
                        </div>

                        <div className="menu-card" onClick={() => onNavigate('manageHouseholds')}>
                            <div className="menu-icon-container households">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                            </div>
                            <span className="menu-label">จัดการครัวเรือน</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default HomeOfficer;