import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../CSS/HomeMember.css';
import '../../CSS/NotifyMember.css';
import NotifyPayment from './Notify/NotifyPayment';
import NotifyService from './Notify/NotifyService';

function NotifyMember({ onNavigate }) {
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMemberData = async () => {
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
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสมาชิก:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMemberData();
    }, [onNavigate])

    if (loading) {
        return (
            <div className="homemember-loading">
                <div className="spinner"></div>
                <p>กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    return (
        <div className="notify-page-container">
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

            <main className="notify-content">
                {/* Header Section */}
                <div className="notify-header">
                    <h2 className="notify-page-title">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        ติดตามสถานะคำร้อง
                    </h2>
                </div>

                {/* การแจ้งเตือนบิลชำระเงินค่าบริการ */}
                {member && <NotifyPayment memberId={member.memberId} />}

                {/* ติดตามสถานะคำร้องขอขยะ */}
                {member && <NotifyService memberId={member.memberId} />}
            </main>
        </div>
    );
}

export default NotifyMember;