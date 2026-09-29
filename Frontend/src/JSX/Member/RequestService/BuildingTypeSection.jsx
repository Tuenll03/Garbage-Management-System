import React from 'react';

const buildingTypes = [
    {
        id: 'บ้านพักอาศัย',
        title: 'บ้านพักอาศัย',
        desc: 'สำหรับการพักอาศัยทั่วไป',
        iconName: 'house'
    },
    {
        id: 'ร้านค้า/ร้านอาหาร',
        title: 'ร้านค้า/ร้านอาหาร',
        desc: 'สถานประกอบการขนาดเล็ก',
        iconName: 'store'
    },
    {
        id: 'อาคารพาณิชย์',
        title: 'อาคารพาณิชย์',
        desc: 'อาคารสำนักงานหรือหอพัก',
        iconName: 'building'
    }
];

const renderBuildingIcon = (iconName) => {
    switch (iconName) {
        case 'house':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="card-icon">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            );
        case 'store':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="card-icon">
                    <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                    <path d="M3 9l3-6h12l3 6M12 3v6M9 9v10M15 9v10" />
                </svg>
            );
        case 'building':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="card-icon">
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                    <line x1="9" y1="22" x2="9" y2="16" />
                    <line x1="15" y1="22" x2="15" y2="16" />
                    <line x1="9" y1="16" x2="15" y2="16" />
                    <path d="M8 6h2v2H8V6Zm0 4h2v2H8v-2Zm6-4h2v2h-2V6Zm0 4h2v2h-2v-2Z" />
                </svg>
            );
        default:
            return null;
    }
};

function BuildingTypeSection({ buildingType, onChangeBuildingType }) {
    return (
        <div>
            <div className="section-header">
                <div className="section-number">1</div>
                <h3 className="section-title-text">ประเภทอาคาร / สถานที่</h3>
            </div>
            <div className="card-grid-3">
                {buildingTypes.map((item) => (
                    <div
                        key={item.id}
                        className={`selector-card ${buildingType === item.id ? 'selected' : ''}`}
                        onClick={() => onChangeBuildingType(item.id)}
                    >
                        {renderBuildingIcon(item.iconName)}
                        <h4 className="card-title">{item.title}</h4>
                        <p className="card-desc">{item.desc}</p>
                        <div className="card-select-dot"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BuildingTypeSection;
