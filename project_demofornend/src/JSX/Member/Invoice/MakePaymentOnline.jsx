import React, { useState, useEffect } from 'react';
import axios from 'axios';
import utils from '../../../utils';

function MakePaymentOnline({ memberId, onPaymentSuccess }) {
    const [invoices, setInvoices] = useState([]);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [base64Image, setBase64Image] = useState('');
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [uploadingInvoiceId, setUploadingInvoiceId] = useState(null);

    useEffect(() => {

        const viewInvoice = async () => {
            if (!memberId) return;
            try {
                const invoiceResponse = await axios.get(`/api/invoices/member/${memberId}`);
                const unpaidInvoices = invoiceResponse.data.filter(inv => inv.status === 'ค้างชำระ');
                setInvoices(unpaidInvoices);
            } catch (error) {
                setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
                setIsSuccess(false);
            } finally {
                setLoading(false);
            }
        };
        viewInvoice();
    }, [memberId]);



    //MakePaymentOnline
    //UploadImageSlip
    const verifyPayment = (e, currentInvoiceId) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingInvoiceId(currentInvoiceId);
        setMessage('กำลังอ่านไฟล์ภาพและตรวจสอบสลิป...');
        setIsSuccess(true);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64Result = reader.result;
            setBase64Image(base64Result);


            try {
                const Payment = {
                    slipImage: base64Result,

                    invoice: {
                        invoiceId: currentInvoiceId
                    }
                }

                const responstPayment = await axios.post('/api/payments', Payment);

                if (responstPayment.data === "successfully") {
                    setMessage('ชำระเงินสำเร็จ');
                    setIsSuccess(true);
                    setInvoices(prevInvoices => prevInvoices.filter(inv => inv.invoiceId !== currentInvoiceId));
                    if (onPaymentSuccess) {
                        onPaymentSuccess();
                    }
                } else {
                    if (responstPayment.data === "Slip image already exists" ||
                        responstPayment.data === "Amount is not match" ||
                        responstPayment.data === "Receiver ID is not match") {
                        setMessage('สลิปนี้เคยส่งเข้ามาแล้ว  สลิปไม่ถูกต้อง');
                        setIsSuccess(false);

                    } else {
                        setMessage('การบันทึกล้มเหลว');
                        setIsSuccess(false);
                    }
                }

            } catch (error) {
                setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
                setIsSuccess(false);
            } finally {
                setUploadingInvoiceId(null);
            }
        };
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="invoice-loading">
                <div className="spinner"></div>
                <p>กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    return (
        <>
            <div className="invoice-cards-list">
                {invoices.map((inv) => (
                    <div className="invoice-premium-card" key={inv.invoiceId}>
                        {/* Top Section */}
                        <div className="invoice-header-section">
                            {/* Left Side: Details */}
                            <div className="invoice-details-left">
                                <div className="invoice-badge-title">
                                    <svg className="invoice-title-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="16" y1="13" x2="8" y2="13" />
                                        <line x1="16" y1="17" x2="8" y2="17" />
                                        <polyline points="10 9 9 9 8 9" />
                                    </svg>
                                    <span>ใบแจ้งหนี้ปัจจุบัน</span>
                                </div>
                                <h2 className="invoice-month-title">
                                    รอบเดือน {utils.getInvoiceMonthYear(inv.invoiceDate || inv.dueDate)}
                                </h2>
                                <div className="invoice-due-date-wrapper">
                                    <span className="due-label">กำหนดชำระ</span>
                                    <span className="due-value">
                                        {utils.formatShortThaiDate(utils.convertCEtoBE(inv.dueDate))}
                                    </span>
                                </div>
                            </div>

                            {/* Right Side: Payment summary box */}
                            <div className="invoice-summary-box">
                                <div className="amount-pay-label">ยอดเงินที่ต้องชำระ</div>
                                <div className="amount-pay-value">
                                    <span className="currency-symbol">฿</span> {inv.totalAmount.toFixed(2)}
                                </div>

                                <div className="payment-status-badge pending">
                                    <span className="status-dot"></span>
                                    <span>รอการชำระเงิน</span>
                                </div>
                                <label className={`upload-slip-btn ${uploadingInvoiceId === inv.invoiceId ? 'disabled' : ''}`}>
                                    {uploadingInvoiceId === inv.invoiceId ? (
                                        <>
                                            <div className="btn-spinner"></div>
                                            <span>กำลังตรวจสอบสลิป...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="17 8 12 3 7 8" />
                                                <line x1="12" y1="3" x2="12" y2="15" />
                                            </svg>
                                            <span>แนบสลิป</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => verifyPayment(e, inv.invoiceId)}
                                        className="hidden-file-input"
                                        disabled={uploadingInvoiceId !== null}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Bottom Section: Payment Channels */}
            <div className="payment-channels-container-card">
                <h3 className="payment-channels-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h14v4" />
                        <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                        <path d="M18 12a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4v-6h-4z" />
                    </svg>
                    ช่องทางการโอนเงิน
                </h3>

                <div className="channel-cards-container">
                    {/* Bank Info Card */}
                    <div className="channel-info-card">
                        <div className="channel-icon-bg bank">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 22h18" />
                                <path d="M6 18V9" />
                                <path d="M10 18V9" />
                                <path d="M14 18V9" />
                                <path d="M18 18V9" />
                                <path d="M12 2L2 7v2h20V7L12 2z" />
                            </svg>
                        </div>
                        <div className="channel-text">
                            <span className="channel-label">ธนาคาร</span>
                            <span className="channel-value">ธนาคารกรุงไทย</span>
                        </div>
                    </div>

                    {/* Account Name Card */}
                    <div className="channel-info-card">
                        <div className="channel-icon-bg name">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <div className="channel-text">
                            <span className="channel-label">ชื่อบัญชี</span>
                            <span className="channel-value">กองคลังเทศบาล</span>
                        </div>
                    </div>
                </div>

                {/* Account Number Row */}
                <div className="account-number-card">
                    <div className="account-number-left">
                        <div className="channel-icon-bg number">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="5" width="20" height="14" rx="2" />
                                <line x1="2" y1="10" x2="22" y2="10" />
                            </svg>
                        </div>
                        <div className="account-text-wrapper">
                            <span className="account-label">เลขที่บัญชี</span>
                            <span className="account-value">123-0-45678-9</span>
                        </div>
                    </div>
                    <button className="copy-account-btn" onClick={() => handleCopy('1230456789')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอก'}</span>
                    </button>
                </div>
            </div>

            {/* API Status Messages */}
            {message && (
                <div className={`invoice-toast-message ${isSuccess ? 'success' : 'error'}`}>
                    <div className="toast-icon">
                        {isSuccess ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        )}
                    </div>
                    <div className="toast-text">{message}</div>
                </div>
            )}
        </>
    );
}

export default MakePaymentOnline;
