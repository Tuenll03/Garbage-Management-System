import React, { useState, useEffect } from 'react';
import axios from 'axios';
import utils from '../../../utils';
import validate from '../../../validate';
import '../../../CSS/AnnouncementAdd.css';

function AnnouncementAdd({ onNavigate }) {
    const [officer, setOfficer] = useState(null);
    const [newTopic, setNewTopic] = useState('');
    const [newDetail, setNewDetail] = useState('');
    const [newType, setNewType] = useState('ทั่วไป');
    const [newDate, setNewDate] = useState('');
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchOfficer = async () => {
            const storedCitizenId = sessionStorage.getItem('citizenId');
            if (!storedCitizenId) {
                onNavigate('login');
                return;
            }
            try {
                const response = await axios.get(`/api/officers/citizenId/${storedCitizenId}`);
                if (response.data) {
                    setOfficer(response.data);
                } else {
                    onNavigate('login');
                }
            } catch (error) {
                setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
            }
        };
        fetchOfficer();
    }, [onNavigate]);


    const officerName = officer ? `${officer.prefix || ''}${officer.firstName} ${officer.lastName}` : "ไม่ระบุชื่อ";

    const handleTopicChange = (e) => {
        const clean = utils.cleanTopic(e.target.value);
        setNewTopic(clean);
    };


    const handleDetailChange = (e) => {
        const clean = utils.cleanDetail(e.target.value);
        setNewDetail(clean);
    };

    const addAnnouncement = async (e) => {
        e.preventDefault();

        const errorMsg = validate.manageAnnouncements(
            newTopic,
            newDetail,
            newDate
        );

        if (errorMsg) {
            setMessage(errorMsg);
            setIsError(true);
            return;
        }

        const data = {
            announcementTopic: newTopic,
            announcementDetail: newDetail,
            announcementType: newType,
            announcementDate: newDate
        };

        try {
            const response = await axios.post('/api/announcements', data);
            if (response.data === 'success') {
                setMessage('เพิ่มประกาศสำเร็จ');
                setIsError(false);
                setNewTopic('');
                setNewDetail('');
                setNewType('ทั่วไป');
                setNewDate('');
            } else {
                setMessage("การบันทึกล้มเหลว");
                setIsError(true);
            }
        } catch (error) {
            setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ ');
            setIsError(true);
        }
    };

    return (
        <div className="manage-announcements-wrapper">
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
                    <button className="back-home-button" onClick={() => onNavigate('announcements')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        ย้อนกลับ
                    </button>
                    <div className="user-badge user-badge-default">
                        <div className="user-avatar-dot"></div>
                        <span>{officerName} ({officer?.position || 'เจ้าหน้าที่'})</span>
                    </div>
                </div>
            </nav>

            <div className="manage-announcements-container">
                <div className="announcement-card-box">
                    <div className="list-header-container list-header-mb-24">
                        <div className="list-title-icon-box list-title-icon-green">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                        </div>
                        <div className="list-header-text">
                            <h2>สร้างประกาศข่าวสาร</h2>
                            <p>ระบุหัวข้อ วันที่ ประเภท และรายละเอียดเพื่อเผยแพร่ข่าวสารประชาสัมพันธ์</p>
                        </div>
                    </div>

                    <form onSubmit={addAnnouncement} className="announcement-form">
                        <div className="form-row-full">
                            <label className="form-label" htmlFor="newTopic">
                                หัวข้อข่าวสาร <span className="required-star">*</span>
                            </label>
                            <input
                                type="text"
                                id="newTopic"
                                className="form-input-text"
                                value={newTopic}
                                onChange={handleTopicChange}
                                placeholder="กรอกหัวข้อข่าวสาร..."
                                maxLength="50"
                            />
                        </div>

                        <div className="form-grid-row">
                            <div className="form-row-full">
                                <label className="form-label" htmlFor="newDate">
                                    วันที่ประกาศ <span className="required-star">*</span>
                                </label>
                                <div
                                    className="form-input-text announcement-date-picker-box"
                                    onClick={() => {
                                        const el = document.getElementById('newDatePicker');
                                        if (el && el.showPicker) el.showPicker();
                                    }}
                                >
                                    <span className={`announcement-date-text ${!newDate ? 'placeholder' : ''}`}>
                                        {newDate
                                            ? utils.formatShortThaiDate(utils.convertCEtoBE(newDate))
                                            : "คลิกเพื่อเลือกวันที่ประกาศ..."}
                                    </span>
                                    <span className="input-internal-icon input-icon-static">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                    </span>
                                    <input
                                        type="date"
                                        id="newDatePicker"
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        //  กำหนดให้เลือกได้แค่วันปัจจุบัน 
                                        min={new Date().toISOString().split('T')[0]}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="announcement-date-hidden-input"
                                    />
                                </div>
                            </div>

                            <div className="form-row-full">
                                <label className="form-label" htmlFor="newType">
                                    ประเภทประกาศ
                                </label>
                                <select
                                    id="newType"
                                    className="form-select-box"
                                    value={newType}
                                    onChange={(e) => setNewType(e.target.value)}
                                >
                                    <option value="ทั่วไป">ทั่วไป</option>
                                    <option value="ด่วน">เร่งด่วน</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row-full">
                            <label className="form-label" htmlFor="newDetail">
                                รายละเอียดข่าวสาร <span className="required-star">*</span>
                            </label>
                            <textarea
                                id="newDetail"
                                className="form-textarea"
                                value={newDetail}
                                onChange={handleDetailChange}
                                placeholder="ระบุรายละเอียดประกาศข่าวสาร..."
                                maxLength="255"
                            />
                        </div>

                        <div className="form-buttons-row">
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={() => onNavigate('announcements')}
                            >
                                ยกเลิก
                            </button>
                            <button type="submit" className="btn-submit-save">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                    <polyline points="17 21 17 13 7 13 7 21" />
                                    <polyline points="7 3 7 8 15 8" />
                                </svg>
                                บันทึกประกาศ
                            </button>
                        </div>
                    </form>

                    {message && (
                        <div className={`announcement-message-banner ${isError ? 'error' : 'success'}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AnnouncementAdd;
