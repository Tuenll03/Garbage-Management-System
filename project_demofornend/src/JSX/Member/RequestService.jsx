import React, { useState, useEffect } from 'react';
import axios from 'axios';
import utils from '../../utils';
import validate from '../../validate';
import '../../CSS/RequestService.css';
import BuildingTypeSection from './RequestService/BuildingTypeSection';
import ServiceAddressSection from './RequestService/ServiceAddressSection';
import FeeTypeSection from './RequestService/FeeTypeSection';
import CapacitySection from './RequestService/CapacitySection';

function RequestService({ onNavigate }) {
    const [buildingType, setBuildingType] = useState('บ้านพักอาศัย');
    const [serviceType, setServiceType] = useState('ชำระรายเดือน');
    const [garbageWeight, setGarbageWeight] = useState(20);
    const [price, setPrice] = useState(30);
    const [status, setStatus] = useState('รอดำเนินการ');
    const [houseNumber, setHouseNumber] = useState('');
    const [villageNo, setVillageNo] = useState('');
    const [villageName, setVillageName] = useState('');
    const [detail, setDetail] = useState('');
    const [member, setMember] = useState(null);

    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchCurrentMember = async () => {
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
                } else {
                    setMessage('ไม่พบข้อมูลสมาชิกในระบบ');
                    setIsError(true);
                }
            } catch (err) {
                console.error(err);
                setMessage('เกิดข้อผิดพลาดในการโหลดข้อมูลสมาชิก');
                setIsError(true);
            }
        };
        fetchCurrentMember();
    }, [onNavigate]);

    const handleHouseNumber = (e) => {
        const format = utils.formatRegisteredHouseNumber(e.target.value);
        setHouseNumber(format);
    };

    const handleVillageNo = (e) => {
        const format = utils.formatRegisteredVillageNo(e.target.value);
        setVillageNo(format);
    };

    const handleVillageName = (e) => {
        const format = utils.formatVillageName(e.target.value);
        setVillageName(format);
    };

    const handleDetail = (e) => {
        const format = utils.formatDetail(e.target.value);
        setDetail(format);
    };

    const handleCapacitySelect = (weightVal, priceVal) => {
        setGarbageWeight(weightVal);
        setPrice(priceVal);
    };

    const today = new Date();
    const currentDate = utils.cleanDate(today);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errorMsg = validate.validateRequestService(
            houseNumber,
            villageNo,
            villageName,
            detail
        );

        if (errorMsg) {
            setMessage(errorMsg);
            setIsError(true);
            return;
        }

        const data = {
            buildingType: buildingType,
            serviceType: serviceType,
            garbageWeight: parseInt(garbageWeight, 10),
            houseNumber: houseNumber,
            villageNo: villageNo,
            villageName: villageName,
            detail: detail,
            requestDate: currentDate,
            status: status,
            price: parseInt(price, 10),
            member: {
                memberId: member?.memberId
            }
        };

        try {
            const response = await axios.post('http://localhost:8081/api/services', data);
            if (response.data === 'success') {
                setMessage('รอฟังผลการดำเนินงานจากเจ้าหน้าที่');
                setIsError(false);
                setTimeout(() => {
                    onNavigate('homemember');
                }, 2000);
            } else {
                setMessage('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
                setIsError(true);
            }
        } catch (err) {
            console.error(err);
            setMessage('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
            setIsError(true);
        }
    };

    return (
        <div className="homemember-wrapper">
            {/* Navigation Bar */}
            <nav className="homemember-navbar">
                <div className="navbar-brand" onClick={() => onNavigate('homemember')} style={{ cursor: 'pointer' }}>
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
                    <button className="back-home-button" type="button" onClick={() => onNavigate('homemember')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        หน้าหลัก
                    </button>
                    <div className="user-badge">
                        <div className="user-avatar-dot"></div>
                        <span>{member?.prefix}{member?.firstName} {member?.lastName}</span>
                    </div>
                </div>
            </nav>

            <div className="request-service-wrapper">
                <div className="request-service-card">
                    <h2 className="request-service-title">ยื่นคำร้องขอรับบริการจัดการขยะ</h2>

                    <form onSubmit={handleSubmit} className="request-service-form">

                        {/* Section 1: ประเภทอาคาร / สถานที่ */}
                        <BuildingTypeSection
                            buildingType={buildingType}
                            onChangeBuildingType={setBuildingType}
                        />

                        {/* Section 2: ที่อยู่สำหรับรับบริการ */}
                        <ServiceAddressSection
                            houseNumber={houseNumber}
                            onHouseNumberChange={handleHouseNumber}
                            villageNo={villageNo}
                            onVillageNoChange={handleVillageNo}
                            villageName={villageName}
                            onVillageNameChange={handleVillageName}
                            detail={detail}
                            onDetailChange={handleDetail}
                        />

                        {/* Section 3: รูปแบบการเก็บค่าธรรมเนียม */}
                        <FeeTypeSection
                            serviceType={serviceType}
                            onChangeServiceType={setServiceType}
                        />

                        {/* Section 4: ปริมาณขยะโดยประมาณ (ต่อสัปดาห์) */}
                        <CapacitySection
                            garbageWeight={garbageWeight}
                            onCapacitySelect={handleCapacitySelect}
                        />

                        {/* ส่วนสรุปอัตราค่าบริการ */}
                        <div className="price-summary-container">
                            <div className="price-summary-card">
                                <div className="price-details">
                                    <span className="price-period">
                                        ค่าบริการ {serviceType === 'ชำระรายเดือน' ? 'ชำระรายเดือน' : 'ชำระรายปี'}
                                    </span>
                                    <span className="price-formula">
                                        คำนวณตามอัตรา {buildingType} (ปริมาณขยะประมาณ {garbageWeight} กก./สัปดาห์)
                                    </span>
                                </div>
                                <div className="price-amount-box">
                                    <span className="price-currency">฿</span>
                                    <span className="price-value">
                                        {serviceType === 'ชำระรายเดือน' ? price : price * 12}
                                    </span>
                                    <span className="price-unit">
                                        {serviceType === 'ชำระรายเดือน' ? ' / เดือน' : ' / ปี'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Info and Buttons */}
                        <div className="request-service-footer">
                            <div className="info-message">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="info-icon">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="16" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                                <span>เจ้าหน้าที่จะติดต่อกลับภายใน 1-3 วันทำการเพื่อยืนยันข้อมูลและเข้าตรวจสอบพื้นที่รับผิดชอบ</span>
                            </div>
                            <div className="action-buttons">
                                <button
                                    type="button"
                                    className="request-service-cancel-btn"
                                    onClick={() => onNavigate('homemember')}
                                >
                                    ยกเลิก
                                </button>
                                <button type="submit" className="request-service-submit-btn">
                                    ยืนยันการยื่นคำขอ
                                </button>
                            </div>
                        </div>

                    </form>

                    {/* Message Alert Banner */}
                    {message && (
                        <div className={`request-service-alert ${isError ? 'error' : 'success'}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RequestService;