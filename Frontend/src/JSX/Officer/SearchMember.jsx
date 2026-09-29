import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../CSS/SearchMember.css";

const SearchMember = ({ onNavigate }) => {
    const [officer, setOfficer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [service, setService] = useState([]);
    const [searchWord, setSearchWord] = useState("");
    const [message, setMessage] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("ทั้งหมด");

    useEffect(() => {
        const fetchOfficer = async () => {
            const storedCitizenId = sessionStorage.getItem('citizenId');
            if (!storedCitizenId) {
                onNavigate('login');
                return;
            }

            try {
                const response = await axios.get(`/api/officers/citizenId/${storedCitizenId}`);
                const foundOfficer = response.data;
                if (foundOfficer) {
                    setOfficer(foundOfficer);
                } else {
                    onNavigate('login');
                }
            } catch (error) {
                setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
            } finally {
                setLoading(false);
            }
        };

        fetchOfficer();
    }, [onNavigate]);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await axios.get('/api/services');
                setService(response.data);
            } catch (error) {
                setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
            }
        };
        fetchService();
    }, []);

    const officerName = officer ? `${officer.prefix || ''}${officer.firstName} ${officer.lastName}` : "ไม่ระบุชื่อ";

    const changeStatus = (e) => {
        setSelectedStatus(e.target.value);
    };

    const searchMember = service.filter((s) => {
        // 1. ค้นหาตามข้อความ (ชื่อ, นามสกุล, หมู่ที่)
        const word = searchWord.trim();
        //เช็คว่าคำค้นหาว่างหรือไม่ถ้าว่างให้แสดงทั้งหมด
        const matchesSearch = !word ||
            (s.member?.firstName?.includes(word)) ||
            (s.member?.lastName?.includes(word)) ||
            (s.villageNo?.includes(word));

        // 2. กรองตามสถานะ
        const isApproved = s.status === "อนุมัติ" || s.status === "อนุมัติแล้ว" || s.status === "ใช้งาน";
        const statusText = isApproved ? "ใช้งาน" : "ยกเลิก";

        const matchesStatus = selectedStatus === "ทั้งหมด" ||
            statusText === selectedStatus ||
            s.status === selectedStatus;

        return matchesSearch && matchesStatus;
    }).slice(0, 10);

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
                <div className="navbar-brand navbar-brand-clickable" onClick={() => onNavigate('homeOfficer')}>
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
                    <div className="user-badge user-badge-default">
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
                        <input
                            type="text"
                            className="search-input-field"
                            value={searchWord}
                            onChange={(e) => setSearchWord(e.target.value)}
                            placeholder="ค้นหาชื่อ, ที่อยู่..."
                        />
                    </div>

                    <div className="filter-select-wrapper">
                        <select
                            className="status-filter-select"
                            value={selectedStatus}
                            onChange={changeStatus}
                        >
                            <option value="ทั้งหมด">แสดงสถานะทั้งหมด</option>
                            <option value="ใช้งาน">ใช้งาน</option>
                            <option value="ยกเลิก">ยกเลิก</option>
                        </select>
                    </div>
                </div>

                {/* Table Card */}
                <div className="table-card-box">
                    <table className="households-custom-table">
                        <thead>
                            <tr>
                                <th className="col-households-fname">ชื่อ</th>
                                <th className="col-households-lname">นามสกุล</th>
                                <th className="col-households-village">หมู่บ้าน</th>
                                <th className="col-households-status">สถานะ</th>
                                <th className="col-households-action">ดูรายละเอียด</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchMember.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="empty-table-row">
                                        ไม่พบการค้นหา
                                    </td>
                                </tr>
                            ) : (
                                searchMember.map((s) => {

                                    const isApproved = s.status === "อนุมัติ" || s.status === "อนุมัติแล้ว" || s.status === "ใช้งาน";
                                    const statusText = isApproved ? "ใช้งาน" : "ยกเลิก";
                                    const statusClass = isApproved ? "active" : "inactive";

                                    const formattedServiceId = `SV-${String(s.serviceId).padStart(4, '0')}`;
                                    const villageFormatted = s.villageNo ? `หมู่ ${s.villageNo}` : "-";

                                    return (
                                        <tr key={s.serviceId}>

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
                                                        sessionStorage.setItem('selectedMemberCitizenId', s.member?.citizenId);
                                                        onNavigate('viewProfile');
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

export default SearchMember;