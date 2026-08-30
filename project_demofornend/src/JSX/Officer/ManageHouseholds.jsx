import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../CSS/ManageHouseholds.css";

const ManageHouseholds = ({ onNavigate }) => {
    const [officer, setOfficer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [service, setService] = useState([]);
    const [searchWord, setSearchWord] = useState("");

    useEffect(() => {
        const fetchOfficer = async () => {
            const storedCitizenId = sessionStorage.getItem('citizenId');
            if (!storedCitizenId) {
                onNavigate('login');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8081/api/officers/citizenId/${storedCitizenId}`);
                const foundOfficer = response.data;
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
            try {
                const response = await axios.get('http://localhost:8081/api/services');
                setService(response.data);
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูลบริการ:", error);
            }
        };
        fetchService();
    }, []);

    const officerName = officer ? `${officer.prefix || ''}${officer.firstName} ${officer.lastName}` : "ไม่ระบุชื่อ";

    const filteredServices = service.filter((s) => {
        if (!searchWord.trim()) return true;
        const word = searchWord.trim();
        return (s.member?.firstName?.includes(word)) ||
            (s.member?.lastName?.includes(word)) ||
            (s.villageNo?.includes(word));
    });

    if (loading) {
        return (
            <div className="homemember-loading">
                <div className="spinner"></div>
                <p>กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    return (
        <div className="manage-households-wrapper">
            {/* Navigation Bar */}
            <nav className="homemember-navbar">
                <div className="navbar-brand" onClick={() => onNavigate('homeOfficer')} style={{ cursor: 'pointer' }}>
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

            <div className="manage-households-container">
                {/* Header */}
                <div className="page-header-box">
                    <h2 className="page-title">ระบบการจัดการบ้านเรือน</h2>
                    <p className="page-subtitle">ค้นหาและจัดการสถานะการใช้บริการเก็บขนขยะรายครัวเรือน</p>
                </div>

                {/* Search Card */}
                <div className="search-card-container">
                    <div className="search-input-wrapper">
                        <svg className="search-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="text"
                            className="search-input-field"
                            value={searchWord}
                            onChange={(e) => setSearchWord(e.target.value)}
                            placeholder="ค้นหาชื่อ, ที่อยู่..."
                        />
                    </div>
                </div>

                {/* Table Card */}
                <div className="table-card-box">
                    <table className="households-custom-table">
                        <thead>
                            <tr>
                                <th style={{ width: '15%' }}>รหัสบริการ</th>
                                <th style={{ width: '18%' }}>ชื่อ</th>
                                <th style={{ width: '18%' }}>นามสกุล</th>
                                <th style={{ width: '15%' }}>หมู่บ้าน</th>
                                <th style={{ width: '16%' }}>สถานะ</th>
                                <th style={{ width: '18%' }}>การกระทำ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="empty-table-row">
                                        ไม่พบการค้นหา
                                    </td>
                                </tr>
                            ) : (
                                filteredServices.map((s) => {

                                    const isApproved = s.status === "อนุมัติ" || s.status === "อนุมัติแล้ว" || s.status === "ใช้งาน";
                                    const statusText = isApproved ? "ใช้งาน" : "ยกเลิก";
                                    const statusClass = isApproved ? "active" : "inactive";

                                    const formattedServiceId = `SV-${String(s.serviceId).padStart(4, '0')}`;
                                    const villageFormatted = s.villageNo ? `หมู่ ${s.villageNo}` : "-";

                                    return (
                                        <tr key={s.serviceId}>
                                            <td className="service-id-cell">{formattedServiceId}</td>
                                            <td className="name-bold-cell">{s.member?.firstName || "-"}</td>
                                            <td className="name-bold-cell">{s.member?.lastName || "-"}</td>
                                            <td>{villageFormatted}</td>
                                            <td>
                                                <span className={`status-badge ${statusClass}`}>
                                                    <span className="badge-dot"></span>
                                                    {statusText}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="action-view-btn"
                                                    onClick={() => {
                                                        sessionStorage.setItem('selectedServiceId', s.serviceId);
                                                        onNavigate('approveDetail');
                                                    }}
                                                >
                                                    <svg className="action-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                        <circle cx="12" cy="12" r="3"></circle>
                                                    </svg>
                                                    ดูรายละเอียด
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageHouseholds;