import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../CSS/NotifyMember.css';
import utils from '../../../utils';

function NotifyPayment({ memberId }) {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!memberId) return;
        const fetchPaymentData = async () => {
            try {
                const invoiceResponse = await axios.get(`http://localhost:8081/api/invoices/member/${memberId}`);
                const unpaidInvoices = invoiceResponse.data.filter(inv => {
                    if (inv.status !== 'ค้างชำระ') return false;

                    // คำนวณหาจำนวนวันต่างระหว่าง วันปัจจุบัน กับ วันที่ครบกำหนด (DueDate)
                    const dueDate = new Date(inv.dueDate);
                    const today = new Date();
                    const timeDiff = dueDate - today;
                    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // แปลงเป็นจำนวนวัน
                    return daysLeft <= 3; // แสดงเฉพาะบิลที่เหลือไม่เกิน 3 วัน (หรือเลยกำหนดชำระ/ติดลบ)
                });
                
                // จัดเรียงข้อมูลใหม่จากน้อยไปหามาก
                const sortedInvoices = unpaidInvoices.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                setInvoices(sortedInvoices);

                localStorage.setItem('seenInvoicesCount', sortedInvoices.length.toString());
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูลใบแจ้งหนี้:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPaymentData();
    }, [memberId]);

    if (loading) return null;

    return (
        <>
            {invoices.map((inv) => (
                <div key={inv.invoiceId} className="invoice-notification-card">
                    <p className="invoice-notify-header-subtitle">แจ้งเตือนล่วงหน้า 3 วันก่อนถึงกำหนดชำระ</p>
                    
                    <hr className="invoice-notify-divider" />
                    
                    <div className="invoice-notify-grid">
                        <div>
                            <div className="invoice-notify-label">ยอดเงินที่ต้องชำระ</div>
                            <div className="invoice-notify-amount-val">{inv.totalAmount.toFixed(2)}</div>
                        </div>
                        <div>
                            <div className="invoice-notify-label">วันที่ต้องชำระเงิน</div>
                            <div className="invoice-notify-date-val">{utils.formatThaiDate(utils.convertCEtoBE(inv.dueDate))}</div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default NotifyPayment;
