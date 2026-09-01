'use client';

import { useState, useEffect } from 'react';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  orientation: 'portrait' | 'landscape';
}

export function useDeviceDetect(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouch: false,
    isIOS: false,
    isAndroid: false,
    orientation: 'portrait',
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const ua = navigator.userAgent || '';
      const isTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
      const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isAndroid = /Android/.test(ua);

      const isMobile = width < 640 || (/Mobi|Android/i.test(ua) && width < 768);
      const isTablet = (width >= 640 && width < 1024) || /iPad|Tablet/i.test(ua);
      const isDesktop = width >= 1024 && !isMobile && !isTablet;
      const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isTouch,
        isIOS,
        isAndroid,
        orientation,
      });
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  return deviceInfo;
}
