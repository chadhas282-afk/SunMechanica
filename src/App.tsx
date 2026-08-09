import React, { useState, useEffect, useRef } from 'react';
export interface SimulationProps {
  angle: number;
  load: number;
  zoom?: number;
}
export const ArchimedesScrewSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);
    const scale = (Math.min(width, height) / 16) * zoom; 
    const originX = width * 0.5;
    const originY = height * 0.6;
    ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }
    const toScreen = (x: number, y: number) => [originX + x * scale, originY - y * scale];
    const L = 12.0; 
    const Rp = 1.5; 
    const Rs = 0.5; 
    const pitch = 2.0; 
    const tilt = -Math.PI / 6; 
    ctx.save();
    const [ox, oy] = toScreen(0, 0);
    ctx.translate(ox, oy);
    ctx.rotate(-tilt); 
    ctx.fillStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.fillRect(-L/2 - 2*scale, 0, 4*scale, 5*scale);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect((-L/2) * scale, -Rp * scale, L * scale, 2 * Rp * scale);
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 4;
    ctx.strokeRect((-L/2) * scale, -Rp * scale, L * scale, 2 * Rp * scale);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect((-L/2) * scale, -Rs * scale, L * scale, 2 * Rs * scale);
    const k = (2 * Math.PI) / pitch;
    const phase = -angle;
    const numPoints = 200;
    const loadFactor = load / 100;
    const rC = Math.round(0 + loadFactor * 255);
    const gC = Math.round(212 - loadFactor * 100);
    const fluidColor = `rgba(${rC}, ${gC}, 255, 0.6)`;
    for (let i = 0; i < L/pitch; i++) {
      let px = (angle - Math.PI/2) / k + i * pitch;
      px = ((px + L/2) % L) - L/2;
      if (px > -L/2 && px < L/2) {
        ctx.beginPath();
        ctx.arc(px * scale, (Rp - 0.5)*scale, 0.8 * scale, 0, Math.PI, false);
        ctx.fillStyle = fluidColor;
         ctx.fill();
      }
    }
    ctx.beginPath();
    for (let i = 0; i <= numPoints; i++) {
      const x = -L/2 + (i / numPoints) * L;
      const val = Math.sin(k * x + phase);
      if (val > 0) { 
        const y = Rp * val;
        if (i === 0 || Math.sin(k * (-L/2 + ((i-1) / numPoints) * L) + phase) <= 0) {
          ctx.moveTo(x * scale, y * scale);
        } else {
          ctx.lineTo(x * scale, y * scale);
        }
      }
    }
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();
  }, [angle, load]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const AxialPistonPumpSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);
    const scale = (Math.min(width, height) / 16) * zoom; 
    const originX = width * 0.45;
    const originY = height * 0.5;
    ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }
    const toScreen = (x: number, y: number) => [originX + x * scale, originY - y * scale];
    const drawRect = (x: number, y: number, w: number, h: number, fill: string, stroke: string) => {
      const [sx, sy] = toScreen(x, y);
      ctx.fillStyle = fill; ctx.fillRect(sx, sy, w * scale, h * scale);
      ctx.strokeStyle = stroke; ctx.lineWidth = 2 * zoom; ctx.strokeRect(sx, sy, w * scale, h * scale);
    };
    const loadFactor = load / 100;
    const maxTilt = Math.PI / 6;
    const alpha = (loadFactor * 2 - 1) * maxTilt; 
    const R_pitch = 3.0; 
    const p1_dx = -R_pitch * Math.tan(alpha) * Math.cos(angle);
    const p2_dx = -R_pitch * Math.tan(alpha) * Math.cos(angle + Math.PI);
    const p_length = 4.0;
    const p_width = 1.6;
    const cyl_length = 6.0;
    const cyl_x = 2.0; 
    const p1_vel = R_pitch * Math.tan(alpha) * Math.sin(angle);
    const p2_vel = R_pitch * Math.tan(alpha) * Math.sin(angle + Math.PI);
    const getFluidColor = (vel: number) => {
      if (Math.abs(vel) < 0.1) return 'rgba(71, 85, 105, 0.5)'; 
      if (vel > 0) return 'rgba(0, 212, 255, 0.6)'; 
      return 'rgba(255, 51, 102, 0.8)'; 
    };
    ctx.fillStyle = '#94a3b8';
    const [sx, sy] = toScreen(-5, 0.4);
    ctx.fillRect(sx, sy, 7 * scale, 0.8 * scale);
    ctx.strokeStyle = '#475569'; ctx.strokeRect(sx, sy, 7 * scale, 0.8 * scale);
    ctx.save();
    const [spx, spy] = toScreen(0, 0);
    ctx.translate(spx, spy);
    ctx.rotate(alpha); 
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-0.5 * scale, -4 * scale, 1 * scale, 8 * scale);
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 3 * zoom;
    ctx.strokeRect(-0.5 * scale, -4 * scale, 1 * scale, 8 * scale);
    ctx.restore();
    drawRect(cyl_x, R_pitch + 1.2, cyl_length, -2*R_pitch - 2.4, 'rgba(15, 23, 42, 0.7)', '#334155');
    const drawPiston = (y: number, dx: number, vel: number) => {
      drawRect(cyl_x, y + p_width/2, cyl_length, -p_width, getFluidColor(vel), '#475569');
      const px = p1_dx === dx ? 0 + dx : 0 + dx; 
      drawRect(px, y + p_width/2 - 0.1, p_length, -p_width + 0.2, '#cbd5e1', '#64748b');
      const [sh_x, sh_y] = toScreen(px, y);
      ctx.beginPath();
      ctx.save();
      ctx.translate(sh_x, sh_y);
      ctx.rotate(alpha);
      ctx.fillStyle = '#ffb703';
      ctx.fillRect(-0.2*scale, -0.8*scale, 0.4*scale, 1.6*scale);
      ctx.restore();
    };
    drawPiston(R_pitch, p1_dx, p1_vel);
    drawPiston(-R_pitch, p2_dx, p2_vel);
    const vp_x = cyl_x + cyl_length;
    drawRect(vp_x, R_pitch + 1.2, 0.8, -2*R_pitch - 2.4, '#1e293b', '#94a3b8');
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    const strokeLen = Math.abs(2 * R_pitch * Math.tan(alpha));
    const flow = strokeLen * 50; 
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ffd700'; ctx.fillText('SYS :: AXIAL_PISTON_PUMP', 40, 170);
    ctx.fillStyle = '#fff'; ctx.fillText(`SWASH ANGLE : ${(alpha * 180 / Math.PI).toFixed(1)}°`, 40, 195);
    ctx.fillStyle = '#00d4ff'; ctx.fillText(`PISTON DISP : ${strokeLen.toFixed(2)} cm`, 40, 215);
    ctx.fillStyle = '#ff3366'; ctx.fillText(`OUTPUT FLOW : ${flow.toFixed(1)} L/min`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const BraytonCycleSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<{x: number, y: number, vx: number, color: string, active: boolean}[]>([]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const width = rect.width;
    const height = rect.height;
    ctx.clearRect(0, 0, width, height);
    const scale = (Math.min(width, height) / 16) * zoom; 
    const originX = width * 0.5;
    const originY = height * 0.5;
    ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }
    const toScreen = (x: number, y: number) => [originX + x * scale, originY - y * scale];
    const intakeX = -8;
    const compStart = -6;
    const compEnd = -1;
    const combStart = -1;
    const combEnd = 3;
    const turbStart = 3;
    const turbEnd = 5;
    const exhaustX = 8;
    const loadFactor = load / 100;
    if (Math.random() < 0.8) {
      particlesRef.current.push({
        x: intakeX,
        y: (Math.random() - 0.5) * 4,
        vx: 0.1,
        color: '#00d4ff',
        active: true
      });
    }
    const nextParticles = [];
    for (const p of particlesRef.current) {
      if (!p.active) continue;
      if (p.x >= compStart && p.x <= compEnd) {
        p.vx = 0.15;
        p.y *= 0.99;
      }
      if (p.x >= combStart && p.x <= combEnd) {
        if (load > 10 && Math.random() < loadFactor) {
          p.color = '#ff3366';
        }
        p.y *= 1.01;
        p.vx = 0.2 + (p.color === '#ff3366' ? loadFactor * 0.2 : 0);
      }
      if (p.x >= turbStart) {
         p.vx = 0.4 + (p.color === '#ff3366' ? loadFactor * 0.4 : 0);
        p.y *= 1.02;
      }
      p.x += p.vx;
      if (p.x < exhaustX + 2) nextParticles.push(p);
    }
    particlesRef.current = nextParticles;
    ctx.beginPath();
    const [c1tx, c1ty] = toScreen(intakeX, 2.5);
    ctx.moveTo(c1tx, c1ty);
    const [c2tx, c2ty] = toScreen(compStart, 2.5);
    ctx.lineTo(c2tx, c2ty);
    const [c3tx, c3ty] = toScreen(compEnd, 1.5);
    ctx.lineTo(c3tx, c3ty);
    const [c4tx, c4ty] = toScreen(combEnd, 1.5);
    ctx.lineTo(c4tx, c4ty);
    const [c5tx, c5ty] = toScreen(turbEnd, 2.5);
    ctx.lineTo(c5tx, c5ty);
    const [c6tx, c6ty] = toScreen(exhaustX, 2.0);
    ctx.lineTo(c6tx, c6ty);
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 4 * zoom; ctx.stroke();
    ctx.beginPath();
    const [c1bx, c1by] = toScreen(intakeX, -2.5);
    ctx.moveTo(c1bx, c1by);
    const [c2bx, c2by] = toScreen(compStart, -2.5);
    ctx.lineTo(c2bx, c2by);
    const [c3bx, c3by] = toScreen(compEnd, -1.5);
    ctx.lineTo(c3bx, c3by);
    const [c4bx, c4by] = toScreen(combEnd, -1.5);
    ctx.lineTo(c4bx, c4by);