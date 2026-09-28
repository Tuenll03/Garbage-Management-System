import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../CSS/NoticeInvoice.css';
import utils from '../../../utils';

function NoticeInvoice({ memberId }) {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    useEffect(() => {
        if (!memberId) return;
        const noticeInvoice = async () => {
            try {
                const invoiceResponse = await axios.get(`/api/invoices/member/${memberId}`);
                //ใช้ utils.filterInvoice
                const invoices = utils.filterInvoice(invoiceResponse.data);

                // จัดเรียงข้อมูลใหม่จากน้อยไปหามาก
                const sortedInvoices = invoices.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                setInvoices(sortedInvoices);

                localStorage.setItem('seenInvoicesCount', sortedInvoices.length.toString());
            } catch (error) {
                setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
            } finally {
                setLoading(false);
            }
        };
        noticeInvoice();
    }, [memberId]);

    if (loading) return null;

    return (
        <>
            {invoices.map((inv) => (
                <div key={inv.invoiceId} className="invoice-notification-card">
                    <p className="invoice-notify-header-subtitle">{inv.daysLeft <= 0 ? 'เกินกำหนดชำระเงินแล้ว'
                        : `ใกล้ถึงกำหนดชำระ (เหลืออีก ${inv.daysLeft} วัน)`}</p>

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

export default NoticeInvoice;
