import React, { useRef, useEffect } from 'react';

const InteractiveBackground: React.FC = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  
  const position = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);
  const state = useRef<'drifting' | 'dragging' | 'throwing'>('drifting');

  const lastMousePos = useRef({ x: 0, y: 0 });
  
  const friction = 0.95;
  const defaultDrift = { x: -0.3, y: -0.3 }; 
  const wrapBoundary = 5000;
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      state.current = 'dragging';
      velocity.current = { x: 0, y: 0 }; 
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      lastMousePos.current = { x: clientX, y: clientY };
    };

    const handleMouseUp = () => {
      if (state.current === 'dragging') {
        state.current = 'throwing'; 
      }
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (state.current !== 'dragging') return;
      e.preventDefault();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const deltaX = clientX - lastMousePos.current.x;
      const deltaY = clientY - lastMousePos.current.y;
      
      position.current.x += deltaX;
      position.current.y += deltaY;
      velocity.current = { x: deltaX, y: deltaY };
      lastMousePos.current = { x: clientX, y: clientY };
    };

    const animate = () => {
      switch (state.current) {
        case 'drifting':
          velocity.current = defaultDrift;
          break;
        
        case 'throwing':
          velocity.current.x *= friction;
          velocity.current.y *= friction;
          if (Math.abs(velocity.current.x) < 0.1 && Math.abs(velocity.current.y) < 0.1) {
            state.current = 'drifting';
          }
          break;

        case 'dragging':
          break;
      }

      position.current.x += velocity.current.x;
      position.current.y += velocity.current.y;
      
      position.current.x %= wrapBoundary;
      position.current.y %= wrapBoundary;

      if (bgRef.current) {
        bgRef.current.style.backgroundPosition = `${position.current.x}px ${position.current.y}px`;
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    const currentWindow = window;
    currentWindow.addEventListener('mousedown', handleMouseDown);
    currentWindow.addEventListener('mouseup', handleMouseUp);
    currentWindow.addEventListener('mousemove', handleMouseMove, { passive: false });
    currentWindow.addEventListener('touchstart', handleMouseDown, { passive: true });
    currentWindow.addEventListener('touchend', handleMouseUp);
    currentWindow.addEventListener('touchmove', handleMouseMove, { passive: false });

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      currentWindow.removeEventListener('mousedown', handleMouseDown);
      currentWindow.removeEventListener('mouseup', handleMouseUp);
      currentWindow.removeEventListener('mousemove', handleMouseMove);
      currentWindow.removeEventListener('touchstart', handleMouseDown);
      currentWindow.removeEventListener('touchend', handleMouseUp);
      currentWindow.removeEventListener('touchmove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-0">
      <div ref={bgRef} className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%]" style={{ backgroundImage: 'linear-gradient(rgba(247,183,49,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(247,183,49,0.1) 1px, transparent 1px)', backgroundSize: '2em 2em' }} />
      <div className="absolute top-0 left-0 w-full h-full" style={{ background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.5), rgba(0,0,0,0.5) 1px, transparent 1px, transparent 4px)' }} />
      <div className="absolute top-0 left-0 w-full h-full" style={{ boxShadow: 'inset 0 0 250px rgba(0,0,0,1)' }} />
    </div>
  );
};

export default InteractiveBackground;