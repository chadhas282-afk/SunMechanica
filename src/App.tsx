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
    const [c5bx, c5by] = toScreen(turbEnd, -2.5);
    ctx.lineTo(c5bx, c5by);
    const [c6bx, c6by] = toScreen(exhaustX, -2.0);
    ctx.lineTo(c6bx, c6by);
    ctx.stroke();
    for(const p of particlesRef.current) {
      const [px, py] = toScreen(p.x, p.y);
      ctx.beginPath(); ctx.arc(px, py, 0.1 * scale, 0, 2*Math.PI);
      ctx.fillStyle = p.color; ctx.fill();
    }
    ctx.beginPath();
    const [s1x, s1y] = toScreen(compStart, 0.2);
    const [s2x, s2y] = toScreen(turbEnd, 0.2);
    const [s3x, s3y] = toScreen(turbEnd, -0.2);
    const [s4x, s4y] = toScreen(compStart, -0.2);
    ctx.moveTo(s1x, s1y); ctx.lineTo(s2x, s2y); ctx.lineTo(s3x, s3y); ctx.lineTo(s4x, s4y); ctx.closePath();
    ctx.fillStyle = '#94a3b8'; ctx.fill();
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 2 * zoom; ctx.stroke();
    const numCompStages = 5;
    for(let i=0; i<numCompStages; i++) {
      const x = compStart + (i + 0.5) * ((compEnd - compStart)/numCompStages);
      const h = 2.5 - (i/numCompStages) * 1.0;
      ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 3 * zoom;
      const [rx1, ry1] = toScreen(x, h);
      const [rx2, ry2] = toScreen(x, 0.2);
      ctx.beginPath(); ctx.moveTo(rx1, ry1); ctx.lineTo(rx2, ry2); ctx.stroke();
      const [rx3, ry3] = toScreen(x, -h);
      const [rx4, ry4] = toScreen(x, -0.2);
      ctx.beginPath(); ctx.moveTo(rx3, ry3); ctx.lineTo(rx4, ry4); ctx.stroke();
      const sx = x + 0.3;
      ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2 * zoom;
      const [st1x, st1y] = toScreen(sx, h - 0.1);
      const [st2x, st2y] = toScreen(sx, 0.3);
      ctx.beginPath(); ctx.moveTo(st1x, st1y); ctx.lineTo(st2x, st2y); ctx.stroke();
      const [st3x, st3y] = toScreen(sx, -h + 0.1);
      const [st4x, st4y] = toScreen(sx, -0.3);
      ctx.beginPath(); ctx.moveTo(st3x, st3y); ctx.lineTo(st4x, st4y); ctx.stroke();
    }
    const drawInjector = (y: number) => {
      const [ix, iy] = toScreen(combStart + 0.5, y);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(ix - 0.1*scale, iy - 0.2*scale, 0.4*scale, 0.4*scale);
      if (load > 10) {
        ctx.beginPath();
        ctx.moveTo(ix + 0.3*scale, iy);
        ctx.lineTo(ix + 1.5*scale + Math.random()*scale, iy - 0.3*scale);
        ctx.lineTo(ix + 2.0*scale + Math.random()*scale, iy);
        ctx.lineTo(ix + 1.5*scale + Math.random()*scale, iy + 0.3*scale);
        ctx.fillStyle = `rgba(255, 51, 102, ${0.5 * loadFactor})`;
        ctx.fill();
        ctx.shadowBlur = 10; ctx.shadowColor = '#ff3366'; ctx.fill(); ctx.shadowBlur = 0;
      }
    };
    drawInjector(0.8);
    drawInjector(-0.8);
    const numTurbStages = 2;
    for(let i=0; i<numTurbStages; i++) {
      const x = turbStart + (i + 0.5) * ((turbEnd - turbStart)/numTurbStages);
      const h = 1.8 + (i/numTurbStages) * 0.7;
      ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 5 * zoom;
      const [rx1, ry1] = toScreen(x, h);
      const [rx2, ry2] = toScreen(x, 0.2);
      ctx.beginPath(); ctx.moveTo(rx1, ry1); ctx.lineTo(rx2, ry2); ctx.stroke();
      const [rx3, ry3] = toScreen(x, -h);
      const [rx4, ry4] = toScreen(x, -0.2);
      ctx.beginPath(); ctx.moveTo(rx3, ry3); ctx.lineTo(rx4, ry4); ctx.stroke();
    }
    ctx.font = `${10*zoom}px monospace`; ctx.fillStyle = '#94a3b8';
    const [l1x, l1y] = toScreen(-4.5, 3.0); ctx.fillText('COMPRESSOR', l1x, l1y);
    const [l2x, l2y] = toScreen(0, 3.0); ctx.fillText('COMBUSTOR', l2x, l2y);
    const [l3x, l3y] = toScreen(4, 3.0); ctx.fillText('TURBINE', l3x, l3y);
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(255, 51, 102, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    const rpm = (angle * 180 / Math.PI * 10).toFixed(0);
    const thrust = (loadFactor * 100).toFixed(1);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ff3366'; ctx.fillText('SYS :: BRAYTON_CYCLE', 40, 170);
    ctx.fillStyle = '#fff'; ctx.fillText(`SHAFT SPEED : ${rpm} RPM`, 40, 195);
    ctx.fillStyle = '#f59e0b'; ctx.fillText(`FUEL FLOW   : ${(loadFactor * 100).toFixed(0)} %`, 40, 215);
    ctx.fillStyle = '#00ff88'; ctx.fillText(`NET THRUST  : ${thrust} kN`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const CVTTransmissionSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastAngle = useRef(angle);
  const drivenAngle = useRef(0);
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
    const d = 6.0; 
    const driveX = -d/2;
    const drivenX = d/2;
    const loadFactor = load / 100;
    const r1 = 1.5 + loadFactor * 3.0;
    const r2 = 6.0 - r1;
    const dAngle = angle - lastAngle.current;
    lastAngle.current = angle;
    drivenAngle.current += dAngle * (r1 / r2);
    const drawPulley = (x: number, r: number, rot: number, color: string, isDrive: boolean) => {
      const [sx, sy] = toScreen(x, 0);
      ctx.beginPath();
      ctx.arc(sx, sy, r * scale, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'; ctx.fill();
      ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.stroke();
      ctx.beginPath();
      ctx.arc(sx, sy, 4.5 * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 1; ctx.setLineDash([5, 5]); ctx.stroke();
      ctx.setLineDash([]);
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(-rot);
      ctx.strokeStyle = color; ctx.lineWidth = 4;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.lineTo(r * scale * Math.cos(i * 2*Math.PI/3), r * scale * Math.sin(i * 2*Math.PI/3));
        ctx.stroke();
      }
      ctx.restore();
      ctx.beginPath(); ctx.arc(sx, sy, 0.4 * scale, 0, 2 * Math.PI);
      ctx.fillStyle = isDrive ? '#3b82f6' : '#00ff88'; ctx.fill();
    };
    const sinTheta = (r1 - r2) / d;
    const theta = Math.asin(sinTheta);
    const t1x = driveX + r1 * Math.sin(theta);
    const t1y = r1 * Math.cos(theta); 
    const t2x = drivenX + r2 * Math.sin(theta);
    const t2y = r2 * Math.cos(theta);
    const b1x = driveX - r1 * Math.sin(theta);
    const b1y = -r1 * Math.cos(theta);
    const b2x = drivenX - r2 * Math.sin(theta);
    const b2y = -r2 * Math.cos(theta);
    const [st1x, st1y] = toScreen(t1x, t1y);
    const [st2x, st2y] = toScreen(t2x, t2y);
    const [sb1x, sb1y] = toScreen(b1x, b1y);
    const [sb2x, sb2y] = toScreen(b2x, b2y);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(st1x, st1y); ctx.lineTo(st2x, st2y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sb1x, sb1y); ctx.lineTo(sb2x, sb2y); ctx.stroke();
    const rC = Math.round(loadFactor * 255);
    const gC = Math.round(255 - loadFactor * 100);
    const driveColor = `rgb(${rC}, ${gC}, 255)`; 
    drawPulley(driveX, r1, angle, driveColor, true);
    drawPulley(drivenX, r2, drivenAngle.current, '#00ff88', false);
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#00ff88';
    ctx.fillText('SYS :: CVT_TRANSMISSION', 40, 170);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`DRIVE RAD  : ${r1.toFixed(2)} cm`, 40, 195);
    ctx.fillStyle = '#fff';
    ctx.fillText(`DRIVEN RAD : ${r2.toFixed(2)} cm`, 40, 215);
    ctx.fillStyle = '#ffb703';
    ctx.fillText(`GEAR RATIO : ${(r1/r2).toFixed(2)} : 1`, 40, 235);
  }, [angle, load]);
  const b2x = drivenX - r2 * Math.sin(theta);
    const b2y = -r2 * Math.cos(theta);
    const [st1x, st1y] = toScreen(t1x, t1y);
    const [st2x, st2y] = toScreen(t2x, t2y);
    const [sb1x, sb1y] = toScreen(b1x, b1y);
    const [sb2x, sb2y] = toScreen(b2x, b2y);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(st1x, st1y); ctx.lineTo(st2x, st2y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sb1x, sb1y); ctx.lineTo(sb2x, sb2y); ctx.stroke();
    const rC = Math.round(loadFactor * 255);
    const gC = Math.round(255 - loadFactor * 100);
    const driveColor = `rgb(${rC}, ${gC}, 255)`; 
    drawPulley(driveX, r1, angle, driveColor, true);
    drawPulley(drivenX, r2, drivenAngle.current, '#00ff88', false);
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#00ff88';
    ctx.fillText('SYS :: CVT_TRANSMISSION', 40, 170);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`DRIVE RAD  : ${r1.toFixed(2)} cm`, 40, 195);
    ctx.fillStyle = '#fff';
    ctx.fillText(`DRIVEN RAD : ${r2.toFixed(2)} cm`, 40, 215);
    ctx.fillStyle = '#ffb703';
    ctx.fillText(`GEAR RATIO : ${(r1/r2).toFixed(2)} : 1`, 40, 235);
  }, [angle, load]);
  ctx.fillStyle = '#050d1a';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
    }
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
    }
    const toScreen = (x: number, y: number) => [originX + x * scale, originY - y * scale];
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    const [gx1, gyBot] = toScreen(-0.6, 2.5);
    const [, gyTop] = toScreen(-0.6, 5.0);
    const [gx2] = toScreen(0.6, 2.5);
    ctx.beginPath(); ctx.moveTo(gx1, gyBot); ctx.lineTo(gx1, gyTop); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(gx2, gyBot); ctx.lineTo(gx2, gyTop); ctx.stroke();
    const [sx, syBot] = toScreen(0, followerY + 0.5);
    const [, syTop] = toScreen(0, 4.5);
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sx, syBot);
    const numCoils = 6;
    const springLen = syTop - syBot;
    for (let i = 0; i <= numCoils * 2; i++) {
      const y = syBot + (i / (numCoils * 2)) * springLen;
      const x = sx + (i % 2 === 0 ? 0 : (i % 4 === 1 ? 15 : -15));
      ctx.lineTo(x, y);
      }
    ctx.stroke();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = Math.max(6, scale * 0.15);
    const [rx, ry1] = toScreen(0, followerY);
    const [, ry2] = toScreen(0, 5.0);
    ctx.beginPath(); ctx.moveTo(rx, ry1); ctx.lineTo(rx, ry2); ctx.stroke();
    ctx.beginPath();
    ctx.arc(rx, ry1, followerR * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(rx, ry1, 0.1 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const theta = (i / 100) * Math.PI * 2;
      const r = getCamRadius(theta);
      const worldTheta = theta + angle;
      const x = r * Math.cos(worldTheta);
      const y = r * Math.sin(worldTheta);
      const [cx, cy] = toScreen(x, y);
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.fillStyle = `rgba(59, 130, 246, ${0.2 + (load/100)*0.2})`;
    ctx.fill();
    ctx.strokeStyle = load > 70 ? '#ef4444' : '#3b82f6';
    ctx.lineWidth = 3 + (load/100)*2;
    if (load > 60) {
      ctx.shadowBlur = load - 60;
      ctx.shadowColor = '#ef4444';
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(originX, originY, 0.3 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#1e3a8a';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(width - 260, 150, 200, 110);
    ctx.strokeStyle = 'rgba(255, 107, 53, 0.3)';
    ctx.strokeRect(width - 260, 150, 200, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ff6b35';
    ctx.fillText('SYS :: CAM_FOLLOWER', width - 250, 170);
    ctx.fillStyle = '#fff';
    const normAngle = ((angle * 180 / Math.PI) % 360 + 360) % 360;
    ctx.fillText(`CAM ANGLE: ${normAngle.toFixed(1)}°`, width - 250, 195);
    ctx.fillStyle = '#00ff88';
    ctx.fillText(`LIFT     : ${(rAtTop - 1.5).toFixed(2)}`, width - 250, 215);
    ctx.fillStyle = '#ff6b35';
    ctx.fillText(`LOAD     : ${load}%`, width - 250, 235);