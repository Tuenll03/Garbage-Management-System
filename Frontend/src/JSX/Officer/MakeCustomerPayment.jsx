import React, { useState, useEffect } from 'react';
import axios from 'axios';
import utils from '../../utils';
import '../../CSS/MakeCustomerPayment.css';

function MakeCustomerPayment({ onNavigate }) {
    const [officer, setOfficer] = useState(null);
    const [loading, setLoading] = useState(true);


    const [member, setMember] = useState(null);
    const [paidInvoice, setPaidInvoice] = useState([]);
    const [message, setMessage] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [unpaidInvoices, setUnpaidInvoices] = useState([]);
    const [selectedInvoiceIds, setSelectedInvoiceIds] = useState([]);

    const [amountPaid, setAmountPaid] = useState("");
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // 1. Fetch Officer login state 
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
                setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์')
            } finally {
                setLoading(false);
            }
        };

        fetchOfficer();
    }, [onNavigate]);

    // ดึงข้อมูลบิลที่เลือกชำระ
    useEffect(() => {
        const storedServiceId = sessionStorage.getItem('selectedServiceId');
        if (!storedServiceId) return;

        const viewPayment = async () => {
            try {
                const response = await axios.get(`/api/invoices/${storedServiceId}`);
                const currentInvoice = response.data;

                if (currentInvoice) {
                    setMember(currentInvoice.service?.member);
                    const memberId = currentInvoice.service?.member?.memberId;
                    viewPaymentHistory(memberId);

                }
            } catch (error) {
                setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์')
            }
        };

        // ดึงประวัติการชำระเงินทั้งหมดของสมาชิก
        const viewPaymentHistory = async (memberId) => {
            try {
                if (memberId) {
                    const historyRes = await axios.get(`/api/invoices/member/${memberId}`);

                    // 1. บิลที่ชำระแล้ว 
                    const paidList = historyRes.data.filter(
                        inv => inv.status === 'ชำระเงินแล้ว' || inv.status === 'ชำระแล้ว'
                    );
                    setPaidInvoice(paidList);


                    // 2. บิลที่ค้างชำระ 
                    const unpaidList = historyRes.data.filter(
                        inv => inv.status === 'ค้างชำระ'
                    );
                    setUnpaidInvoices(unpaidList);


                    // 3. ตั้งค่าเริ่มต้น: ติ๊กเลือกทุกบิล และ คำนวณยอดเงินรวม
                    setSelectedInvoiceIds(unpaidList.map(inv => inv.invoiceId));
                    const total = unpaidList.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
                    setAmountPaid(total);
                }
            } catch (error) {
                setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
            }
        }

        viewPayment();
    }, []);




    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);


    // เมื่อกดติ๊ก "เลือกทั้งหมด"
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = unpaidInvoices.map(inv => inv.invoiceId);
            setSelectedInvoiceIds(allIds);
            const total = unpaidInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
            setAmountPaid(total);
        } else {
            setSelectedInvoiceIds([]);
            setAmountPaid(0);
        }
    };
    // เมื่อกดติ๊ก "เลือกทีละบิล"
    const handleToggleInvoice = (invoiceId) => {
        setSelectedInvoiceIds(prev => {
            const updated = prev.includes(invoiceId)
                ? prev.filter(id => id !== invoiceId)
                : [...prev, invoiceId];
            // คำนวณยอดเงินรวมใหม่ตามบิลที่ยังติ๊กอยู่
            const total = unpaidInvoices
                .filter(inv => updated.includes(inv.invoiceId))
                .reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
            setAmountPaid(total);
            return updated;
        });
    };


    // 3. เปิด Modal ยืนยันการชำระเงิน
    const handleOpenConfirmModal = (e) => {
        if (e && e.preventDefault) e.preventDefault();

        if (selectedInvoiceIds.length === 0) {
            setMessage("กรุณาเลือกอย่างน้อย 1 บิลที่ต้องการชำระ");
            return;
        }

        if (!paymentDate) {
            setMessage("กรุณาระบุวันที่ชำระเงิน");
            return;
        }

        setShowConfirmModal(true);
    };

    // 4. บันทึกการชำระเงินสดจริงหลังกดยืนยันใน Modal
    const makeCustomerPayment = async () => {
        setShowConfirmModal(false);

        try {
            // วนลูปยิงบันทึกชำระเงินทุกบิลที่ติ๊กเลือกพร้อมกัน
            const paymentPromises = selectedInvoiceIds.map(invoiceId => {
                const currentInv = unpaidInvoices.find(i => i.invoiceId === invoiceId);
                return axios.post('/api/payments/officer', {
                    amountPaid: currentInv ? currentInv.totalAmount : 0,
                    paymentDate: paymentDate,
                    paymentMethod: 'เงินสด',
                    invoice: { invoiceId: invoiceId }
                });
            });
            const responses = await Promise.all(paymentPromises);
            const allSuccess = responses.every(res => res.data === "successfully");

            if (allSuccess) {
                setMessage("ยืนยันรับชำระเงินสดสำเร็จ!");
                setIsSuccess(true);

                // เคลียร์บิลที่เพิ่งจ่ายออกจากรายการค้างชำระ
                const remainingUnpaid = unpaidInvoices.filter(inv => !selectedInvoiceIds.includes(inv.invoiceId));
                setUnpaidInvoices(remainingUnpaid);
                setSelectedInvoiceIds(remainingUnpaid.map(i => i.invoiceId));
                const remainingTotal = remainingUnpaid.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
                setAmountPaid(remainingTotal);

                // อัพเดทประวัติการชำระเงินฝั่งขวา
                const memberId = member?.memberId;
                if (memberId) {
                    const historyRes = await axios.get(`/api/invoices/member/${memberId}`);
                    const paidList = historyRes.data.filter(
                        inv => inv.status === 'ชำระเงินแล้ว' || inv.status === 'ชำระแล้ว'
                    ).sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate));
                    setPaidInvoice(paidList);
                }
            } else {
                setMessage("การชำระเงินไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
                setIsSuccess(false);
            }

        } catch (error) {
            setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
            setIsSuccess(false);
        }
    };

    const officerName = officer ? `${officer.prefix || ''}${officer.firstName} ${officer.lastName}` : "ไม่ระบุชื่อ";
    const memberName = member ? `${member.prefix || ''}${member.firstName} ${member.lastName}` : "ไม่ระบุชื่อ";

    if (loading) {
        return (
            <div className="homemember-loading">
                <div className="spinner"></div>
                <p>กำลังโหลดรายละเอียด...</p>
            </div>
        );
    }

    const hasOverdue = unpaidInvoices.length > 0;

    return (
        <div className="verify-payments-wrapper">
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
                    <button className="back-home-button" onClick={() => onNavigate('viewPaymentStatus')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
                            </div>
                            <div className="profile-status-wrapper">
                                <span className="profile-status-label">สถานะ</span>
                                <span className={`profile-status-tag ${hasOverdue ? 'unpaid' : 'paid'}`}>
                                    {hasOverdue ? 'มียอดค้างชำระ' : 'ชำระแล้ว'}
                                </span>
                            </div>
                        </div>

                        {/* Form Body */}
                        {member ? (
                            <form className="cash-payment-form" onSubmit={handleOpenConfirmModal}>
                                {/* รายการบิลค้างชำระ (สะอาด เรียบร้อย ไม่มีสติกเกอร์/อิโมจิ) */}
                                <div className="unpaid-bill-section">
                                    <span className="unpaid-bill-section-title">
                                        รายการบิลค้างชำระ
                                    </span>

                                    <div className="unpaid-bill-container">
                                        {unpaidInvoices.length > 0 ? (
                                            <>
                                                <div className="unpaid-bill-header">
                                                    <label className="unpaid-select-all-label">
                                                        <input
                                                            type="checkbox"
                                                            className="custom-checkbox"
                                                            checked={selectedInvoiceIds.length > 0 && selectedInvoiceIds.length === unpaidInvoices.length}
                                                            onChange={handleSelectAll}
                                                        />
                                                        <span>
                                                            เลือกทั้งหมด {selectedInvoiceIds.length}/{unpaidInvoices.length} บิล
                                                        </span>
                                                    </label>
                                                </div>

                                                <div className="unpaid-bill-list">
                                                    {unpaidInvoices.map((inv) => {
                                                        const isChecked = selectedInvoiceIds.includes(inv.invoiceId);
                                                        const isYearly = inv.service?.serviceType === "ชำระรายปี";
                                                        const periodText = isYearly
                                                            ? `ประจำปี ${new Date(inv.dueDate).getFullYear() + 543}`
                                                            : utils.getInvoiceMonthYear(inv.dueDate);

                                                        return (
                                                            <div
                                                                key={inv.invoiceId}
                                                                className={`unpaid-bill-item ${isChecked ? 'active' : ''}`}
                                                                onClick={() => handleToggleInvoice(inv.invoiceId)}
                                                            >
                                                                <div className="unpaid-bill-info">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="custom-checkbox"
                                                                        checked={isChecked}
                                                                        onChange={() => { }}
                                                                    />
                                                                    <span className={`bill-type-tag ${isYearly ? 'yearly' : 'monthly'}`}>
                                                                        {isYearly ? 'รายปี' : 'รายเดือน'}
                                                                    </span>
                                                                    <span className="unpaid-bill-period">
                                                                        {periodText}
                                                                    </span>
                                                                </div>
                                                                <div className="unpaid-bill-amount">
                                                                    {Number(inv.totalAmount || 0).toFixed(2)} บาท
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="unpaid-bill-empty">
                                                ไม่มีรายการบิลค้างชำระ
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-fields-row">
                                    <div className="form-group-item">
                                        <label className="form-label-text">ยอดรวมที่ต้องชำระ (บาท)</label>
                                        <input
                                            type="text"
                                            className="cash-amount-input read-only-box"
                                            value={Number(amountPaid || 0).toFixed(2)}
                                            readOnly
                                        />
                                    </div>

                                    <div className="form-group-item">
                                        <label className="form-label-text">วันที่ชำระเงิน</label>
                                        <input
                                            type="text"
                                            className="cash-amount-input read-only-box"
                                            value={utils.formatShortThaiDate(utils.convertCEtoBE(paymentDate))}
                                            readOnly
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="confirm-cash-payment-btn"
                                    disabled={!hasOverdue || selectedInvoiceIds.length === 0}
                                >
                                    <div className="checkmark-circle-icon">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    <span>
                                        ยืนยันการรับชำระเงินสด
                                    </span>
                                </button>

                                {/* กล่องแจ้งเตือนใต้ปุ่ม */}
                                {message && (
                                    <div className={`payment-submit-message ${isSuccess ? 'success' : 'error'}`}>
                                        {message}
                                    </div>
                                )}
                            </form>
                        ) : (
                            <div className="payment-not-found-box">
                                ไม่พบข้อมูล
                            </div>
                        )}
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
                                        <th className="col-history-member">สมาชิก</th>
                                        <th className="col-history-amount">ยอดเงิน</th>
                                        <th className="col-history-month">เดือน</th>
                                        <th className="col-history-action">เอกสาร</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paidInvoice.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="history-empty-row">
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
                                                <td className="history-action-cell">
                                                    <button
                                                        className="view-receipt-btn"
                                                        onClick={() => window.open(`/api/invoices/${inv.invoiceId}/pdf`, '_blank')}
                                                    >
                                                        ดูใบเสร็จ
                                                    </button>
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

            {/* Modal ยืนยันการรับชำระเงินสด */}
            {showConfirmModal && (
                <div className="payment-modal-overlay">
                    <div className="payment-modal-box">
                        <div className="payment-modal-header">
                            <div className="payment-modal-icon-wrapper">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                            </div>
                            <h3 className="payment-modal-title">ยืนยันการรับชำระเงินสด</h3>
                            <p className="payment-modal-subtitle">กรุณาตรวจสอบยอดเงินสดที่ได้รับให้ถูกต้องก่อนกดยืนยัน</p>
                        </div>

                        <div className="payment-modal-body">
                            <div className="modal-summary-row">
                                <span className="summary-label">ชื่อสมาชิก:</span>
                                <span className="summary-value font-bold">{memberName}</span>
                            </div>
                            <div className="modal-summary-row">
                                <span className="summary-label">จำนวนบิลที่ชำระ:</span>
                                <span className="summary-value">{selectedInvoiceIds.length} รายการ</span>
                            </div>
                            <div className="modal-summary-row">
                                <span className="summary-label">วันที่รับชำระ:</span>
                                <span className="summary-value">{utils.formatShortThaiDate(utils.convertCEtoBE(paymentDate))}</span>
                            </div>
                            <div className="modal-summary-divider"></div>
                            <div className="modal-summary-row total-row">
                                <span className="summary-label">ยอดเงินสดที่ต้องรับ:</span>
                                <span className="summary-value total-amount">{Number(amountPaid || 0).toFixed(2)} บาท</span>
                            </div>
                        </div>

                        <div className="payment-modal-footer">
                            <button
                                type="button"
                                className="modal-cancel-btn"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="button"
                                className="modal-confirm-btn"
                                onClick={makeCustomerPayment}
                            >
                                ยืนยันรับชำระเงิน
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MakeCustomerPayment;
