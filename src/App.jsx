import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CONFIGURATION
 */
const CONFIG = {
  greeting: "Happy Birthday Aisha",
  message: "May Allah make your life bloom with more joy, color, sucess and endless happiness. Here is to a year of growing stronger and more beautiful.",
  colors: {
    ball: "#F472B6", // Pink-400
  }
};

/**
 * COMPONENT: Background
 */
const Background = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -10, overflow: 'hidden', backgroundColor: 'black', pointerEvents: 'none' }}>
      <style>{`
        @keyframes hue-rotate-anim {
          from { filter: hue-rotate(0deg); }
          to { filter: hue-rotate(360deg); }
        }
        .hue-animated-bg {
          animation: hue-rotate-anim 20s linear infinite;
          background: linear-gradient(360deg, #581c87, #be185d); 
          background-size: cover;
          background-blend-mode: hard-light;
          opacity: 0.3; 
          position: absolute;
          inset: 0;
        }
      `}</style>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'black' }} />
      <div className="hue-animated-bg" />
    </div>
  );
};

/**
 * COMPONENT: CanvasTree
 */
const CanvasTree = ({ isGrowing, onTreeComplete }) => {
  const canvasRef = useRef(null);
  const activeAnimations = useRef(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isGrowing || !canvasRef.current || hasStarted.current) return;
    hasStarted.current = true;

    // Safety Fallback: Force text to show after 8 seconds if animation hangs
    const safetyTimer = setTimeout(() => {
       console.log("Tree animation took too long, forcing text reveal.");
       onTreeComplete();
    }, 1000);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Handle Retina displays for clearer lines
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    
    // Style for the canvas element itself to fit screen
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    ctx.globalCompositeOperation = 'lighter';
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const drawTree = (startX, startY, length, angle, depth, branchWidth) => {
      const rand = Math.random;
      const maxBranch = 3;
      const maxAngle = 2 * Math.PI / 4;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      const endX = startX + length * Math.cos(angle);
      const endY = startY + length * Math.sin(angle);
      
      ctx.lineCap = 'round';
      ctx.lineWidth = branchWidth;
      ctx.lineTo(endX, endY);

      if (depth <= 2) {
        // Cherry Blossom Pink/White/Purple
        const r = 255;
        const g = ((rand() * 100) + 100) >> 0;
        const b = ((rand() * 55) + 200) >> 0;
        ctx.strokeStyle = `rgb(${r},${g},${b})`;
      } else {
        // Dark Glow
        const r = ((rand() * 64) + 64) >> 0;
        ctx.strokeStyle = `rgb(${r}, 40, ${((rand() * 40) + 40) >> 0})`;
      }
      ctx.stroke();

      // Draw Cherries on branches (small red circles - sparse)
      if (depth <= 4 && rand() > 0.92) {
        const cherryRadius = 1.5 + rand() * 1;
        const cherryX = startX + (endX - startX) * (0.3 + rand() * 0.6);
        const cherryY = startY + (endY - startY) * (0.3 + rand() * 0.6);
        
        ctx.beginPath();
        ctx.arc(cherryX, cherryY, cherryRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${200 + rand() * 55}, ${10 + rand() * 30}, ${20 + rand() * 40}, 0.9)`;
        ctx.fill();
        
        // Cherry highlight for depth
        ctx.beginPath();
        ctx.arc(cherryX - cherryRadius * 0.35, cherryY - cherryRadius * 0.35, cherryRadius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 100, 150, 0.5)`;
        ctx.fill();
      }

      const newDepth = depth - 1;
      
      if (newDepth <= 0) return;

      const subBranches = maxBranch - 1;
      const nextBranchWidth = branchWidth * 0.7;

      for (let i = 0; i < subBranches; i++) {
        const newAngle = angle + rand() * maxAngle - maxAngle * 0.5;
        const newLength = length * (0.7 + rand() * 0.3);
        
        activeAnimations.current += 1;

        setTimeout(() => {
          if (canvasRef.current) { 
            drawTree(endX, endY, newLength, newAngle, newDepth, nextBranchWidth);
            activeAnimations.current -= 1;
            if (activeAnimations.current === 0) {
              clearTimeout(safetyTimer);
              onTreeComplete();
            }
          }
        }, 30); 
      }
    };

    activeAnimations.current += 1; 
    
    const isMobile = window.innerWidth < 768;
    const startX = isMobile ? window.innerWidth / 2 : window.innerWidth * 0.75;
    
    drawTree(
        ~~startX, 
        ~~(window.innerHeight / 1.02), 
        isMobile ? 50 : 90, 
        -Math.PI / 2, 
        14, 
        12
    );
    
    activeAnimations.current -= 1;
    return () => clearTimeout(safetyTimer);

  }, [isGrowing, onTreeComplete]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, touchAction: 'none' }}
    />
  );
};

/**
 * COMPONENT: TypewriterText
 */
const TypewriterText = ({ text, startDelay, onComplete }) => {
  const characters = Array.from(text);
  
  return (
    <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
            visible: { transition: { staggerChildren: 0.03, delayChildren: startDelay } }
        }}
        onAnimationComplete={onComplete}
        style={{ display: 'inline-block' }}
    >
        {characters.map((char, index) => (
            <motion.span
                key={index}
                variants={{
                    hidden: { opacity: 0, y: 5 },
                    visible: { opacity: 1, y: 0 }
                }}
            >
                {char}
            </motion.span>
        ))}
    </motion.div>
  );
};

