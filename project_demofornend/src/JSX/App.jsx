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
    if (userRole === 'Admin') return 'homememberadmin';
    if (userRole === 'Officer') return 'homememberofficer';
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
      {currentPage === 'homememberofficer' && userRole === 'Officer' && <HomeOfficer onNavigate={navigateTo} />}
      {currentPage === 'homememberadmin' && userRole === 'Admin' && <HomeAdmin onNavigate={navigateTo} />}
    </>
  );
}

export default App;
