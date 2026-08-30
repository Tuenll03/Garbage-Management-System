import React, { useState } from 'react';
import Login from './Login';
import Register from './Member/Register';
import HomeMember from './Member/HomeMember';
import HomeOfficer from './Officer/HomeOfficer';
import HomeAdmin from './Admin/HomeAdmin';
import RequestService from './Member/RequestService';
import NotifyMember from './Member/NotifyMember';
import AnnouncementMember from './Member/AnnouncementMember';
import ViewProfile from './Member/ViewProfile';
import Invoice from './Member/Invoice';
import ListApprove from './Officer/ListApprove';
import ApproveDetail from './Officer/ApproveDetail';
import ManageAnnouncements from './Officer/ManageAnnouncements';
import ManageHouseholds from './Officer/ManageHouseholds';
import VerifyPayments from './Officer/VerifyPayments';
import VerifyPaymentDetail from './Officer/VerifyPaymentDetail';
import ManageOfficer from './Admin/ManageOfficer';
import AddOfficer from './Admin/AddOfficer';
import EditOfficer from './Admin/EditOfficer';




function App() {
  const userRole = sessionStorage.getItem('userRole');

  const [currentPage, setCurrentPage] = useState(() => {
    //ดึงข้อมูลจาก Session Storage เพื่อตรวจสอบว่ามีการ Login แล้วหรือไม่
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') return 'login';

    // ดึงหน้าล่าสุดที่บันทึกไว้ใน sessionStorage (ป้องกันตอนรีหน้า)
    const savedPage = sessionStorage.getItem('currentPage');
    if (savedPage) return savedPage;

    // ถ้าไม่มีประวัติหน้าล่าสุด ให้หาหน้าแรกที่เหมาะสมตามระดับสิทธิ์ (userRole)
    if (userRole === 'Admin') return 'homeAdmin';
    if (userRole === 'Officer') return 'homeOfficer';
    return 'homemember';
  });

  const navigateTo = (page) => {
    setCurrentPage(page);

    //เก็บข้อมูลcurrentPageไว้ใน Session Storage
    sessionStorage.setItem('currentPage', page);

    if (page === 'login') {
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('citizenId');
      sessionStorage.removeItem('currentPage');
      sessionStorage.removeItem('userRole');
    }
  };

  return (
    <>
      {currentPage === 'login' && <Login onNavigate={navigateTo} />}
      {currentPage === 'register' && <Register onNavigate={navigateTo} />}
      {currentPage === 'homemember' && userRole === 'Member' && <HomeMember onNavigate={navigateTo} />}
      {currentPage === 'requestService' && userRole === 'Member' && <RequestService onNavigate={navigateTo} />}
      {currentPage === 'notifyMember' && userRole === 'Member' && <NotifyMember onNavigate={navigateTo} />}
      {currentPage === 'announcementMember' && userRole === 'Member' && <AnnouncementMember onNavigate={navigateTo} />}
      {currentPage === 'viewProfile' && userRole === 'Member' && <ViewProfile onNavigate={navigateTo} />}
      {currentPage === 'invoiceMember' && userRole === 'Member' && <Invoice onNavigate={navigateTo} />}
      {currentPage === 'homeOfficer' && userRole === 'Officer' && <HomeOfficer onNavigate={navigateTo} />}
      {currentPage === 'listApprove' && userRole === 'Officer' && <ListApprove onNavigate={navigateTo} />}
      {currentPage === 'approveDetail' && userRole === 'Officer' && <ApproveDetail onNavigate={navigateTo} />}
      {currentPage === 'manageAnnouncements' && userRole === 'Officer' && <ManageAnnouncements onNavigate={navigateTo} />}
      {currentPage === 'manageHouseholds' && userRole === 'Officer' && <ManageHouseholds onNavigate={navigateTo} />}
      {currentPage === 'verifyPayments' && userRole === 'Officer' && <VerifyPayments onNavigate={navigateTo} />}
      {currentPage === 'verifyPaymentDetail' && userRole === 'Officer' && <VerifyPaymentDetail onNavigate={navigateTo} />}
      {currentPage === 'homeAdmin' && userRole === 'Admin' && <HomeAdmin onNavigate={navigateTo} />}
      {currentPage === 'manageofficers' && userRole === 'Admin' && <ManageOfficer onNavigate={navigateTo} />}
      {currentPage === 'addOfficer' && userRole === 'Admin' && <AddOfficer onNavigate={navigateTo} />}
      {currentPage === 'editOfficer' && userRole === 'Admin' && <EditOfficer onNavigate={navigateTo} />}

    </>
  );
}

export default App;
