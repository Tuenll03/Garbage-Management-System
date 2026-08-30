import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../CSS/HomeMember.css';
import '../../CSS/ListApprove.css';
import utils from '../../utils';


function ListApprove({ onNavigate }) {
    const [officer, setOfficer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [service, setService] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("ทั้งหมด");

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
        const fetchService = async () => {
            const response = await axios.get('http://localhost:8081/api/services')
            const dataRequest = response.data
            setService(dataRequest)
        }
        fetchService()
    }, [])

    const changeStatus = (e) => {
        setSelectedStatus(e.target.value);
    };

    const filteredServices = service.filter((s) => {
        if (selectedStatus === "ทั้งหมด" || selectedStatus === "") return true;
        return s.status === selectedStatus;
    });


    const renderStatusBadge = (status) => {
        if (status === "รอดำเนินการ" || status === "รอตรวจสอบ") {
            return (
                <span className="status-badge-officer pending">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                    รอตรวจสอบ
                </span>
            );
        } else if (status === "อนุมัติ" || status === "อนุมัติแล้ว") {
            return (
                <span className="status-badge-officer approved">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    อนุมัติแล้ว
                </span>
            );
        } else {
            return (
                <span className="status-badge-officer rejected">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '4px' }}>
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    ไม่ผ่านการอนุมัติ
                </span>
            );
        }
    };

    const handleViewDetail = (serviceId) => {
        sessionStorage.setItem('selectedServiceId', serviceId);
        onNavigate('approveDetail');
    };

    const officerName = officer ? `${officer.prefix || ''}${officer.firstName} ${officer.lastName}` : "ไม่ระบุชื่อ";

    if (loading) {
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

            {/* Main Content Area */}
            <main className="homemember-container">
                <div className="list-approve-header-container">
                    <h2 className="officer-main-title">จัดการคำขอ</h2>

                    {/* Status Dropdown Filter */}
                    <div className="status-filter-container">
                        <label className="filter-label">กรองสถานะ</label>
                        <select value={selectedStatus} onChange={changeStatus} className="status-select">
                            <option value="ทั้งหมด">ทั้งหมด</option>
                            <option value="รอดำเนินการ">รอดำเนินการ</option>
                            <option value="อนุมัติ">อนุมัติแล้ว</option>
                            <option value="ไม่ผ่านการอนุมัติ">ไม่ผ่านการอนุมัติ</option>
                        </select>
                    </div>
                </div>

                {/* Table Layout Card */}
                <div className="officer-table-card">
                    <table className="officer-table">
                        <thead>
                            <tr>
                                <th>เลขที่ใบสมัคร</th>
                                <th>ชื่อ - นามสกุล</th>
                                <th>วันที่สมัคร</th>
                                <th>สถานะ</th>
                                <th style={{ textAlign: 'right' }}>การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', color: '#94a3b8', padding: '30px' }}>
                                        ไม่มีรายการคำขอในขณะนี้
                                    </td>
                                </tr>
                            ) : (
                                filteredServices.map((s) => (
                                    <tr key={s.serviceId}>
                                        <td>{"APP-" + String(s.serviceId).padStart(7, '0')}</td>
                                        <td>{s.member?.firstName} {s.member?.lastName}</td>
                                        <td>{utils.formatDate(s.requestDate)}</td>
                                        <td>{renderStatusBadge(s.status)}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <span
                                                className="action-detail-link"
                                                onClick={() => handleViewDetail(s.serviceId)}
                                            >
                                                ดูรายละเอียด
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginLeft: '4px' }}>
                                                    <polyline points="9 18 15 12 9 6" />
                                                </svg>
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Table Footer with dynamic entry counter and pagination mockup */}
                    <div className="table-footer-container">
                        <span className="entries-count-text">
                            แสดง {filteredServices.length} จาก {service.length} รายการ
                        </span>
                        <div className="pagination-wrapper">
                            <button className="page-nav-btn" disabled>ก่อนหน้า</button>
                            <button className="page-num-btn active">1</button>
                            <button className="page-nav-btn" disabled>ถัดไป</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ListApprove;