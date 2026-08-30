import React, { useState, useEffect } from 'react';
import axios from 'axios';
import utils from '../../utils';
import validate from '../../validate';
import '../../CSS/HomeAdmin.css';

function EditOfficer({ onNavigate }) {
    const [admin, setAdmin] = useState(null);
    const [officerId, setOfficerId] = useState(null);
    const [citizenId, setCitizenId] = useState('');
    const [prefix, setPrefix] = useState('นาย');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [position, setPosition] = useState('เจ้าหน้าที่');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('ทำงาน');

    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminAndOfficer = async () => {
            const storedCitizenId = sessionStorage.getItem('citizenId');
            const selectedCitizenId = sessionStorage.getItem('selectedCitizenId');
            if (!storedCitizenId || !selectedCitizenId) {
                onNavigate('login');
                return;
            }

            try {
                // 1. Fetch current logged in admin
                const adminResponse = await axios.get(`http://localhost:8081/api/admins/citizenId/${storedCitizenId}`);
                if (adminResponse.data) {
                    setAdmin(adminResponse.data);
                } else {
                    onNavigate('login');
                    return;
                }

                // 2. Fetch selected officer details to edit
                const officerResponse = await axios.get(`http://localhost:8081/api/officers/citizenId/${selectedCitizenId}`);
                if (officerResponse.data) {
                    const off = officerResponse.data;
                    setOfficerId(off.officerId);
                    setCitizenId(utils.formatCitizenId(off.citizenId));
                    setPrefix(off.prefix || 'นาย');
                    setFirstName(off.firstName || '');
                    setLastName(off.lastName || '');
                    setPosition(off.position || 'เจ้าหน้าที่');
                    setPassword(off.password || '');
                    setStatus(off.status || 'ทำงาน');
                } else {
                    setMessage("ไม่พบข้อมูลเจ้าหน้าที่คนดังกล่าว");
                    setIsError(true);
                }

            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminAndOfficer();
    }, [onNavigate]);

    const adminName = admin?.firstName && admin?.lastName
        ? `${admin.prefix} ${admin.firstName} ${admin.lastName}`
        : 'ชื่อผู้ใช้';

    const handleCitizenIdChange = (e) => {
        const formatted = utils.formatCitizenId(e.target.value);
        setCitizenId(formatted);
    };

    const handlePositionChange = (e) => {
        const formatted = utils.cleanFirstName(e.target.value);
        setPosition(formatted);
    };

    const handleFirstNameChange = (e) => {
        const clean = utils.cleanFirstName(e.target.value);
        setFirstName(clean);
    };

    const handleLastNameChange = (e) => {
        const clean = utils.cleanLastName(e.target.value);
        setLastName(clean);
    };

    const handlePasswordChange = (e) => {
        const clean = utils.cleanPassword(e.target.value);
        setPassword(clean);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errorMsg = validate.vlaidateAddOfficer(
            citizenId,
            position,
            firstName,
            lastName,
            password
        );
        if (errorMsg) {
            setMessage(errorMsg);
            setIsError(true);
            return;
        }

        const data = {
            officerId: officerId,
            citizenId: utils.cleanCitizenId(citizenId),
            prefix: prefix,
            position: position,
            firstName: firstName,
            lastName: lastName,
            password: password,
            status: status
        }

        try {
            const response = await axios.put(`http://localhost:8081/api/officers/${officerId}`, data);

            if (response.data === "error") {
                setMessage("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
                setIsError(true);
            } else {
                setMessage("บันทึกการแก้ไขเรียบร้อยแล้ว");
                setIsError(false);
                setTimeout(() => onNavigate('manageofficers'), 1500);
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล:", error);
            setMessage("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
            setIsError(true);
        }
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
                <form className="officer-form-card" onSubmit={handleSubmit}>
                    {/* Citizen ID */}
                    <div className="officer-form-group">
                        <label className="officer-form-label" htmlFor="citizenId">เลขประจำตัวประชาชน (Citizen ID)</label>
                        <div className="officer-input-with-icon">
                            <span className="officer-input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="16" rx="2" />
                                    <circle cx="9" cy="10" r="2" />
                                    <path d="M14 9h4" />
                                    <path d="M14 13h4" />
                                    <path d="M5 16s1-1 4-1 4 1 4 1" />
                                </svg>
                            </span>
                            <div 
                                className="officer-text-input has-icon" 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    backgroundColor: '#f8fafc', 
                                    color: '#334155', 
                                    cursor: 'not-allowed',
                                    border: '1px solid #e2e8f0',
                                    boxSizing: 'border-box'
                                }}
                            >
                                {utils.maskCitizenId(citizenId)}
                            </div>

                        </div>
                    </div>

                    {/* Prefix & Position */}
                    <div className="officer-form-row-double">
                        <div className="officer-form-group">
                            <label className="officer-form-label">คำนำหน้า (Prefix)</label>
                            <select
                                className="officer-select-input"
                                value={prefix}
                                onChange={(e) => setPrefix(e.target.value)}
                            >
                                <option value="นาย">นาย</option>
                                <option value="นาง">นาง</option>
                                <option value="นางสาว">นางสาว</option>
                            </select>
                        </div>
                        <div className="officer-form-group">
                            <label className="officer-form-label">ตำแหน่ง (Position)</label>
                            <input
                                type="text"
                                className="officer-text-input"
                                value={position}
                                onChange={handlePositionChange}
                                placeholder="เช่น เจ้าหน้าที่วิเคราะห์นโยบาย"
                            />
                        </div>
                    </div>

                    {/* First Name & Last Name */}
                    <div className="officer-form-row-double">
                        <div className="officer-form-group">
                            <label className="officer-form-label">ชื่อ (First Name)</label>
                            <input
                                type="text"
                                className="officer-text-input"
                                value={firstName}
                                onChange={handleFirstNameChange}
                                placeholder="ระบุชื่อจริง"
                            />
                        </div>
                        <div className="officer-form-group">
                            <label className="officer-form-label">นามสกุล (Last Name)</label>
                            <input
                                type="text"
                                className="officer-text-input"
                                value={lastName}
                                onChange={handleLastNameChange}
                                placeholder="ระบุนามสกุล"
                            />
                        </div>
                    </div>

                    {/* Security Block & Status Row */}
                    <div className="officer-security-block">
                        <div className="security-block-header">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            ความปลอดภัยและการตั้งค่าบัญชี
                        </div>

                        <div className="officer-form-row-double" style={{ gap: '20px', width: '100%' }}>
                            <div className="officer-form-group" style={{ marginBottom: 0 }}>
                                <label className="officer-form-label">รหัสผ่าน (Password)</label>
                                <div className="officer-input-with-icon">
                                    <span className="officer-input-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="7.5" cy="15.5" r="5.5" />
                                            <path d="m21 2-9.6 9.6" />
                                            <path d="m15.5 7.5 3 3M19 4l2 2" />
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        className="officer-text-input has-icon"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder="อย่างน้อย 8 ตัวอักษร"
                                        maxLength="8"
                                    />
                                </div>
                            </div>

                            <div className="officer-form-group" style={{ marginBottom: 0 }}>
                                <label className="officer-form-label">สถานะการใช้งาน</label>
                                <select
                                    className="officer-select-input"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="ทำงาน">เปิดใช้งาน</option>
                                    <option value="หยุดทำงาน">ระงับการใช้งาน</option>
                                </select>
                            </div>
                        </div>
                        <span className="security-hint-text">
                            คำแนะนำ: ควรมีอักษรพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และอักขระพิเศษ
                        </span>
                    </div>

                    {/* Alert Messages */}
                    {message && (
                        <div className={`modal-alert ${isError ? 'error' : 'success'}`} style={{ marginBottom: '20px' }}>
                            {message}
                        </div>
                    )}

                    {/* Action Buttons Row */}
                    <div className="officer-btn-actions-row">
                        <button
                            type="button"
                            className="btn-officer-cancel"
                            onClick={() => onNavigate('manageofficers')}
                        >
                            ยกเลิก
                        </button>
                        <button type="submit" className="btn-officer-submit">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                <polyline points="17 21 17 13 7 13 7 21" />
                                <polyline points="7 3 7 8 15 8" />
                            </svg>
                            บันทึกการแก้ไข
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditOfficer;