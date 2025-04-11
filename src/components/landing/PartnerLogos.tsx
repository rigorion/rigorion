import React, { useEffect, useRef } from 'react';
const LOGOS = [{
  name: "Finance",
  repeat: 3
}, {
  name: "CROLLA",
  repeat: 3
}, {
  name: "EV3A",
  repeat: 3
}, {
  name: "TESLA",
  repeat: 3
}, {
  name: "SONY",
  repeat: 3
}];
export const PartnerLogos = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // For automatic scrolling if needed
    let scrollingInterval: ReturnType<typeof setInterval> | null = null;

    // Create the animation
    const startScrolling = () => {
      if (scrollingInterval) return;
      scrollingInterval = setInterval(() => {
        if (!scroller) return;
        if (scroller.scrollLeft >= scroller.scrollWidth / 2) {
          scroller.scrollLeft = 0;
        } else {
          scroller.scrollLeft += 1;
        }
      }, 30);
    };
    const stopScrolling = () => {
      if (scrollingInterval) {
        clearInterval(scrollingInterval);
        scrollingInterval = null;
      }
    };

    // Start the animation
    startScrolling();

    // Add hover event to pause animation
    scroller.addEventListener('mouseenter', stopScrolling);
    scroller.addEventListener('mouseleave', startScrolling);
    return () => {
      stopScrolling();
      if (scroller) {
        scroller.removeEventListener('mouseenter', stopScrolling);
        scroller.removeEventListener('mouseleave', startScrolling);
      }
    };
  }, []);

  // Create a duplicated array for seamless scrolling
  const allLogos = [...LOGOS, ...LOGOS];
  return <section className="overflow-hidden bg-gray-50 py-[8px]">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-center text-lg text-gray-500 font-medium">TRUSTED BY LEADING BRANDS</h2>
      </div>
      
      <div className="relative w-full">
        <div ref={scrollerRef} className="flex overflow-x-auto whitespace-nowrap scrollbar-none" style={{
        scrollBehavior: 'smooth'
      }}>
          {allLogos.map((logo, index) => <div key={`${logo.name}-${index}`} className="inline-flex items-center justify-center min-w-[200px] px-8">
              <span className="text-xl text-gray-400 font-medium">{logo.name}</span>
            </div>)}
        </div>
      </div>
    </section>;
};