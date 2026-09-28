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
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingService, setIsEditingService] = useState(false);

    const [formData, setFormData] = useState({})
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    const userRole = sessionStorage.getItem('userRole');
    const isOfficer = userRole === 'Officer';



    useEffect(() => {
        const viewProfile = async () => {
            const storedCitizenId = isOfficer
                ? sessionStorage.getItem('selectedMemberCitizenId')
                : sessionStorage.getItem('citizenId');

            if (!storedCitizenId) {
                onNavigate(isOfficer ? 'searchMember' : 'login');
                return;
            }
            try {
                const response = await axios.get(`/api/members/citizenId/${storedCitizenId}`);
                const foundMember = response.data;

                if (foundMember) {
                    setMember(foundMember);

                    const response = await axios.get(`/api/services/member/${foundMember.memberId}`);
                    const sortedServices = response.data;
                    setServices(sortedServices);
                } else {
                    onNavigate(isOfficer ? 'searchMember' : 'login');
                }
            } catch (error) {
                setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
            } finally {
                setLoading(false);
            }
        }
        viewProfile();
    }, [onNavigate, isOfficer]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);



    // แก้ไขการ์ด 1 & 2: ข้อมูลส่วนตัว
    const handleEditProfile = () => {
        if (member) {
            setFormData({
                ...formData,
                prefix: member.prefix || '',
                firstName: member.firstName || '',
                lastName: member.lastName || '',
                birth: utils.convertCEtoBE(member.birth) || '',
                phone: member.phone || '',

                registeredHouseNumber: member.registeredHouseNumber || '',
                registeredVillageNo: member.registeredVillageNo || '',
            });
            setIsEditingProfile(true);
        }
    };


    // แก้ไขการ์ด 3: รายละเอียดข้อมูลการรับบริการและที่ตั้ง
    const handleEditService = () => {
        setIsEditingService(true);
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
            password: utils.cleanPassword,
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
    const updateProfile = async () => {
        const errorMsg = validate.validateUpdateProfile(
            formData.firstName,
            formData.lastName,
            formData.birth,
            formData.phone,
            formData.registeredHouseNumber,
            formData.registeredVillageNo,
        )

        if (errorMsg) {
            setMessage(errorMsg);
            setIsError(true);
            return;
        }

        const cleanedBirth = utils.cleanBirth(formData.birth);
        const cleanedPhone = utils.cleanPhone(formData.phone);
        const cleanedPassword = formData.password ? utils.cleanPassword(formData.password) : member.password;
        const updateData = {
            ...member,
            prefix: formData.prefix,
            firstName: formData.firstName,
            lastName: formData.lastName,
            birth: cleanedBirth,
            phone: cleanedPhone,
            password: cleanedPassword,

            registeredHouseNumber: formData.registeredHouseNumber,
            registeredVillageNo: formData.registeredVillageNo,
        };

        try {
            const response = await axios.put(`/api/members/${member.memberId}`, updateData);
            if (response.data === "success") {
                setIsEditingProfile(false);
                setMember(updateData);
                setMessage("แก้ไขข้อมูลส่วนตัวสำเร็จ");
                setIsError(false);
            } else {
                setMessage("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
                setIsError(true);
            }
        } catch (error) {
            setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
            setIsError(true);
        }
    }


    // บันทึกการ์ด 3: รายละเอียดข้อมูลการรับบริการและที่ตั้ง
    const updateService = async () => {
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
                    await axios.put(`/api/services/${srv.serviceId}`, {
                        detail: srv.detail
                    });
                }
                setIsEditingService(false);
                setMessage("แก้ไขรายละเอียดบริการสำเร็จ");
                setIsError(false);
            } catch (error) {
                setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
                setIsError(true);
            }
        }
    }


    const cancelService = async (serviceId) => {
        try {
            const response = await axios.put(`/api/services/${serviceId}/cancel`);
            if (response.data === "success") {
                setIsEditingService(false);
                setServices(prev => prev.map(s => s.serviceId === serviceId ? { ...s, status: 'ยกเลิก' } : s));
                setMessage("ยกเลิกบริการสำเร็จ");
                setIsError(false);
            } else {
                setMessage("คุณยังมีค่าบริการที่ต้องชำระ");
                setIsError(true);
            }
        } catch (error) {
            setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
            setIsError(true);
        }
    }

    //คิดอยู่ว่าจะทำต่อไหม
    const requestService = async (serviceId) => {
        try {
            const response = await axios.put(`/api/services/${serviceId}/reapply`);
            if (response.data === "success") {
                setServices(prev => prev.map(s => s.serviceId === serviceId ? { ...s, status: 'รอดำเนินการ', endDate: null } : s));
                setMessage("ส่งคำขอรับบริการเรียบร้อยแล้ว รอเจ้าหน้าที่ตรวจสอบ");
                setIsError(false);
            } else {
                setMessage("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
                setIsError(true);
            }
        } catch (error) {
            setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
            setIsError(true);
        }
    }

    if (loading) {
        return <div className="viewprofile-wrapper viewprofile-loading">กำลังโหลดข้อมูล...</div>;
    }


    return (
        <div className="viewprofile-wrapper">
            {/* Navigation Bar */}
            <nav className="homemember-navbar">
                <div className="navbar-brand navbar-brand-clickable" onClick={() => onNavigate('homemember')}>
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
                    <button className="back-home-button" onClick={() => onNavigate(isOfficer ? 'searchMember' : 'homemember')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        {isOfficer ? 'กลับหน้ารายชื่อ' : 'หน้าหลัก'}
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
                    isEditing={isEditingProfile}
                    isOfficer={isOfficer}
                    onEdit={handleEditProfile}
                    onSave={updateProfile}
                    onCancel={() => setIsEditingProfile(false)}
                    formData={formData}
                    onChange={handleChange}
                />

                {/* 2. ที่อยู่ตามทะเบียนประชาชน Card */}
                <AddressCard
                    member={member}
                    isEditing={isEditingProfile && isOfficer}
                    formData={formData}
                    onChange={handleChange}
                />

                {/* 3. รายละเอียดข้อมูลการรับบริการและที่ตั้ง Card */}
                <ServiceCard
                    services={services}
                    isEditing={isEditingService}
                    onEdit={handleEditService}
                    onSave={updateService}
                    onCancel={() => setIsEditingService(false)}
                    onChangeDetail={(index, value) => {
                        const cleanDetail = utils.formatDetail(value);
                        setServices(prev =>
                            prev.map((s, i) => i === index ? { ...s, detail: cleanDetail } : s)
                        );
                    }}
                    onCancelService={cancelService}
                    onRequestService={requestService}
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