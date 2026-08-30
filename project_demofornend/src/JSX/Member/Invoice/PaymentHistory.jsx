import React from 'react';
import utils from '../../../utils';

function PaymentHistory({ invoices }) {
    return (
        <div className="payment-history-section">
            <div className="payment-history-header">
                <h3 className="payment-history-title">
                    <svg className="history-title-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    ประวัติการชำระเงิน
                </h3>
                <a href="#all" className="view-all-link" onClick={(e) => e.preventDefault()}>ดูทั้งหมด</a>
            </div>
            <div className="payment-history-table-wrapper">
                <table className="payment-history-table">
                    <thead>
                        <tr>
                            <th>วันที่</th>
                            <th>รายการ</th>
                            <th>ยอดเงิน</th>
                            <th>สถานะ</th>
                            <th>เอกสาร</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((payment) => (
                            <tr key={payment.paymentId}>
                                <td>
                                    {utils.formatShortThaiDate(
                                        utils.convertCEtoBE(payment.paymentDate)
                                    )}
                                </td>
                                <td>ค่าธรรมเนียมเก็บขยะ - {utils.getInvoiceMonthYear(payment.invoice?.invoiceDate)}</td>
                                <td style={{ fontWeight: '600', color: '#0f172a' }}>
                                    ฿{payment.amountPaid.toFixed(2)}
                                </td>
                                <td>
                                    <span className="status-badge paid">ชำระแล้ว</span>
                                </td>
                                <td>
                                    <button 
                                        className="view-receipt-btn"
                                        onClick={() => window.open(`http://localhost:8081/api/invoices/${payment.invoice?.invoiceId}/pdf`, '_blank')}
                                    >
                                        ดูใบเสร็จ
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PaymentHistory;
