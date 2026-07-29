import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../CSS/AnnouncementMember.css';

function AnnouncementMember({ onNavigate }) {
    const [member, setMember] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const WEEKDAYS = ["วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์"];

    useEffect(() => {
        const fetchAnnouncement = async () => {
            const storedCitizenId = sessionStorage.getItem('citizenId');
            if (!storedCitizenId) {
                onNavigate('login');
                return;
            }
            try {
                const response = await axios.get('http://localhost:8081/api/members');
                const members = response.data;
                const foundMember = members.find(m => m.citizenId === storedCitizenId);

                if (foundMember) {
                    setMember(foundMember);
                }

                const announcementsResponse = await axios.get('http://localhost:8081/api/announcements');
                const announcementsData = announcementsResponse.data;
                setAnnouncements(announcementsData);

                const newAnnouncementCount = announcementsData.filter(item => item.announcementTopic !== null && item.announcementTopic !== undefined)
                localStorage.setItem('newAnnouncementCount', newAnnouncementCount.length.toString());
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสมาชิก:", error);
            }

        }
        fetchAnnouncement();
    }, [onNavigate]);

    // Filter announcements where the topic does not contain any of the weekdays
    const generalAnnouncements = announcements.filter(item =>
        !WEEKDAYS.some(day => item.announcementTopic?.includes(day))
    );

    return (
        <div>
            {/* Navigation Bar */}
            <nav className="homemember-navbar">
                <div className="navbar-brand" onClick={() => onNavigate('homemember')} style={{ cursor: 'pointer' }}>
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
                    <button className="back-home-button" onClick={() => onNavigate('homemember')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        หน้าหลัก
                    </button>
                    <div className="user-badge">
                        <div className="user-avatar-dot"></div>
                        <span>{member?.prefix}{member?.firstName} {member?.lastName}</span>
                    </div>
                </div>
            </nav>

            <div className="announcement-container">
                {/* 1. Schedule Grid Section (Top) */}
                <h2 className="schedule-section-title">
                    📅 ตารางการเก็บขยะประจำวัน
                </h2>
                <div className="schedule-grid">
                    {WEEKDAYS.map(day => {
                        // Find announcement matching this day
                        const dayAnnouncement = announcements.find(item =>
                            item.announcementTopic?.includes(day)
                        );

                        if (dayAnnouncement) {
                            const isUrgent = dayAnnouncement.announcementType === 'ด่วน';
                            return (
                                <div key={day} className="schedule-card">
                                    <div className="schedule-day">{day}</div>
                                    {isUrgent ? (
                                        <div className="urgent-box">
                                            <div className="urgent-text">
                                                แจ้งด่วน: {dayAnnouncement.announcementDetail}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="schedule-detail">
                                            {dayAnnouncement.announcementDetail}
                                        </div>
                                    )}
                                </div>
                            );
                        } else {
                            return (
                                <div key={day} className="schedule-card empty-card">
                                    <div className="schedule-day">{day}</div>
                                    <div className="schedule-empty-text">ไม่มีการเก็บขยะ</div>
                                </div>
                            );
                        }
                    })}
                </div>

                {/* 2. General Announcements Section (Bottom) */}
                <h2 className="general-section-title">
                    <svg className="general-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                    ประกาศและข่าวสาร
                </h2>

                {generalAnnouncements.length === 0 ? (
                    <div className="empty-state-container">
                        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4a2 2 0 00-2-2v3m2 3V9m0 0l-3-3m3 3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="empty-state-title">ไม่พบประกาศข่าวสาร</h3>
                        <p className="empty-state-desc">ไม่มีประกาศและข่าวสารใหม่ในขณะนี้</p>
                    </div>
                ) : (
                    <div className="announcements-grid">
                        {generalAnnouncements.map(item => (
                            <div key={item.announcementId} className="general-card">
                                <div>
                                    <h3 className="general-card-title">{item.announcementTopic}</h3>
                                    <p className="general-card-detail">{item.announcementDetail}</p>
                                </div>
                                <div className="general-card-footer">
                                    <span className="read-more-link">
                                        อ่านเพิ่มเติม <span style={{ fontSize: '16px' }}>→</span>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AnnouncementMember;