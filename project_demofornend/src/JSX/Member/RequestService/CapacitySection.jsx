import React from 'react';

const capacityOptions = [
    { weight: 20, price: 30, title: 'ขนาดเล็ก', desc: 'ไม่เกิน 20 ลิตร', priceText: '30 บาท/เดือน', icon: 'leaf' },
    { weight: 40, price: 60, title: 'ขนาดกลาง', desc: 'ไม่เกิน 40 ลิตร', priceText: '60 บาท/เดือน', icon: 'bag' },
    { weight: 60, price: 90, title: 'ขนาดใหญ่', desc: 'ไม่เกิน 60 ลิตร', priceText: '90 บาท/เดือน', icon: 'bin' },
    { weight: 80, price: 120, title: '60 - 80 ลิตร', desc: 'ปริมาณขยะขยับขึ้น', priceText: '120 บาท/เดือน', icon: 'box' },
    { weight: 100, price: 150, title: '80 - 100 ลิตร', desc: 'ขยะปานกลางค่อนข้างมาก', priceText: '150 บาท/เดือน', icon: 'clock' },
    { weight: 200, price: 250, title: '100 - 200 ลิตร', desc: 'ขยะปริมาณมาก', priceText: '250 บาท/เดือน', icon: 'up' },
    { weight: 300, price: 350, title: '200 - 300 ลิตร', desc: 'สถานประกอบการทั่วไป', priceText: '350 บาท/เดือน', icon: 'lines' },
    { weight: 400, price: 450, title: '300 - 400 ลิตร', desc: 'สถานประกอบการขนาดใหญ่', priceText: '450 บาท/เดือน', icon: 'warehouse' },
    { weight: 500, price: 600, title: '400 - 500 ลิตร', desc: 'ปริมาณสูงสุดตามเกณฑ์', priceText: '600 บาท/เดือน', icon: 'factory' }
];

const renderCapacityIcon = (iconName) => {
    switch (iconName) {
        case 'leaf':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-icon">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 8.5C18.5 16 15 20 11 20z" />
                    <path d="M19 2c-2.26 4.33-5.27 7.14-8 10" />
                </svg>
            );
        case 'bag':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-icon">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
            );
        case 'bin':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-icon">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
            );
        case 'box':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-icon">
                    <polyline points="21 8 21 21 3 21 3 8" />
                    <rect x="1" y="3" width="22" height="5" />
                    <line x1="10" y1="12" x2="14" y2="12" />
                </svg>
            );
        case 'clock':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-icon">
                    <path d="M12 22H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <polyline points="3 6 5 6 19 6" />
                    <path d="M19 6v6" />
                    <circle cx="18" cy="18" r="4" />
                    <polyline points="18 16 18 18 19 19" />
                </svg>
            );
        case 'up':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-icon">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <polyline points="12 16 12 10" />
                    <polyline points="9 13 12 10 15 13" />
                </svg>
            );
        case 'lines':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-icon">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="8" y1="11" x2="16" y2="11" />
                    <line x1="8" y1="15" x2="16" y2="15" />
                </svg>
            );
        case 'warehouse':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-icon">
                    <path d="M3 21h18" />
                    <path d="M3 10v11" />
                    <path d="M21 10v11" />
                    <path d="M12 2L3 10h18z" />
                    <path d="M9 21v-8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v8" />
                </svg>
            );
        case 'factory':
            return (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-icon">
                    <path d="M2 20h20" />
                    <path d="M20 18v-8l-4 4v-4l-4 4V7l-8 5v6" />
                </svg>
            );
        default:
            return null;
    }
};

function CapacitySection({ garbageWeight, onCapacitySelect }) {
    return (
        <div>
            <div className="section-header">
                <div className="section-number">4</div>
                <h3 className="section-title-text">ปริมาณขยะโดยประมาณ (ต่อสัปดาห์)</h3>
            </div>
            <div className="card-grid-3">
                {capacityOptions.map((item) => (
                    <div
                        key={item.weight}
                        className={`capacity-card ${garbageWeight === item.weight ? 'selected' : ''}`}
                        onClick={() => onCapacitySelect(item.weight, item.price)}
                    >
                        {renderCapacityIcon(item.icon)}
                        <h4 className="capacity-title">{item.title}</h4>
                        <p className="capacity-desc">{item.desc}</p>
                        <p className="capacity-price">{item.priceText}</p>
                        <div className="capacity-select-dot"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CapacitySection;
