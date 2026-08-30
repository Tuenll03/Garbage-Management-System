import React from 'react';
import axios from 'axios';

function AnnouncementDelete({ id, onDeleteSuccess, onError }) {
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:8081/api/announcements/${id}`);
            if (response.data === 'success') {
                onDeleteSuccess();
            } else {
                onError(response.data);
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการลบประกาศ:", error);
            onError('เกิดข้อผิดพลาดในการลบประกาศ');
        }
    };

    return (
        <button className="btn-action-delete" onClick={handleDelete}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="action-icon">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
            ลบ
        </button>
    );
}

export default AnnouncementDelete;
