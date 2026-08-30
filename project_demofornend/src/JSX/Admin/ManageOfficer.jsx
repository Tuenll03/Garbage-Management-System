import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../CSS/HomeAdmin.css';

function ManageOfficer({ onNavigate }) {
    const [admin, setadmin] = useState(null);
    const [officers, setofficers] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('ทั้งหมด');

    useEffect(() => {
        const fetchAdminAndStats = async () => {
            const storedCitizenId = sessionStorage.getItem('citizenId');
            if (!storedCitizenId) {
                onNavigate('login');
                return;
            }

            try {
                // 1. Fetch current logged in admin
                const response = await axios.get(`http://localhost:8081/api/admins/citizenId/${storedCitizenId}`);
                if (response.data) {
                    setadmin(response.data);
                } else {
                    onNavigate('login');
                    return;
                }

            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
            }
        };


        const fetchOfficers = async () => {
            const response = await axios.get('http://localhost:8081/api/officers');
            setofficers(response.data);
        }

        fetchAdminAndStats();
        fetchOfficers();
    }, [onNavigate]);

    const adminName = admin?.firstName && admin?.lastName
        ? `${admin.prefix} ${admin.firstName} ${admin.lastName}`
        : 'ชื่อผู้ใช้';


    const changeStatus = (e) => {
        setSelectedStatus(e.target.value);
    };

    const filteredOfficers = officers.filter((officer) => {
        if (selectedStatus === 'ทั้งหมด') return true;
        return officer.status === selectedStatus;
    });

    const handleEditOfficer = (citizenId) => {
        sessionStorage.setItem('selectedCitizenId', citizenId);
        onNavigate('editOfficer');
    };

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
                    <button className="back-home-button" onClick={() => onNavigate('homeAdmin')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        หน้าหลัก
                    </button>
                    <div className="user-badge" style={{ cursor: 'default' }}>
                        <div className="user-avatar-dot"></div>
                        <span>{adminName} ({admin?.position || 'ผู้ดูแลระบบ'})</span>
                    </div>
                </div>
            </nav>

            <div className="admin-container">
                <div className="admin-content-panel">
                    {/* Header Controls Row */}
                    <div className="panel-header-row">
                        {/* Dropdown Filter styled to match mockup */}
                        <div className="admin-search-box">
                            <select
                                className="search-input-field"
                                value={selectedStatus}
                                onChange={changeStatus}
                                style={{ paddingLeft: '14px', appearance: 'auto', background: '#ffffff', cursor: 'pointer' }}
                            >
                                <option value="ทั้งหมด">แสดงสถานะทั้งหมด</option>
                                <option value="ทำงาน">เปิดใช้งาน</option>
                                <option value="หยุดทำงาน">ระงับการใช้งาน</option>
                            </select>
                        </div>

                        {/* Add Officer Button */}
                        <button className="btn-add-officer" onClick={() => onNavigate('addOfficer')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            เพิ่มเจ้าหน้าที่
                        </button>
                    </div>

                    {/* Table Container */}
                    <div className="admin-table-container">
                        <table className="admin-data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '18%' }}>รหัสเจ้าหน้าที่</th>
                                    <th style={{ width: '18%' }}>ชื่อ</th>
                                    <th style={{ width: '18%' }}>นามสกุล</th>
                                    <th style={{ width: '20%' }}>ตำแหน่ง</th>
                                    <th style={{ width: '16%' }}>สถานะการใช้งาน</th>
                                    <th style={{ width: '10%', textAlign: 'center' }}>การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOfficers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontWeight: 500 }}>
                                            ไม่พบข้อมูลเจ้าหน้าที่
                                        </td>
                                    </tr>
                                ) : filteredOfficers.map((officer) => (
                                    <tr key={officer.citizenId}>
                                        <td className="admin-citizen-cell" style={{ fontWeight: 700 }}>
                                            OFF-{String(officer.officerId).padStart(3, '0')}
                                        </td>
                                        <td className="admin-name-cell">{officer.firstName}</td>
                                        <td>{officer.lastName}</td>
                                        <td>{officer.position || 'เจ้าหน้าที่'}</td>
                                        <td>
                                            <span className={`admin-status-badge ${officer.status === 'ทำงาน' ? 'active' : 'suspended'}`}>
                                                • {officer.status === 'ทำงาน' ? 'เปิดใช้งาน' : 'ระงับการใช้งาน'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleEditOfficer(officer.citizenId)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#94a3b8',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '6px',
                                                    borderRadius: '6px',
                                                    transition: 'color 0.15s ease'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.color = '#475569'}
                                                onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
                                                title="แก้ไขข้อมูล"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageOfficer;