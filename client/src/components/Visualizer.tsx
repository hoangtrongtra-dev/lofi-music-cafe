import React, { useEffect, useRef } from 'react';
import { PlayerState } from '../types/Track';

interface VisualizerProps {
  playerState: PlayerState;
  type?: 'bars' | 'waveform' | 'particles';
}

const Visualizer: React.FC<VisualizerProps> = ({ playerState, type = 'bars' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize audio context for real-time analysis
    if (!audioContextRef.current && playerState.isPlaying) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
      } catch (error) {
        console.warn('Web Audio API not supported');
      }
    }

    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
    }> = [];

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (playerState.isPlaying && playerState.currentTrack) {
        const trackColor = playerState.currentTrack.color || '#8B5CF6';
        const time = Date.now() * 0.001;

        if (type === 'bars' && analyserRef.current && dataArrayRef.current) {
          // Real-time frequency bars
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          const barWidth = canvas.width / dataArrayRef.current.length;
          
          for (let i = 0; i < dataArrayRef.current.length; i++) {
            const barHeight = (dataArrayRef.current[i] / 255) * canvas.height * 0.8;
            const hue = (i / dataArrayRef.current.length) * 360;
            
            ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
            ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
          }
        } else if (type === 'particles') {
          // Add new particles
          if (Math.random() < 0.3) {
            particles.push({
              x: Math.random() * canvas.width,
              y: canvas.height,
              vx: (Math.random() - 0.5) * 2,
              vy: -Math.random() * 3 - 1,
              life: 0,
              maxLife: 60 + Math.random() * 60,
              size: Math.random() * 4 + 2
            });
          }

          // Update and draw particles
          particles = particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life++;
            
            const alpha = 1 - (particle.life / particle.maxLife);
            ctx.fillStyle = `${trackColor}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
            ctx.fill();
            
            return particle.life < particle.maxLife;
          });
        } else {
          // Waveform visualization
          const amplitude = Math.sin(time * 2) * 0.3 + 0.7;
          ctx.strokeStyle = trackColor;
          ctx.lineWidth = 2;
          ctx.beginPath();
          
          for (let x = 0; x < canvas.width; x += 2) {
            const y = canvas.height / 2 + Math.sin((x + time * 100) * 0.01) * amplitude * 50;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
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
  }, [playerState.isPlaying, playerState.currentTrack, type]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-32 rounded-lg bg-black/20 backdrop-blur-sm"
    />
  );
};

export default Visualizer;