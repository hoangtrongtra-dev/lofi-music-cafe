import React, { useEffect, useRef } from 'react';
import { PlayerState } from '../types/Track';

interface BackgroundVisualizerProps {
  playerState: PlayerState;
}

const BackgroundVisualizer: React.FC<BackgroundVisualizerProps> = ({ playerState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;
    const animate = () => {
      time += 0.01;
      
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (playerState.isPlaying && playerState.currentTrack) {
        // Get track color or use default
        const trackColor = playerState.currentTrack.color || '#8B5CF6';
        
        // Convert hex to RGB
        const hex = trackColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        // Create animated gradient based on music
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
        );

        const intensity = Math.sin(time * 2) * 0.3 + 0.7;
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.1 * intensity})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${0.05 * intensity})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add floating particles
        for (let i = 0; i < 20; i++) {
          const x = canvas.width / 2 + Math.sin(time + i) * (200 + i * 10);
          const y = canvas.height / 2 + Math.cos(time + i * 0.5) * (150 + i * 8);
          const radius = Math.sin(time + i) * 2 + 3;
          const opacity = Math.sin(time + i) * 0.3 + 0.3;

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx.fill();
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [playerState.isPlaying, playerState.currentTrack]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        opacity: 0.6
      }}
    />
  );
};

export default BackgroundVisualizer;