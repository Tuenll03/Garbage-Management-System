import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../CSS/HomeMember.css';
import utils from '../../utils';

function HomeMember({ onNavigate }) {
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasNewApproval, setHasNewApproval] = useState(false);
    const [newAnnouncement, setNewAnnouncement] = useState(false);
    const [newInvoice, setNewInvoice] = useState(false);
    const [message, setMessage] = useState(null);
    const [unpaidInvoices, setUnpaidInvoices] = useState('ไม่มีค้างชำระ');


    useEffect(() => {
        const fetchMember = async () => {
            const storedCitizenId = sessionStorage.getItem('citizenId');
            if (!storedCitizenId) {
                onNavigate('login');
                return;
            }

            try {
                const response = await axios.get(`/api/members/citizenId/${storedCitizenId}`);
                const foundMember = response.data;
                if (foundMember) {
                    setMember(foundMember);
                    fetchApproval(foundMember);
                    fetchNotification(foundMember);
                    fetchAnnouncement(foundMember);
                } else {
                    onNavigate('login');
                }
            } catch (error) {
                setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
            } finally {
                setLoading(false);
            }
        };


        const fetchApproval = async (member) => {
            try {
                //APPROVE
                const serviceResponse = await axios.get(`/api/services/member/${member.memberId}`);
                const services = serviceResponse.data;

                // คัดกรองเอาเฉพาะรายการที่ "อนุมัติ"
                const approvedServices = services.filter(s => s.status === 'อนุมัติ');

                // ดึงจำนวนคำร้องอนุมัติที่เคยเห็นล่าสุดที่เก็บไว้ในเครื่องผู้ใช้
                let lastSeenCount = parseInt(localStorage.getItem('seenApprovedCount') || '0', 10);

                // ถ้าจำนวนอนุมัติในระบบลดลง (เช่น มีการยกเลิก) ให้รีเซ็ตค่าในเครื่องตามทันที
                if (approvedServices.length < lastSeenCount) {
                    lastSeenCount = approvedServices.length;
                    localStorage.setItem('seenApprovedCount', lastSeenCount.toString());
                }

                // ถ้าในฐานข้อมูลมีรายการอนุมัติมากกว่าที่เครื่องผู้ใช้เคยเห็น แปลว่ามีอนุมัติเข้ามาใหม่!
                if (approvedServices.length > lastSeenCount) {
                    setHasNewApproval(true);
                } else {
                    setHasNewApproval(false);
                }

            } catch (error) {
                setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
            }
        };

        const fetchNotification = async (member) => {
            try {
                //invoice
                const invoiceResponse = await axios.get(`/api/invoices/member/${member.memberId}`);

                //ใช้ utils.filterInvoice
                const unpaidInvoices = utils.filterInvoice(invoiceResponse.data);

                // ดึงจำนวนบิลค้างชำระที่เคยเห็นล่าสุดที่เก็บไว้ในเครื่องผู้ใช้
                let lastSeenInvoiceCount = parseInt(localStorage.getItem('seenInvoicesCount') || '0', 10);

                // ถ้าจำนวนบิลค้างชำระในระบบลดลง ให้รีเซ็ตค่าในเครื่องตามทันที
                if (unpaidInvoices.length < lastSeenInvoiceCount) {
                    lastSeenInvoiceCount = unpaidInvoices.length;
                    localStorage.setItem('seenInvoicesCount', lastSeenInvoiceCount.toString());
                }
                // ถ้าในฐานข้อมูลมีบิลค้างชำระมากกว่าที่เครื่องผู้ใช้เคยเห็น แปลว่ามีบิลใหม่เข้ามา!
                if (unpaidInvoices.length > lastSeenInvoiceCount) {
                    setNewInvoice(true);
                } else {
                    setNewInvoice(false);
                }

                const hasUnpaid = invoiceResponse.data.filter(invoice => invoice.status === 'ค้างชำระ');

                setUnpaidInvoices(hasUnpaid.length > 0 ? 'ค้างชำระ' : 'ไม่มีค้างชำระ');
            } catch (error) {
                setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
            }
        };


        const fetchAnnouncement = async (member) => {
            try {
                //Announcement
                const announcementsResponse = await axios.get('/api/announcements');
                const announcementsData = announcementsResponse.data;

                //ใช้ utils.filterAnnouncement
                const myAnnouncements = utils.filterAnnouncement(announcementsData, member);

                let lastSeenAnnouncement = parseInt(localStorage.getItem('newAnnouncementCount') || '0', 10);

                // ถ้าจำนวนประกาศในระบบลดลง ให้รีเซ็ตค่าในเครื่องตามทันที
                if (myAnnouncements.length < lastSeenAnnouncement) {
                    lastSeenAnnouncement = myAnnouncements.length;
                    localStorage.setItem('newAnnouncementCount', lastSeenAnnouncement.toString());
                }

                // ถ้าในฐานข้อมูลมีประกาศมากกว่าที่เครื่องผู้ใช้เคยเห็น แปลว่ามีประกาศใหม่เข้ามา!
                if (myAnnouncements.length > lastSeenAnnouncement) {
                    setNewAnnouncement(true);
                } else {
                    setNewAnnouncement(false);
                }

            } catch (error) {
                setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
            }
        };



        fetchMember();
    }, [onNavigate]);


    const handleLogout = () => {
        onNavigate('login');
    };



    if (loading) {
        return (
            <div className="homemember-loading">
                <div className="spinner"></div>
                <p>กำลังโหลดข้อมูลสมาชิก...</p>
            </div>
        );
    }

    const memberName = member ? `${member.prefix || ''}${member.firstName} ${member.lastName}` : "ไม่ระบุชื่อ";
    const points = 350;
    const wasteWeight = 74.2;
    const pickupStatus = "ไม่มีงานคงค้าง";



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
                    <div className="user-badge user-badge-default">
                        <div className="user-avatar-dot"></div>
                        <span>{memberName}</span>
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

            {/* Main Dashboard Container */}
            <main className="homemember-container">

                {/* Welcome Banner */}
                <section className="welcome-banner">
                    <h2 className="welcome-title">สวัสดีคุณ {memberName}!</h2>
                    <p className="welcome-desc">
                        ขอบคุณที่เป็นส่วนหนึ่งในการร่วมมือแยกขยะและดูแลสิ่งแวดล้อมในชุมชนของเรา <br />
                        คุณสามารถตรวจสอบคะแนนสะสม แจ้งการขัดข้อง หรือแจ้งรับบริการขยะได้จากหน้านี้
                    </p>
                </section>

                {/* Stats Grid */}
                <section className="stats-grid">

                    {/* Card 3: Pickup Status */}
                    <div className="stat-card" onClick={() => onNavigate('invoiceMember')}>
                        <div className="stat-icon-wrapper pickup">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">สถานะการชำระเงิน</span>
                            <span className={`stat-value stat-pickup-status ${unpaidInvoices === 'ค้างชำระ' ? 'unpaid' : ''}`}>
                                {unpaidInvoices}
                            </span>
                        </div>
                    </div>
                </section>

                {/* Quick Actions Section */}
                <section className="dashboard-section" >
                    <h3 className="section-title section-title-mb-20">บริการและบริการของฉัน</h3>
                    <div className="actions-grid">
                        {/* Card 1 */}
                        <div className="action-card" onClick={() => onNavigate('notifyMember')}>
                            <div className="action-icon-box">
                                <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                </svg>
                                {/* จุดสีแดงจะขึ้นตรงมุมขวาบนของไอคอนเมื่อมีงานอนุมัติ */}
                                {(newInvoice || hasNewApproval) && <span className="red-dot-badge"></span>}
                            </div>
                            <h4 className="action-title">แจ้งเตือน</h4>
                            <p className="action-desc">แจ้งความประสงค์ขอรับการจัดเก็บขยะทั่วไป/ขยะขนาดใหญ่</p>
                        </div>

                        {/* Card 2 */}
                        <div className="action-card" onClick={() => onNavigate('requestService')}>
                            <div className="action-icon-box">
                                <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                                    <path d="M9 12h6" />
                                    <path d="M9 16h6" />
                                    <path d="M12 8h.01" />
                                </svg>
                            </div>
                            <h4 className="action-title">บริการ</h4>
                            <p className="action-desc">ใช้คะแนนสะสมที่มีเพื่อแลกรับสิ่งของอุปโภคบริโภค</p>
                        </div>

                        {/* Card 3 */}
                        <div className="action-card" onClick={() => onNavigate('viewAnnouncement')}>
                            <div className="action-icon-box">
                                <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <path d="M16 8h2" />
                                    <path d="M16 12h2" />
                                    <path d="M16 16h2" />
                                    <rect x="6" y="8" width="6" height="8" />
                                </svg>
                                {/* จุดสีแดงจะขึ้นตรงมุมขวาบนของไอคอนเมื่อมีงานอนุมัติ */}
                                {newAnnouncement && <span className="red-dot-badge"></span>}
                            </div>
                            <h4 className="action-title">ข่าวสาร</h4>
                            <p className="action-desc">แจ้งปัญหาขยะล้นถัง ถังขยะเสียหาย หรือส่งกลิ่นรบกวน</p>
                        </div>

                        {/* Card 4 */}
                        <div className="action-card" onClick={() => onNavigate('viewProfile')}>
                            <div className="action-icon-box">
                                <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <h4 className="action-title">ข้อมูลส่วนตัว</h4>
                            <p className="action-desc">ดูข้อมูลสมาชิกและสถิติข้อมูลที่อยู่อาศัยที่ลงทะเบียนไว้</p>
                        </div>
                    </div>
                </section>


            </main>
        </div>
    );
}

export default HomeMember;
