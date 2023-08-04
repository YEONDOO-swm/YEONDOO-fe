import React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const RouteChangeTracker = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    ReactGA.initialize('G-Q44DBL2GVC');
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      // Define a mapping of URL paths to page titles
      const pageTitleMap: { [key: string]: string } = {
        '/home': '홈페이지',
        '/history': '전체 검색 히스토리 페이지',
        '/history/trash': '관심 해제 논문 페이지',
        '/historypaper': '논문 내 질의 히스토리 페이지',
        '/userprofile': '유저 프로필 페이지',
        '/paperstorage': '논문보관함 페이지',
        '/paperview': 'AI와 논문읽기 페이지',
        // Add more mappings as needed for other pages
      };

      // Get the page title from the mapping based on the current URL
      const pageTitle = pageTitleMap[location.pathname] || location.pathname;

      ReactGA.send({ page: location.pathname, title: pageTitle });
    }
  }, [initialized, location]);

  return null; // This component doesn't render anything, so return null
};

export default RouteChangeTracker;
