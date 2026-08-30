import React from 'react';
import utils from '../../../utils';
import AnnouncementDelete from './AnnouncementDelete';

function AnnouncementList({ announcements, onEdit, onDeleteSuccess, onError }) {
    return (
        <div className="announcement-card-box" style={{ marginTop: '0px' }}>
            <div className="list-header-container">
                <div className="list-title-icon-box">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L21 8M21 3v5h-5"/>
                    </svg>
                </div>
                <div className="list-header-text">
                    <h2>รายการข่าวสารทั้งหมด</h2>
                    <p>ประวัติการประกาศข้อมูลในระบบ</p>
                </div>
            </div>

            <div className="table-responsive">
                <table className="announcements-custom-table">
                    <thead>
                        <tr>
                            <th style={{ width: '28%', textAlign: 'left' }}>หัวข้อข่าวสาร</th>
                            <th style={{ width: '38%', textAlign: 'left' }}>รายละเอียด</th>
                            <th style={{ width: '18%', textAlign: 'left' }}>วันที่ประกาศ</th>
                            <th style={{ width: '16%', textAlign: 'left' }}>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {announcements.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="empty-table-row">
                                    ไม่พบข้อมูลประกาศข่าวสารในระบบขณะนี้
                                </td>
                            </tr>
                        ) : (
                            announcements.map((item) => {
                                const isUrgent = item.announcementType === 'ด่วน' || item.announcementType === 'เร่งด่วน';
                                const isGeneral = item.announcementType === 'ทั่วไป';
                                let dotClass = 'dot-blue';
                                if (isUrgent) dotClass = 'dot-orange';
                                else if (isGeneral) dotClass = 'dot-green';

                                return (
                                    <tr key={item.announcementId}>
                                        <td>
                                            <div className="topic-td-cell">
                                                <span className={`announce-dot ${dotClass}`}></span>
                                                <span>{item.announcementTopic}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ color: '#64748b', fontSize: '13.5px', lineHeight: '1.4' }}>
                                                {item.announcementDetail}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="date-td-cell">
                                                {utils.formatShortThaiDate(utils.convertCEtoBE(item.announcementDate))}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="actions-td-cell">
                                                <button 
                                                    className="btn-action-edit"
                                                    onClick={() => onEdit(item.announcementId)}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="action-icon">
                                                        <path d="M12 20h9"/>
                                                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                                                    </svg>
                                                    แก้ไข
                                                </button>
                                                <AnnouncementDelete
                                                    id={item.announcementId}
                                                    onDeleteSuccess={onDeleteSuccess}
                                                    onError={onError}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AnnouncementList;
