declare module 'react-confetti-canvas' {
  interface ConfettiCanvasProps {
    paperCount?: number;
    ribbonParticleCount?: number;
    duration?: number;
    spread?: number;
    startVelocity?: number;
    ribbonParticleDrag?: number;
    className?: string;
    colors?: string[] | string[][];
  }

  const ConfettiCanvas: React.FC<ConfettiCanvasProps>;
  export default ConfettiCanvas;
} 