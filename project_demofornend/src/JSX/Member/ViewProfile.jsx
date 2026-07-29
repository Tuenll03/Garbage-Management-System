import React, { useState, useEffect } from 'react';
import axios from 'axios';
import utils from '../../utils';
import validate from '../../validate';
import '../../CSS/ViewProfile.css';
import PersonalCard from './ViewProfile/PersonalCard';
import AddressCard from './ViewProfile/AddressCard';
import ServiceCard from './ViewProfile/ServiceCard';

function ViewProfile({ onNavigate }) {
    const [member, setMember] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // แยก State การแก้ไขออกเป็น 3 การ์ดอย่างเป็นอิสระต่อกัน
    const [isEditingCard1, setIsEditingCard1] = useState(false);
    const [isEditingCard2, setIsEditingCard2] = useState(false);
    const [isEditingCard3, setIsEditingCard3] = useState(false);

    const [formData, setFormData] = useState({})
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchMember = async () => {
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

                    const response = await axios.get(`http://localhost:8081/api/services/member/${foundMember.memberId}`);
                    const sortedServices = response.data
                    setServices(sortedServices);
                } else {
                    onNavigate('login');
                }
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสมาชิก:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMember();
    }, [onNavigate]);

    // แก้ไขการ์ด 1: ข้อมูลส่วนตัว
    const handleEditCard1 = () => {
        if (member) {
            setFormData({
                ...formData,
                prefix: member.prefix || '',
                firstName: member.firstName || '',
                lastName: member.lastName || '',
                birth: utils.convertCEtoBE(member.birth) || '',
                phone: member.phone || '',
            });
            setIsEditingCard1(true);
        }
    };

    // แก้ไขการ์ด 2: ที่อยู่ตามทะเบียนประชาชน
    const handleEditCard2 = () => {
        if (member) {
            setFormData({
                ...formData,
                registeredHouseNumber: member.registeredHouseNumber || '',
                registeredVillageNo: member.registeredVillageNo || '',
                registeredSubdistrict: member.registeredSubdistrict || '',
            });
            setIsEditingCard2(true);
        }
    };

    // แก้ไขการ์ด 3: รายละเอียดข้อมูลการรับบริการและที่ตั้ง
    const handleEditCard3 = () => {
        setIsEditingCard3(true);
    };

    // show give input value after save
    const handleChange = (e) => {
        const { name, value } = e.target;
        // setting format
        const formatterMap = {
            firstName: utils.cleanFirstName,
            lastName: utils.cleanLastName,
            birth: utils.formatBirth,
            phone: utils.formatPhone,
            registeredHouseNumber: utils.formatRegisteredHouseNumber,
            registeredVillageNo: utils.formatRegisteredVillageNo,
            prefix: (v) => v,
            registeredSubdistrict: (v) => v
        };
        const formatter = formatterMap[name] || ((v) => v);
        setFormData({
            ...formData,
            [name]: formatter(value)
        });
    }

    // บันทึกการ์ด 1: ข้อมูลส่วนตัว
    const handleSaveCard1 = async () => {
        const errorMsg = validate.validateUpdateProfile(
            formData.firstName,
            formData.lastName,
            formData.birth,
            formData.phone,
            member.registeredHouseNumber,
            member.registeredVillageNo,
        )

        if (errorMsg) {
            setMessage(errorMsg);
            setIsError(true);
            return;
        }

        const cleanedBirth = utils.cleanBirth(formData.birth);
        const cleanedPhone = utils.cleanPhone(formData.phone);
        const updateData = {
            ...member,
            prefix: formData.prefix,
            firstName: formData.firstName,
            lastName: formData.lastName,
            birth: cleanedBirth,
            phone: cleanedPhone,
        };

        try {
            const response = await axios.put(`http://localhost:8081/api/members/${member.memberId}`, updateData);
            if (response.data === "success") {
                setIsEditingCard1(false);
                setMember(updateData);
                setMessage("แก้ไขข้อมูลส่วนตัวสำเร็จ");
                setIsError(false);
            } else {
                setMessage("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
                setIsError(true);
            }
        } catch (error) {
            setMessage("เกิดข้อผิดพลาดในการบันทึกข้อมูลสมาชิก:");
            setIsError(true);
        }
    }

    // บันทึกการ์ด 2: ที่อยู่ตามทะเบียนประชาชน
    const handleSaveCard2 = async () => {
        const errorMsg = validate.validateUpdateProfile(
            member.firstName,
            member.lastName,
            utils.convertCEtoBE(member.birth),
            member.phone,
            formData.registeredHouseNumber,
            formData.registeredVillageNo,
        )

        if (errorMsg) {
            setMessage(errorMsg);
            setIsError(true);
            return;
        }

        const updateData = {
            ...member,
            registeredHouseNumber: formData.registeredHouseNumber,
            registeredVillageNo: formData.registeredVillageNo,
            registeredSubdistrict: formData.registeredSubdistrict,
        };

        try {
            const response = await axios.put(`http://localhost:8081/api/members/${member.memberId}`, updateData);
            if (response.data === "success") {
                setIsEditingCard2(false);
                setMember(updateData);
                setMessage("แก้ไขที่อยู่ตามทะเบียนประชาชนสำเร็จ");
                setIsError(false);
            } else {
                setMessage("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
                setIsError(true);
            }
        } catch (error) {
            setMessage("เกิดข้อผิดพลาดในการบันทึกข้อมูลสมาชิก:");
            setIsError(true);
        }
    }

    // บันทึกการ์ด 3: รายละเอียดข้อมูลการรับบริการและที่ตั้ง
    const handleSaveCard3 = async () => {
        if (services && services.length > 0) {
            for (const srv of services) {
                const serviceError = validate.validateUpdateService(srv.detail);
                if (serviceError) {
                    setMessage(serviceError);
                    setIsError(true);
                    return;
                }
            }

            try {
                for (const srv of services) {
                    await axios.put(`http://localhost:8081/api/services/${srv.serviceId}`, {
                        detail: srv.detail
                    });
                }
                setIsEditingCard3(false);
                setMessage("แก้ไขรายละเอียดบริการสำเร็จ");
                setIsError(false);
            } catch (error) {
                setMessage("เกิดข้อผิดพลาดในการบันทึกข้อมูลบริการ:");
                setIsError(true);
            }
        }
    }

    if (loading) {
        return <div className="viewprofile-wrapper text-center" style={{ paddingTop: '50px' }}>กำลังโหลดข้อมูล...</div>;
    }

    return (
        <div className="viewprofile-wrapper">
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
                    <button className="back-home-button" onClick={() => onNavigate('homemember')}>
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

            <div className="viewprofile-container">
                {/* 1. ข้อมูลส่วนตัว Card */}
                <PersonalCard
                    member={member}
                    isEditing={isEditingCard1}
                    onEdit={handleEditCard1}
                    onSave={handleSaveCard1}
                    onCancel={() => setIsEditingCard1(false)}
                    formData={formData}
                    onChange={handleChange}
                />

                {/* 2. ที่อยู่ตามทะเบียนประชาชน Card */}
                <AddressCard
                    member={member}
                    isEditing={isEditingCard2}
                    onEdit={handleEditCard2}
                    onSave={handleSaveCard2}
                    onCancel={() => setIsEditingCard2(false)}
                    formData={formData}
                    onChange={handleChange}
                />

                {/* 3. รายละเอียดข้อมูลการรับบริการและที่ตั้ง Card */}
                <ServiceCard
                    services={services}
                    isEditing={isEditingCard3}
                    onEdit={handleEditCard3}
                    onSave={handleSaveCard3}
                    onCancel={() => setIsEditingCard3(false)}
                    onChangeDetail={(index, value) => {
                        const cleanDetail = utils.formatDetail(value);
                        setServices(prev =>
                            prev.map((s, i) => i === index ? { ...s, detail: cleanDetail } : s)
                        );
                    }}
                />
            </div>

            {/* Message Alert Banner */}
            {message && (
                <div className={`message-alert ${isError ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default ViewProfile;