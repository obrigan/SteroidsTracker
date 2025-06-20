
import { useEffect } from 'react';
import { useLocation } from 'wouter';

const routes = ['/dashboard', '/injections', '/courses', '/blood-tests', '/profile'];

export function useSwipeNavigation() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      // Only navigate if horizontal swipe is dominant
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        const currentIndex = routes.indexOf(location);
        if (currentIndex !== -1) {
          if (deltaX > 0 && currentIndex > 0) {
            // Swipe right - go to previous route
            setLocation(routes[currentIndex - 1]);
          } else if (deltaX < 0 && currentIndex < routes.length - 1) {
            // Swipe left - go to next route
            setLocation(routes[currentIndex + 1]);
          }
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [location, setLocation]);
}
