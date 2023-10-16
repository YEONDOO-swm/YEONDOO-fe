import React, { useState } from 'react'
import { color } from '../layout/color';

const LessButton = ({handleViewLessAbstract, paperId}: {handleViewLessAbstract: any, paperId: string}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    return (
    <span onClick={() => handleViewLessAbstract(paperId)} style={{color: isHovered?color.hoverGreen:color.mainGreen, borderBottom: `1px solid ${isHovered?color.hoverGreen:color.mainGreen}`, cursor: 'pointer', fontWeight: 500}}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}>▲ Less</span>
  )
}

export default LessButton