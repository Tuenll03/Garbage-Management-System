import React, { useState } from 'react';
import Login from './Login';
import RegisterMember from './Member/RegisterMember';
import HomeMember from './Member/HomeMember';
import HomeOfficer from './Officer/HomeOfficer';
import HomeAdmin from './Admin/HomeAdmin';
import RequestService from './Member/RequestService';
import NotifyMember from './Member/NotifyMember';
import ViewAnnouncement from './Member/ViewAnnouncement';
import ViewProfile from './Member/ViewProfile';
import Invoice from './Member/Invoice';
import ListApprove from './Officer/ListApprove';
import ApproveService from './Officer/ApproveService';
import Announcements from './Officer/Announcements';
import AnnouncementAdd from './Officer/Announcement/AnnouncementAdd';
import AnnouncementEdit from './Officer/Announcement/AnnouncementEdit';
import SearchMember from './Officer/SearchMember';;
import ViewPaymentStatus from './Officer/ViewPaymentStatus';
import MakeCustomerPayment from './Officer/MakeCustomerPayment';
import ListOfficerAccount from './Admin/ListOfficerAccount';
import AddAccount from './Admin/AddAccount';
import EditAccount from './Admin/EditAccount';




function App() {
  const userRole = sessionStorage.getItem('userRole');

  const [currentPage, setCurrentPage] = useState(() => {
    // ดึงหน้าล่าสุดที่บันทึกไว้ใน sessionStorage (ป้องกันตอนรีหน้า)
    const savedPage = sessionStorage.getItem('currentPage');

    if (savedPage === 'register' || savedPage === 'registerMember') return savedPage;
    //ดึงข้อมูลจาก Session Storage เพื่อตรวจสอบว่ามีการ Login แล้วหรือไม่
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') return 'login';

    // ถ้าล็อกอินแล้ว และมีหน้าเดิมที่บันทึกไว้ ให้เปิดหน้าเดิม
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
      {(currentPage === 'register' || currentPage === 'registerMember') && <RegisterMember onNavigate={navigateTo} />}
      {currentPage === 'homemember' && userRole === 'Member' && <HomeMember onNavigate={navigateTo} />}
      {currentPage === 'requestService' && userRole === 'Member' && <RequestService onNavigate={navigateTo} />}
      {currentPage === 'notifyMember' && userRole === 'Member' && <NotifyMember onNavigate={navigateTo} />}
      {currentPage === 'viewAnnouncement' && userRole === 'Member' && <ViewAnnouncement onNavigate={navigateTo} />}
      {currentPage === 'viewProfile' && (userRole === 'Member' || userRole === 'Officer') && <ViewProfile onNavigate={navigateTo} />}
      {currentPage === 'invoiceMember' && userRole === 'Member' && <Invoice onNavigate={navigateTo} />}
      {currentPage === 'homeOfficer' && userRole === 'Officer' && <HomeOfficer onNavigate={navigateTo} />}
      {currentPage === 'listApprove' && userRole === 'Officer' && <ListApprove onNavigate={navigateTo} />}
      {currentPage === 'approveService' && userRole === 'Officer' && <ApproveService onNavigate={navigateTo} />}
      {currentPage === 'announcements' && userRole === 'Officer' && <Announcements onNavigate={navigateTo} />}
      {currentPage === 'addAnnouncement' && userRole === 'Officer' && <AnnouncementAdd onNavigate={navigateTo} />}
      {currentPage === 'editAnnouncement' && userRole === 'Officer' && <AnnouncementEdit onNavigate={navigateTo} />}
      {currentPage === 'searchMember' && userRole === 'Officer' && <SearchMember onNavigate={navigateTo} />}
      {currentPage === 'viewPaymentStatus' && userRole === 'Officer' && <ViewPaymentStatus onNavigate={navigateTo} />}
      {currentPage === 'makeCustomerPayment' && userRole === 'Officer' && <MakeCustomerPayment onNavigate={navigateTo} />}
      {currentPage === 'homeAdmin' && userRole === 'Admin' && <HomeAdmin onNavigate={navigateTo} />}
      {currentPage === 'listOfficerAccount' && userRole === 'Admin' && <ListOfficerAccount onNavigate={navigateTo} />}
      {currentPage === 'addAccount' && userRole === 'Admin' && <AddAccount onNavigate={navigateTo} />}
      {currentPage === 'editAccount' && userRole === 'Admin' && <EditAccount onNavigate={navigateTo} />}

    </>
  );
}

export default App;
