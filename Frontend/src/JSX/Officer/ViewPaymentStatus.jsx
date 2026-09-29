import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../CSS/ViewPaymentStatus.css";

function ViewPaymentStatus({ onNavigate }) {
    const [officer, setOfficer] = useState(null);
    const [loading, setLoading] = useState(true);

    // Stats state
    const [totalHousehold, setTotalHousehold] = useState(0);
    const [paymentsSuccess, setPaymentsSuccess] = useState(0);
    const [pendingPayments, setPendingPayments] = useState(0);

    const [services, setServices] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [message, setMessage] = useState(null);

    // Filter states
    const [selectedVillageNo, setSelectedVillageNo] = useState("ทั้งหมด");
    const [selectedServiceType, setSelectedServiceType] = useState("ทั้งหมด");
    const [selectedMonth, setSelectedMonth] = useState("ทั้งหมด");
    const [selectedStatus, setSelectedStatus] = useState("ทั้งหมด");

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
                setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
            } finally {
                setLoading(false);
            }
        };

        fetchOfficer();
    }, [onNavigate]);

    useEffect(() => {
        const countPayment = async () => {
            try {
                const servicesRes = await axios.get('/api/services');
                const houseHold = servicesRes.data.filter(s => s.status === 'อนุมัติ');
                setTotalHousehold(houseHold.length);

                const invoicesRes = await axios.get('/api/invoices');
                const today = new Date();
                const currentYear = today.getFullYear();
                const currentMonth = today.getMonth();

                // หาจำนวนการชำระเงินในเดือนปัจจุบัน
                const paid = invoicesRes.data.filter((inv) => {
                    if (inv.status !== 'ชำระเงินแล้ว' && inv.status !== 'ชำระแล้ว') return false;
                    if (!inv.invoiceDate) return false;
                    const invDate = new Date(inv.invoiceDate);
                    return invDate.getFullYear() === currentYear && invDate.getMonth() === currentMonth;
                });
                setPaymentsSuccess(paid.length);

                // หาจำนวนการชำระเงินที่ค้างชำระ
                const unpaid = invoicesRes.data.filter(inv => inv.status === 'ค้างชำระ');
                setPendingPayments(unpaid.length);

                // เก็บข้อมูลทั้งหมด
                setInvoices(invoicesRes.data);
                setServices(servicesRes.data);
            } catch (error) {
                setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
                setTotalHousehold(null);
                setPaymentsSuccess(null);
                setPendingPayments(null);
            }
        };
        countPayment();
    }, []);

    const changeVillageNo = (e) => {
        setSelectedVillageNo(e.target.value);
    };

    const changeServiceType = (e) => {
        setSelectedServiceType(e.target.value);
    };

    const changeStatus = (e) => {
        setSelectedStatus(e.target.value);
    };

    //ใช้ทำตัวกรองข้อมูล
    const viewPaymentStatus = invoices.filter(inv => {
        // 1. Village filter
        const matchesVillage = selectedVillageNo === "ทั้งหมด" || inv.service?.villageNo === selectedVillageNo;

        // 2. Service type filter
        const matchesServiceType = selectedServiceType === "ทั้งหมด" ||
            inv.service?.serviceType === selectedServiceType ||
            (selectedServiceType === "ชำระรายเดือน" && inv.service?.serviceType === "เก็บขยะทั่วไป");

        // 3. Month filter
        const matchesMonth = selectedMonth === "ทั้งหมด" ||
            (inv.invoiceDate && (new Date(inv.invoiceDate).getMonth() + 1) === parseInt(selectedMonth, 10));

        // 4. Payment status filter
        const matchesStatus = selectedStatus === "ทั้งหมด" ||
            inv.status === selectedStatus ||
            (selectedStatus === "ชำระแล้ว" && inv.status === "ชำระเงินแล้ว");

        return matchesVillage && matchesServiceType && matchesMonth && matchesStatus;
    });


    //คำนวนวันค้างชำระ 
    const getOverdueDays = (inv) => {
        if (inv.status !== "ค้างชำระ" || !inv.dueDate) return "-";

        const dueDate = new Date(inv.dueDate);
        const today = new Date();

        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);

        const diffTime = today - dueDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        return diffDays > 0 ? `${diffDays} วัน` : "ยังไม่เลยกำหนด";
    };


    const makeCustomerPayment = (invoiceId) => {
        sessionStorage.setItem('selectedServiceId', invoiceId);
        onNavigate('makeCustomerPayment');
    };

    const officerName = officer ? `${officer.prefix || ''}${officer.firstName} ${officer.lastName}` : "ไม่ระบุชื่อ";

    if (loading) {
        return (
            <div className="homemember-loading">
                <div className="spinner"></div>
                <p>กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

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
                    <button className="back-home-button" onClick={() => onNavigate('homeOfficer')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        หน้าหลัก
                    </button>
                    <div className="user-badge user-badge-default">
                        <div className="user-avatar-dot"></div>
                        <span>{officerName} ({officer?.position || 'เจ้าหน้าที่'})</span>
                    </div>
                </div>
            </nav>

            <div className="verify-payments-container">
                {/* Stats Cards Section */}
                <div className="stats-cards-grid">
                    <div className="stat-card-item">
                        <span className="stat-card-label">ครัวเรือนทั้งหมด</span>
                        <span className="stat-card-number">{totalHousehold !== null && totalHousehold !== undefined ? totalHousehold.toLocaleString() : "-"}</span>
                    </div>
                    <div className="stat-card-item">
                        <span className="stat-card-label">ชำระแล้ว (เดือนนี้)</span>
                        <span className="stat-card-number success-text">{paymentsSuccess !== null && paymentsSuccess !== undefined ? paymentsSuccess.toLocaleString() : "-"}</span>
                    </div>
                    <div className="stat-card-item">
                        <span className="stat-card-label">ค้างชำระทั้งหมด</span>
                        <span className="stat-card-number danger-text">{pendingPayments !== null && pendingPayments !== undefined ? pendingPayments.toLocaleString() : "-"}</span>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="filters-card-container">
                    <div className="dropdown-filters-wrapper">
                        <select className="filter-select-input" value={selectedVillageNo} onChange={changeVillageNo}>
                            <option value="ทั้งหมด">หมู่บ้าน (ทั้งหมด)</option>
                            <option value="1">หมู่ 1</option>
                            <option value="2">หมู่ 2</option>
                            <option value="3">หมู่ 3</option>
                            <option value="8">หมู่ 8</option>
                        </select>

                        <select className="filter-select-input" value={selectedServiceType} onChange={changeServiceType}>
                            <option value="ทั้งหมด">ประเภทบริการ (ทั้งหมด)</option>
                            <option value="ชำระรายเดือน">เดือน</option>
                            <option value="ชำระรายปี">ปี</option>
                        </select>

                        <select className="filter-select-input" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                            <option value="ทั้งหมด">เดือน (ทั้งหมด)</option>
                            <option value="1">มกราคม</option>
                            <option value="2">กุมภาพันธ์</option>
                            <option value="3">มีนาคม</option>
                            <option value="4">เมษายน</option>
                            <option value="5">พฤษภาคม</option>
                            <option value="6">มิถุนายน</option>
                            <option value="7">กรกฎาคม</option>
                            <option value="8">สิงหาคม</option>
                            <option value="9">กันยายน</option>
                            <option value="10">ตุลาคม</option>
                            <option value="11">พฤศจิกายน</option>
                            <option value="12">ธันวาคม</option>
                        </select>

                        <select className="filter-select-input" value={selectedStatus} onChange={changeStatus}>
                            <option value="ทั้งหมด">สถานะการชำระ (ทั้งหมด)</option>
                            <option value="ชำระแล้ว">ชำระแล้ว</option>
                            <option value="ค้างชำระ">ค้างชำระ</option>
                        </select>
                    </div>
                </div>

                {/* Table Section */}
                <div className="table-card-wrapper">
                    <table className="payments-custom-table">
                        <thead>
                            <tr>
                                <th className="col-name-16">ชื่อ</th>
                                <th className="col-name-16">นามสกุล</th>
                                <th className="col-village-12">หมู่บ้าน</th>
                                <th className="col-overdue-16">จำนวนวันที่ค้างชำระ</th>
                                <th className="col-status-16">สถานะการชำระ</th>
                                <th className="col-action-12">ชำระเงิน</th>
                            </tr>
                        </thead>
                        <tbody>
                            {viewPaymentStatus.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="empty-table-row">
                                        ไม่พบข้อมูล
                                    </td>
                                </tr>
                            ) : (
                                viewPaymentStatus.map((inv) => {
                                    const isPaid = inv.status === 'ชำระเงินแล้ว' || inv.status === 'ชำระแล้ว';
                                    const badgeClass = isPaid ? 'paid' : 'unpaid';
                                    const formattedId = `SV-${String(inv.service?.serviceId || inv.invoiceId).padStart(4, '0')}`;

                                    const overdueText = getOverdueDays(inv);
                                    const isOverdue = overdueText !== '-' && overdueText !== 'ยังไม่เลยกำหนด';

                                    return (
                                        <tr key={inv.invoiceId}>
                                            <td className="name-bold-cell">{inv.service?.member?.firstName || '-'}</td>
                                            <td className="name-bold-cell">{inv.service?.member?.lastName || '-'}</td>
                                            <td>{inv.service?.villageNo ? `หมู่ ${inv.service.villageNo}` : '-'}</td>
                                            <td className={`overdue-days-cell ${isOverdue ? 'danger' : ''}`}>
                                                {overdueText}
                                            </td>
                                            <td>
                                                <span className={`payment-status-badge ${badgeClass}`}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn-action-manage"
                                                    onClick={() => makeCustomerPayment(inv.invoiceId)}
                                                >
                                                    ชำระเงิน
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ViewPaymentStatus;