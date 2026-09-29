import React from 'react';

const serviceTypes = [
    {
        id: 'ชำระรายเดือน',
        title: 'ชำระรายเดือน',
        desc: 'เรียกเก็บทุกสิ้นเดือนตามปริมาณขยะจริง'
    },
    {
        id: 'ชำระรายปี',
        title: 'ชำระรายปี (แนะนำ)',
        desc: 'สะดวก รวดเร็ว ไม่ต้องกังวลเรื่องยอดค้างชำระ'
    }
];

function FeeTypeSection({ serviceType, onChangeServiceType }) {
    return (
        <div>
            <div className="section-header">
                <div className="section-number">3</div>
                <h3 className="section-title-text">รูปแบบการเก็บค่าธรรมเนียม</h3>
            </div>
            <div className="card-grid-2">
                {serviceTypes.map((item) => (
                    <div
                        key={item.id}
                        className={`fee-card ${serviceType === item.id ? 'selected' : ''}`}
                        onClick={() => onChangeServiceType(item.id)}
                    >
                        <div className="fee-select-circle"></div>
                        <div className="fee-content">
                            <h4 className="card-title">{item.title}</h4>
                            <p className="card-desc">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FeeTypeSection;
