import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../CSS/HomeAdmin.css';

function HomeAdmin({ onNavigate }) {
    const [admin, setadmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCount, setActiveCount] = useState(0);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchAdmin = async () => {
            const storedCitizenId = sessionStorage.getItem('citizenId');
            if (!storedCitizenId) {
                onNavigate('login');
                return;
            }
            try {
                // 1. Fetch current logged in admin
                const response = await axios.get(`/api/admins/citizenId/${storedCitizenId}`);
                if (response.data) {
                    setadmin(response.data);
                } else {
                    onNavigate('login');
                    return;
                }
            } catch (error) {
                setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
            } finally {
                setLoading(false);
            }
        };

        const fetchOfficer = async () => {
            try {
                const officersRes = await axios.get('/api/officers');
                const activeOfficers = officersRes.data.filter(
                    o => o.status === 'ทำงาน');
                setActiveCount(activeOfficers.length);
            } catch (error) {
                setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
            }

        }


        fetchAdmin();
        fetchOfficer();
    }, [onNavigate]);

    const adminName = admin?.firstName && admin?.lastName
        ? `${admin.prefix} ${admin.firstName} ${admin.lastName}`
        : 'ชื่อผู้ใช้';

    const handleLogout = () => {
        onNavigate('login');
    };

    if (loading) {
        return (
            <div className="homemember-loading">
                <div className="spinner"></div>
                <p>กำลังโหลดข้อมูล...</p>
            </div>
        );
    }


    return (
        <div className="admin-dashboard-wrapper">
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
                    <div className="user-badge user-badge-default">
                        <div className="user-avatar-dot"></div>
                        <span>{adminName} ({admin?.position || 'ผู้ดูแลระบบ'})</span>
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

            <div className="admin-container">
                <h2 className="dashboard-main-title">แดชบอร์ดผู้ดูแลระบบ</h2>

                {/* Stats card "เจ้าหน้าที่หลัก" */}
                <div className="dashboard-stat-card-mockup">
                    <span className="stat-card-label-mockup">เจ้าหน้าที่หลัก</span>
                    <span className="stat-card-number-mockup">{activeCount}</span>
                </div>

                <h3 className="dashboard-section-title">การจัดการระบบ</h3>

                {/* Clickable button card "จัดการเจ้าหน้าที่" */}
                <div className="dashboard-grid">
                    <div className="dashboard-btn-card-mockup" onClick={() => onNavigate('listOfficerAccount')}>
                        <div className="btn-card-icon-circle">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <span className="btn-card-text">จัดการเจ้าหน้าที่</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeAdmin;