import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Invoice({ onNavigate }) {
    const [member, setMember] = useState(null);
    const [invoices, setInvoices] = useState([]);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [base64Image, setBase64Image] = useState('');
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

                    const invoiceResponse = await axios.get(`http://localhost:8081/api/invoices/member/${foundMember.memberId}`);
                    const unpaidInvoices = invoiceResponse.data.filter(inv => inv.status === 'ค้างชำระ');

                    const sortedInvoices = unpaidInvoices.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
                    setInvoices(sortedInvoices);

                }
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสมาชิก:", error);
            }
        }
        fetchMemberData();
    }, [onNavigate])


    // ฟังก์ชันรับไฟล์และแปลงเป็น Base64
    const handleUpload = (e, currentInvoiceId, expectedAmount) => {

        const file = e.target.files[0];
        // ตรวจสอบไฟล์ว่ามีไฟล์หรือไม่
        if (!file) return;
        // สร้างเครื่องมืออ่านไฟล์ของเบราว์เซอร์ (FileReader)
        const reader = new FileReader();
        // สั่งให้ตัวอ่านไฟล์ไปอ่านข้อมูลในรูปแบบ Data URL (Base64)
        reader.readAsDataURL(file);
        // เมื่ออ่านไฟล์เสร็จสิ้น ให้ทำงานต่อ
        reader.onloadend = async () => {
            // 👈 ดึงค่า Base64 สด ๆ ออกมาเก็บไว้ในตัวแปรนี้
            const base64Result = reader.result;
            // 👈 ใช้ตัวแปรที่เพิ่งดึงค่ามาใหม่ (base64Result) แทน base64Image ที่อาจจะยังไม่อัปเดตค่า
            setBase64Image(base64Result);

            const data = {
                "img": base64Result,
                "tos": true,
                "privacy": true,
                "eula": true
            }
            try {
                // send slip to api
                const response = await axios.post('https://slip-c.oiio.download/api/slip', data);
                const dataPayment = response.data;


                const slipAmount = Number(dataPayment?.data?.amount);
                if (slipAmount < expectedAmount) {
                    setMessage(`ยอดเงินในสลิป (${slipAmount} บาท) ไม่ครบตามยอดบิล (${expectedAmount} บาท)`);
                    setIsSuccess(false);
                    return;
                }

                const slipAccount = String(dataPayment?.data?.sender_id).replace(/-/g, '');
                if (!slipAccount.includes('4978')) {
                    setMessage("สลิปนี้ไม่ได้โอนเข้าเลขบัญชีธนาคารของเทศบาล");
                    setIsSuccess(false);
                    return;
                }

                const rawDate = dataPayment?.data?.date;
                const paymentDate = rawDate ? String(rawDate).split('T')[0] : new Date().toISOString().split('T')[0];


                const Payment = {
                    paymentDate: paymentDate,
                    amountPaid: slipAmount,
                    paymentMethod: 'โอนชำระ',
                    slipImage: base64Result,
                    invoice: {
                        invoiceId: currentInvoiceId
                    }
                }

                const responstPayment = await axios.post('http://localhost:8081/api/payments', Payment);
                setMessage(responstPayment.data);
                setIsSuccess(true);

                setInvoices(prevInvoices => prevInvoices.filter(inv => inv.invoiceId !== currentInvoiceId));

            } catch (error) {
                console.error(error);

                setMessage('เกิดข้อผิดพลาด! สลิปไม่ถูกต้องหรือการเชื่อมต่อล้มเหลว');
                setIsSuccess(false);
            }
        };
    };


    return (
        <div>
            <h1>Invoice</h1>
            <button onClick={() => onNavigate('homemember')}>Back</button>
            {/* ปุ่มเลือกไฟล์รูปภาพ */}

            {invoices.map((inv) => (
                <div key={inv.invoiceId}>
                    <p>Due Date: {inv.dueDate}</p>


                    <p>Amount: {inv.totalAmount}</p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUpload(e, inv.invoiceId, inv.totalAmount)}
                    />

                    <div>
                        <h2>ช่องทางการชำระเงิน</h2>
                        <label>ธนาคารกรุงไทย</label><br />
                        <label>1234564978</label><br />
                        <label>ชื่อบัญชี : เทศบาล</label><br />
                    </div>
                </div>
            ))}
            {message && (
                <div style={{
                    marginTop: '15px',
                    padding: '10px 15px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    color: isSuccess ? '#15803d' : '#b91c1c',
                    backgroundColor: isSuccess ? '#f0fdf4' : '#fef2f2',
                    border: `1px solid ${isSuccess ? '#bbf7d0' : '#fecaca'}`
                }}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default Invoice;