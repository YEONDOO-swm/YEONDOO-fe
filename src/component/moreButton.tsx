import React, { useState } from 'react'
import { color } from '../layout/color';

const MoreButton = ({paperId, handleViewMoreAbstract}: {paperId: string, handleViewMoreAbstract: any}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };
  
    return (
    <span onClick={() => handleViewMoreAbstract(paperId)} style={{color: isHovered?color.hoverGreen:color.mainGreen, borderBottom: `1px solid ${isHovered?color.hoverGreen:color.mainGreen}`, cursor: 'pointer', fontWeight: 500}}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                >▼ More</span>
  )
}

export default MoreButton