/**
 * COMPONENT: GreetingArea
 * Rewritten to use INLINE STYLES to guarantee visibility without Tailwind.
 */
const GreetingArea = ({ show }) => {
  const [showHeader, setShowHeader] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if(!show) setShowHeader(false);
  }, [show]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!show) return null;

  return (
    <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: isMobile ? 'center' : 'flex-start',
        paddingLeft: isMobile ? '0' : '3%',
        paddingRight: isMobile ? '0' : '0',
        paddingTop: isMobile ? '3%' : '8%',
        paddingBottom: isMobile ? '0' : '0',
        pointerEvents: 'none',
        zIndex: 50 // High Z-Index ensures it sits on top of canvas
    }}>
      {/* Glass Panel */}
      <motion.div 
        initial={{ opacity: 0, x: isMobile ? 0 : -20, y: isMobile ? -20 : 0 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1 }}
        style={{
            maxWidth: isMobile ? '200px' : '450px',
            padding: isMobile ? '12px' : '25px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            textAlign: isMobile ? 'center' : 'left'
        }}
      >
        <div style={{ 
            fontFamily: 'Quicksand, sans-serif', 
            fontSize: isMobile ? '0.6rem' : '1rem', 
            lineHeight: isMobile ? '1.2' : '1.6', 
            marginBottom: isMobile ? '0.5rem' : '1.25rem', 
            color: '#fbcfe8', // Pink-100
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
            <TypewriterText 
                text={CONFIG.message} 
                startDelay={0.2}
                onComplete={() => setShowHeader(true)}
            />
        </div>

        {showHeader && (
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div style={{ width: '64px', height: '4px', backgroundColor: '#ec4899', borderRadius: '9999px', marginBottom: '1.5rem', boxShadow: '0 0 10px #ec4899' }} />
                <h1 style={{ 
                    fontFamily: '"Dancing Script", cursive', 
                    fontSize: isMobile ? '1.25rem' : '3.5rem', 
                    fontWeight: 'bold', 
                    color: '#f472b6', // Pink-400
                    margin: 0,
                    filter: 'drop-shadow(0 0 15px rgba(244,114,182,0.6))'
                }}>
                    {CONFIG.greeting}
                    <motion.span 
                        style={{ display: 'inline-block', marginLeft: '1rem' }}
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ delay: 1, duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                    >
                        🌸
                    </motion.span>
                </h1>
            </motion.div>
        )}
      </motion.div>
    </div>
  );
};

/**
 * MAIN APP COMPONENT
 */
export default function BirthdayExperience() {
  const [phase, setPhase] = useState('initial');
  const [targetX, setTargetX] = useState('50%');

  useEffect(() => {
    const updateTarget = () => {
        setTargetX(window.innerWidth < 768 ? '50%' : '75%');
    };
    updateTarget();
    window.addEventListener('resize', updateTarget);
    return () => window.removeEventListener('resize', updateTarget);
  }, []);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('dropping');
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDropComplete = () => {
    setPhase('growing');
  };

  const handleTreeComplete = useCallback(() => {
    // Small delay to ensure tree visuals settle before text pops
    setTimeout(() => {
        setPhase(prev => (prev === 'text-reveal' ? prev : 'text-reveal'));
    }, 500);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: 'black', userSelect: 'none' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Quicksand:wght@300;500;700&display=swap');
        body { margin: 0; padding: 0; background: black; }
      `}</style>

      <Background />

      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        
        {/* Ball Drop Animation */}
        <AnimatePresence>
          {phase === 'dropping' && (
            <motion.div
              style={{ 
                  position: 'absolute',
                  zIndex: 20,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  boxShadow: '0 0 25px rgba(244,114,182,0.9)',
                  backgroundColor: CONFIG.colors.ball,
                  bottom: '0', 
                  left: targetX, 
                  marginLeft: '-8px'
              }}
              initial={{ y: '-100vh', opacity: 1 }}
              animate={{ y: '-2vh' }} 
              exit={{ scale: 2, opacity: 0, duration: 0.5 }}
              transition={{ 
                type: "spring", 
                damping: 20, 
                stiffness: 100, 
                mass: 1 
              }}
              onAnimationComplete={handleDropComplete}
            />
          )}
        </AnimatePresence>

        {/* Impact Flash */}
        {phase === 'growing' && (
            <motion.div 
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: targetX,
                    transform: 'translateX(-50%)',
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(236, 72, 153, 0.4)',
                    filter: 'blur(60px)'
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />
        )}

        {/* The Canvas Tree */}
        <CanvasTree 
            isGrowing={phase === 'growing' || phase === 'text-reveal'} 
            onTreeComplete={handleTreeComplete}
        />

        {/* Greeting Text Overlay */}
        <GreetingArea show={phase === 'text-reveal'} />

      </div>
      
      {phase === 'text-reveal' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 3 }}
            style={{
                position: 'absolute',
                bottom: '1rem',
                left: 0,
                width: '100%',
                textAlign: 'center',
                fontSize: '0.75rem',
                color: '#f9a8d4',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                pointerEvents: 'none',
                zIndex: 50
            }}
          >
            Cherry Blossom Night
          </motion.div>
      )}
    </div>
  );
}