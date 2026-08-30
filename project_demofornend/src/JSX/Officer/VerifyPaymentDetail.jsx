import React, { useState, useEffect } from 'react';
import axios from 'axios';
import utils from '../../utils';
import '../../CSS/VerifyPayments.css';

function VerifyPaymentDetail({ onNavigate }) {
    const [officer, setOfficer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [invoice, setInvoice] = useState(null);
    const [service, setService] = useState(null);
    const [member, setMember] = useState(null);
    const [paidInvoice, setPaidInvoice] = useState([]);

    // Form inputs
    const [amountPaid, setAmountPaid] = useState("");
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // 1. Fetch Officer login state
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



    // 2. Fetch Invoice and Member payment history
    useEffect(() => {
        const storedServiceId = sessionStorage.getItem('selectedServiceId'); // Note: storedServiceId is actually the invoiceId
        if (!storedServiceId) return;

        const fetchInvoiceAndHistory = async () => {
            try {
                // Fetch the single invoice details
                const res = await axios.get(`http://localhost:8081/api/invoices/${storedServiceId}`);
                const currentInvoice = res.data;

                if (currentInvoice) {
                    setInvoice(currentInvoice);
                    setAmountPaid(currentInvoice.totalAmount);
                    setService(currentInvoice.service);
                    setMember(currentInvoice.service?.member);

                    // Fetch all invoices for this member to build payment history
                    const memberId = currentInvoice.service?.member?.memberId;
                    if (memberId) {
                        const historyRes = await axios.get(`http://localhost:8081/api/invoices/member/${memberId}`);
                        const paidList = historyRes.data.filter(
                            inv => inv.status === 'ชำระเงินแล้ว' || inv.status === 'ชำระแล้ว'
                        );
                        setPaidInvoice(paidList);
                    }
                }
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูลรายละเอียดบิล:", error);
            }
        };

        fetchInvoiceAndHistory();
    }, []);

    // 3. Confirm Cash Payment Action
    const handleSubmitPayment = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!invoice) return;

        if (!amountPaid || parseFloat(amountPaid) <= 0) {
            setErrorMsg("กรุณากรอกจำนวนเงินชำระให้ถูกต้อง");
            return;
        }

        const paymentData = {
            amountPaid: parseFloat(amountPaid),
            paymentDate: paymentDate,
            paymentMethod: 'เงินสด',
            invoice: {
                invoiceId: invoice.invoiceId
            }
        };

        try {
            const response = await axios.post('http://localhost:8081/api/payments', paymentData);
            setSuccessMsg("ยืนยันรับชำระเงินสดสำเร็จ!");

            // Update local invoice state
            setInvoice(prev => prev ? { ...prev, status: 'ชำระเงินแล้ว' } : null);

            // Refresh paid history list
            const memberId = member?.memberId;
            if (memberId) {
                const historyRes = await axios.get(`http://localhost:8081/api/invoices/member/${memberId}`);
                const paidList = historyRes.data.filter(
                    inv => inv.status === 'ชำระเงินแล้ว' || inv.status === 'ชำระแล้ว'
                );
                setPaidInvoice(paidList);
            }
        } catch (error) {
            console.error("ล้มเหลวในการบันทึกการรับชำระเงินสด:", error);
            setErrorMsg("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
        }
    };

    const officerName = officer ? `${officer.prefix || ''}${officer.firstName} ${officer.lastName}` : "ไม่ระบุชื่อ";
    const memberName = member ? `${member.prefix || ''}${member.firstName} ${member.lastName}` : "ไม่ระบุชื่อ";
    const formattedId = service ? `SV-${String(service.serviceId).padStart(5, '0')}` : "SV-00000";

    if (loading) {
        return (
            <div className="homemember-loading">
                <div className="spinner"></div>
                <p>กำลังโหลดรายละเอียด...</p>
            </div>
        );
    }

    const hasOverdue = invoice?.status === 'ค้างชำระ';

    return (
        <div className="verify-payments-wrapper">
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
                    <button className="back-home-button" onClick={() => onNavigate('verifyPayments')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        ย้อนกลับ
                    </button>
                    <div className="user-badge" style={{ cursor: 'default' }}>
                        <div className="user-avatar-dot"></div>
                        <span>{officerName} ({officer?.position || 'เจ้าหน้าที่'})</span>
                    </div>
                </div>
            </nav>

            <div className="verify-payments-container">
                <div className="payment-detail-split-layout">
                    {/* Left Form Card */}
                    <div className="detail-card-info payment-form-card">

                        {/* Member Profile Info */}
                        <div className="member-profile-header">
                            <div className="profile-avatar-circle">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <div className="profile-text-info">
                                <span className="profile-label">ครัวเรือนที่เลือก</span>
                                <h3 className="profile-name">{memberName}</h3>
                                <span className="profile-service-id">{formattedId}</span>
                            </div>
                            <div className="profile-status-wrapper">
                                <span className="profile-status-label">สถานะ</span>
                                <span className={`profile-status-tag ${hasOverdue ? 'unpaid' : 'paid'}`}>
                                    {hasOverdue ? 'มียอดค้างชำระ' : 'ชำระแล้ว'}
                                </span>
                            </div>
                        </div>

                        {/* Form Body */}
                        <form className="cash-payment-form" onSubmit={handleSubmitPayment}>
                            <div className="form-fields-row">
                                <div className="form-group-item">
                                    <label className="form-label-text">เดือนที่ชำระ</label>
                                    <select
                                        className="filter-select-input full-width-select"
                                        disabled
                                    >
                                        <option>
                                            {invoice ? utils.getInvoiceMonthYear(invoice.invoiceDate || invoice.dueDate) : ""}
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group-item">
                                    <label className="form-label-text">จำนวนเงิน (บาท)</label>
                                    <input
                                        type="number"
                                        className="cash-amount-input"
                                        value={amountPaid}
                                        onChange={(e) => setAmountPaid(e.target.value)}
                                        placeholder="0"
                                        disabled={!hasOverdue}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group-item full-width-group">
                                <label className="form-label-text">วันที่ชำระเงิน</label>
                                <div className="date-input-container">
                                    <input
                                        type="date"
                                        className="cash-date-input"
                                        value={paymentDate}
                                        onChange={(e) => setPaymentDate(e.target.value)}
                                        disabled={!hasOverdue}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Toast Messages */}
                            {errorMsg && <div className="form-toast-message error">{errorMsg}</div>}
                            {successMsg && <div className="form-toast-message success">{successMsg}</div>}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="confirm-cash-payment-btn"
                                disabled={!hasOverdue}
                            >
                                <div className="checkmark-circle-icon">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                ยืนยันการรับชำระเงินสด
                            </button>
                        </form>
                    </div>

                    {/* Right Payment History Card */}
                    <div className="detail-slip-preview-container history-card-panel">
                        <div className="history-header-title">
                            <svg className="history-title-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 8v4l3 3" />
                                <circle cx="12" cy="12" r="9" />
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <polyline points="3 3 3 8 8 8" />
                            </svg>
                            <h3 className="history-main-title">ประวัติการรับชำระล่าสุดของคุณ</h3>
                        </div>

                        <div className="history-table-wrapper">
                            <table className="history-table-list">
                                <thead>
                                    <tr>
                                        <th style={{ width: '40%' }}>สมาชิก</th>
                                        <th style={{ width: '30%', textAlign: 'right' }}>ยอดเงิน</th>
                                        <th style={{ width: '30%', textAlign: 'right' }}>เดือน</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paidInvoice.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="history-empty-row">
                                                ไม่มีประวัติการชำระเงิน
                                            </td>
                                        </tr>
                                    ) : (
                                        paidInvoice.slice(0, 4).map((inv) => (
                                            <tr key={inv.invoiceId}>
                                                <td className="history-member-name">{memberName}</td>
                                                <td className="history-amount-cell">
                                                    {inv.totalAmount?.toFixed(2)}
                                                </td>
                                                <td className="history-month-cell">
                                                    {utils.getInvoiceMonthYear(inv.invoiceDate || inv.dueDate)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="view-all-history-wrapper">
                            <span className="view-all-history-link">ดูประวัติทั้งหมด</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifyPaymentDetail;
