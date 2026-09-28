import React, { useState, useEffect } from 'react';
import axios from 'axios';
import utils from '../../utils';
import '../../CSS/Announcements.css';
import AnnouncementDelete from './Announcement/AnnouncementDelete';

function Announcements({ onNavigate }) {
    const [officer, setOfficer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [announcements, setAnnouncements] = useState([]);
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
                setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์')

            } finally {
                setLoading(false);
            }
        };
        fetchOfficer();
    }, [onNavigate]);

    const listAnnouncements = async () => {
        try {
            const response = await axios.get('/api/announcements');
            const sorted = response.data.sort((a, b) => new Date(b.announcementDate) - new Date(a.announcementDate)
                || b.announcementId - a.announcementId);
            setAnnouncements(sorted);
        } catch (error) {
            setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลประกาศ');
            setIsError(true);
        }
    };

    useEffect(() => {
        listAnnouncements();
    }, []);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const officerName = officer ? `${officer.prefix || ''}${officer.firstName} ${officer.lastName}` : "ไม่ระบุชื่อ";

    const handleEdit = (id) => {
        sessionStorage.setItem('selectedAnnouncementId', id);
        onNavigate('editAnnouncement');
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


            <div className="manage-announcements-container">
                {message && (
                    <div className={`announcement-message-banner ${isError ? 'error' : 'success'} announcement-banner-mb`}>
                        {message}
                    </div>
                )}

                <div className="announcement-card-box mt-0">
                    <div className="list-header-container list-header-space-between">
                        <div className="list-header-title-group">
                            <div className="list-title-icon-box">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L21 8M21 3v5h-5" />
                                </svg>
                            </div>
                            <div className="list-header-text">
                                <h2>รายการข่าวสารทั้งหมด</h2>
                                <p>ประวัติการประกาศข้อมูลในระบบ</p>
                            </div>
                        </div>
                        <button
                            className="btn-submit-save btn-add-announce"
                            onClick={() => onNavigate('addAnnouncement')}
                            type="button"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-icon-mr">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            เพิ่มประกาศ
                        </button>
                    </div>

                    <div className="table-responsive">
                        <table className="announcements-custom-table">
                            <thead>
                                <tr>
                                    <th className="th-announce-topic">หัวข้อข่าวสาร</th>
                                    <th className="th-announce-detail">รายละเอียด</th>
                                    <th className="th-announce-date">วันที่ประกาศ</th>
                                    <th className="th-announce-action">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {announcements.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="empty-table-row">
                                            ไม่พบข้อมูลประกาศข่าวสารในระบบขณะนี้
                                        </td>
                                    </tr>
                                ) : (
                                    announcements.map((item) => {
                                        const isUrgent = item.announcementType === 'ด่วน' || item.announcementType === 'เร่งด่วน';
                                        const isGeneral = item.announcementType === 'ทั่วไป';
                                        let dotClass = 'dot-blue';
                                        if (isUrgent) dotClass = 'dot-orange';
                                        else if (isGeneral) dotClass = 'dot-green';

                                        return (
                                            <tr key={item.announcementId}>
                                                <td>
                                                    <div className="topic-td-cell">
                                                        <span className={`announce-dot ${dotClass}`}></span>
                                                        <span>{item.announcementTopic}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="announcement-detail-text">
                                                        {item.announcementDetail}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="date-td-cell">
                                                        {utils.formatShortThaiDate(utils.convertCEtoBE(item.announcementDate))}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="actions-td-cell">
                                                        <button
                                                            className="btn-action-edit"
                                                            onClick={() => handleEdit(item.announcementId)}
                                                        >
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="action-icon">
                                                                <path d="M12 20h9" />
                                                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                            </svg>
                                                            แก้ไข
                                                        </button>
                                                        <AnnouncementDelete
                                                            id={item.announcementId}
                                                            onDeleteSuccess={() => {
                                                                setMessage('ลบประกาศสำเร็จ');
                                                                setIsError(false);
                                                                listAnnouncements();

                                                            }}
                                                            onError={(msg) => {
                                                                setMessage(msg);
                                                                setIsError(true);
                                                            }}
                                                        />
                                                    </div>
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
        </div>
    );
}

export default Announcements;
