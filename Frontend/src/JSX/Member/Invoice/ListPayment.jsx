import React, { useState } from 'react';
import utils from '../../../utils';

function ListPayment({ invoices = [], services = [], onSelectPay }) {

    // เก็บ ID บริการที่เลือก (ถ้ายังไม่เลือก ให้เอาบริการแรก services[0] เสมอ)
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const currentServiceId = selectedServiceId || services[0]?.serviceId;
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

    // กรองบิลตามบริการ  ม.ค.  ธ.ค.
    const filteredInvoices = invoices
        .filter(inv => {
            //  กรองตามบริการ
            const matchService = inv.service?.serviceId === Number(currentServiceId);
            //  กรองตามปี
            const matchYear = (inv.invoiceDate || inv.dueDate)?.startsWith(selectedYear);

            return matchService && matchYear;
        })
        .sort((a, b) => new Date(a.invoiceDate || a.dueDate) - new Date(b.invoiceDate || b.dueDate));


    // ดึงเฉพาะปีที่มีอยู่จริงใน DB (invoices) แบบไม่ซ้ำ และเรียงจากปีล่าสุดลงไป
    //คัดค่าซ้ำออก
    const availableYears = [...new Set(
        invoices
            .map(inv => inv.invoiceDate ? new Date(inv.invoiceDate).getFullYear() : null)
            .filter(Boolean)
    )].sort((a, b) => b - a);

    return (
        <div className="payment-history-section">
            <div className="payment-history-header">
                <div className="payment-header-left">
                    <h3 className="payment-history-title">
                        <svg className="history-title-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                        รายการบิลและการชำระเงิน
                    </h3>
                </div>

                {/* ดรอปดาวน์แยกประเภทบริการ / สถานที่ */}
                <div className="payment-header-right">
                    <select
                        className="invoice-filter-select"
                        value={currentServiceId}
                        onChange={(e) => setSelectedServiceId(e.target.value)}
                    >
                        {services.map(srv => (
                            <option key={srv.serviceId} value={srv.serviceId}>
                                {srv.buildingType} {srv.houseNumber ? `บ้านเลขที่ ${srv.houseNumber}` : ''}
                            </option>
                        ))}
                    </select>

                    <select
                        className="invoice-filter-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        {availableYears.map((year) => (
                            <option key={year} value={year}>
                                ปี {year + 543}
                            </option>
                        ))}
                    </select>

                </div>
            </div>

            <div className="payment-history-table-wrapper">
                <table className="payment-history-table">
                    <thead>
                        <tr>
                            <th>รายการ</th>
                            <th>ประเภทอาคาร</th>
                            <th>ยอดเงิน</th>
                            <th>สถานะ</th>
                            <th style={{ textAlign: 'center' }}>การชำระ / เอกสาร</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices && filteredInvoices.length > 0 ? (
                            filteredInvoices.map((inv) => {
                                const isUnpaid = inv.status === 'ค้างชำระ';
                                const building = inv.service?.buildingType || 'ทั่วไป';
                                const houseNo = inv.service?.houseNumber ? ` เลขที่ ${inv.service.houseNumber}` : '';

                                return (
                                    <tr key={inv.invoiceId} className={isUnpaid ? 'row-unpaid-highlight' : ''}>
                                        <td>
                                            ค่าธรรมเนียมเก็บขยะ - รอบเดือน {utils.getInvoiceMonthYear(inv.invoiceDate || inv.dueDate)}
                                        </td>
                                        <td>
                                            <span className="building-type-badge">
                                                {building}{houseNo}
                                            </span>
                                        </td>
                                        <td className="col-invoice-code">
                                            {Number(inv.totalAmount || 0).toFixed(2)}
                                        </td>
                                        <td>
                                            {isUnpaid ? (
                                                <span className="status-badge pending">
                                                    <span className="status-dot"></span>
                                                    รอการชำระ
                                                </span>
                                            ) : (
                                                <span className="status-badge paid">
                                                    ชำระแล้ว
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {isUnpaid ? (
                                                <button
                                                    className="pay-now-btn"
                                                    onClick={() => onSelectPay(inv)}
                                                >
                                                    ชำระเงิน
                                                </button>
                                            ) : (
                                                <button
                                                    className="view-receipt-btn"
                                                    onClick={() => window.open(`/api/invoices/${inv.invoiceId}/pdf`, '_blank')}
                                                >
                                                    ดูใบเสร็จ
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="history-table-empty">
                                    ไม่พบรายการบิลหรือการชำระเงิน
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ListPayment;
