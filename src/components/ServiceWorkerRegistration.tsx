'use client';

import { useEffect } from 'react';

const ServiceWorkerRegistration = () => {
  useEffect(() => {
    // Temporarily disabled until Vercel static file serving is fixed
    // if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    //   navigator.serviceWorker
    //     .register('/sw.js')
    //     .then((registration) => {
    //       console.log('SW registered: ', registration);
    //     })
    //     .catch((registrationError) => {
    //       console.log('SW registration failed: ', registrationError);
    //     });
    // }
  }, []);

  return null;
};

export default ServiceWorkerRegistration;