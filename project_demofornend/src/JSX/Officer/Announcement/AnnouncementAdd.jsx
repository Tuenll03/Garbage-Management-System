import React, { useState } from 'react';
import axios from 'axios';
import utils from '../../../utils';
import validate from '../../../validate';

function AnnouncementAdd({ onAddSuccess }) {
    const [newTopic, setNewTopic] = useState('');
    const [newDetail, setNewDetail] = useState('');
    const [newType, setNewType] = useState('ทั่วไป');
    const [newDate, setNewDate] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleTopicChange = (e) => {
        const clean = utils.cleanTopic(e.target.value);
        setNewTopic(clean);
    };

    const handleDateChange = (e) => {
        const clean = utils.cleanBirth(e.target.value);
        setNewDate(clean);
    };

    const handleDetailChange = (e) => {
        const clean = utils.cleanDetail(e.target.value);
        setNewDetail(clean);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errorMsg = validate.manageAnnouncements(
            newTopic,
            newDetail,
            newType,
            newDate
        );

        if (errorMsg) {
            setMessage(errorMsg);
            setIsError(true);
            return;
        }

        const cleanedDate = utils.cleanBirth(newDate);
        const data = {
            announcementTopic: newTopic,
            announcementDetail: newDetail,
            announcementType: newType,
            announcementDate: cleanedDate
        };

        try {
            const response = await axios.post('http://localhost:8081/api/announcements', data);
            if (response.data === 'success') {
                setMessage('เพิ่มประกาศสำเร็จ');
                setIsError(false);
                setNewTopic('');
                setNewDetail('');
                setNewType('ทั่วไป');
                setNewDate('');
                onAddSuccess();
            } else {
                setMessage(response.data);
                setIsError(true);
            }
        } catch (error) {
            setMessage('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
            setIsError(true);
        }
    };

    return (
        <div className="announcement-card-box">
            <div className="list-header-container" style={{ marginBottom: '24px' }}>
                <div className="list-title-icon-box" style={{ backgroundColor: '#e8f5e9', color: '#1b5e20' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                </div>
                <div className="list-header-text">
                    <h2>สร้างประกาศข่าวสาร</h2>
                    <p>ระบุหัวข้อ วันที่ ประเภท และรายละเอียดเพื่อเผยแพร่ข่าวสารประชาสัมพันธ์</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="announcement-form">
                <div className="form-row-full">
                    <label className="form-label" htmlFor="newTopic">
                        หัวข้อข่าวสาร <span className="required-star">*</span>
                    </label>
                    <input
                        type="text"
                        id="newTopic"
                        className="form-input-text"
                        value={newTopic}
                        onChange={handleTopicChange}
                        placeholder="กรอกหัวข้อข่าวสาร..."
                        maxLength="50"
                    />
                </div>

                <div className="form-grid-row">
                    <div className="form-row-full">
                        <label className="form-label" htmlFor="newDate">
                            วันที่ประกาศ <span className="required-star">*</span>
                        </label>
                        <div className="input-with-icon-wrapper">
                            <input
                                type="text"
                                id="newDate"
                                className="form-input-text"
                                value={newDate}
                                onChange={handleDateChange}
                                placeholder="วัน-เดือน-ปี พ.ศ. (เช่น 22-08-2569)"
                                maxLength="10"
                            />
                            <span className="input-internal-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </span>
                        </div>
                    </div>

                    <div className="form-row-full">
                        <label className="form-label" htmlFor="newType">
                            ประเภทประกาศ
                        </label>
                        <select
                            id="newType"
                            className="form-select-box"
                            value={newType}
                            onChange={(e) => setNewType(e.target.value)}
                        >
                            <option value="ทั่วไป">ทั่วไป</option>
                            <option value="ด่วน">เร่งด่วน</option>
                        </select>
                    </div>
                </div>

                <div className="form-row-full">
                    <label className="form-label" htmlFor="newDetail">
                        รายละเอียดข่าวสาร <span className="required-star">*</span>
                    </label>
                    <textarea
                        id="newDetail"
                        className="form-textarea"
                        value={newDetail}
                        onChange={handleDetailChange}
                        placeholder="ระบุรายละเอียดประกาศข่าวสาร..."
                        maxLength="255"
                    />
                </div>

                <div className="form-buttons-row">
                    <button type="submit" className="btn-submit-save">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                            <polyline points="17 21 17 13 7 13 7 21" />
                            <polyline points="7 3 7 8 15 8" />
                        </svg>
                        บันทึกประกาศ
                    </button>
                </div>
            </form>

            {message && (
                <div className={`announcement-message-banner ${isError ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default AnnouncementAdd;
