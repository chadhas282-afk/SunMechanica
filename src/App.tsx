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
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const CamFollowerSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const scale = (Math.min(width, height) / 10) * zoom; 
    const originX = width * 0.5;
    const originY = height * 0.7;
    const lift = 1.0 + load * 0.01;
    const getCamRadius = (theta: number) => {
      const baseR = 1.5;
      const profile = Math.pow(Math.max(0, Math.cos(theta)), 2.5);
      return baseR + lift * profile;
    };
    const topAngle = Math.PI / 2 - angle;
    const rAtTop = getCamRadius(topAngle);
    const followerR = 0.4;
    const followerY = rAtTop + followerR;
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
  }, [angle, load]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
export const CantileverBeamSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const originX = width * 0.2; 
    const originY = height * 0.5;
    ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }
    const toScreen = (x: number, y: number) => [originX + x * scale, originY - y * scale];
    const L = 10.0;
    const h = 2.0; 
    const loadFactor = load / 100;
    const dynamicLoad = loadFactor * (1.0 + 0.1 * Math.sin(angle * 8.0));
    const maxDeflect = 4.0 * dynamicLoad; 
    const numPoints = 100;
    const topPoints = [];
    const botPoints = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * L;
      const xL = x / L;
      const y0 = -maxDeflect * xL * xL * (3 - xL) / 2;
      const slope = -maxDeflect * (6 * L * x - 3 * x * x) / (2 * L * L * L);
      const theta = Math.atan(slope);
      const xt = x - (h/2) * Math.sin(theta);
      const yt = y0 + (h/2) * Math.cos(theta);
      const xb = x + (h/2) * Math.sin(theta);
      const yb = y0 - (h/2) * Math.cos(theta);
      topPoints.push([xt, yt]);
      botPoints.push([xb, yb]);
    }
    ctx.fillStyle = '#475569';
    const [wx, wy] = toScreen(0, 0);
    ctx.fillRect(wx - 40, wy - 4 * scale, 40, 8 * scale);
    const grad = ctx.createLinearGradient(0, wy - (h/2)*scale, 0, wy + (h/2)*scale);
    const rC = Math.round(255 * loadFactor);
    const bC = Math.round(255 * loadFactor);
    grad.addColorStop(0, `rgb(${148 - bC/2}, ${163}, ${184 + bC})`); 
    grad.addColorStop(0.5, '#94a3b8'); 
    grad.addColorStop(1, `rgb(${148 + rC}, ${163 - rC/2}, ${184 - rC/2})`); 
    ctx.beginPath();
    topPoints.forEach((pt, i) => {
      const [px, py] = toScreen(pt[0], pt[1]);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    for (let i = numPoints; i >= 0; i--) {
      const pt = botPoints[i];
      const [px, py] = toScreen(pt[0], pt[1]);
      ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = grad;
    if (loadFactor > 0.5) {
      ctx.shadowBlur = (loadFactor - 0.5) * 30;
      ctx.shadowColor = `rgb(${rC}, 0, ${bC})`;
    }
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;
    if (loadFactor > 0) {
      const [fx, fy] = toScreen(L, -maxDeflect + (h/2));
      const arrowLen = 20 + loadFactor * 80;
      ctx.beginPath();
      ctx.moveTo(fx, fy - arrowLen - 20); 
      ctx.lineTo(fx, fy - 20);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(fx, fy - 20);
      ctx.lineTo(fx - 10, fy - 35);
      ctx.lineTo(fx + 10, fy - 35);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
    }
  }, [angle, load]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const CarnotCycleSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const originY = height * 0.5;
    ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }
    const toScreen = (x: number, y: number) => [originX + x * scale, originY - y * scale];
    const cyclePhase = ((angle / 4.0) % 1.0 + 1.0) % 1.0; 
    const g = 1.4; 
    const V1 = 1.5, P1 = 120.0, TH = P1 * V1;
    const V2 = 3.0, P2 = TH / V2;
    const V3 = 6.0, P3 = P2 * Math.pow(V2/V3, g), TC = P3 * V3;
    const V4 = 3.0, P4 = TC / V4;
    let V = 0, P = 0, T = 0;
    let phaseName = "";
    if (cyclePhase < 0.25) {
      phaseName = "ISOTHERMAL EXPANSION";
      const t = cyclePhase / 0.25;
      V = V1 + t * (V2 - V1);
      T = TH;
      P = T / V;
    } else if (cyclePhase < 0.5) {
      phaseName = "ADIABATIC EXPANSION";
      const t = (cyclePhase - 0.25) / 0.25;
      V = V2 + t * (V3 - V2);
      P = P2 * Math.pow(V2 / V, g);
      T = P * V;
    } else if (cyclePhase < 0.75) {
      phaseName = "ISOTHERMAL COMPRESSION";
      const t = (cyclePhase - 0.5) / 0.25;
      V = V3 + t * (V4 - V3);
      T = TC;
      P = T / V;
       } else {
      phaseName = "ADIABATIC COMPRESSION";
      const t = (cyclePhase - 0.75) / 0.25;
      V = V4 + t * (V1 - V4);
      P = P4 * Math.pow(V4 / V, g);
      T = P * V;
    }
    const graphOriginX = originX + 2 * scale;
    const graphOriginY = originY + 4 * scale;
    ctx.beginPath();
    ctx.moveTo(graphOriginX, graphOriginY - 8 * scale);
    ctx.lineTo(graphOriginX, graphOriginY);
    ctx.lineTo(graphOriginX + 6 * scale, graphOriginY);
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath();
    const mapPV = (v: number, p: number) => [graphOriginX + (v/8) * 6 * scale, graphOriginY - (p/130) * 8 * scale];
    for (let i = 0; i <= 100; i++) {
      const cP = i / 100;
      let vT = 0, pT = 0;
      if (cP < 0.25) { vT = V1 + (cP/0.25)*(V2-V1); pT = TH / vT; }
      else if (cP < 0.5) { vT = V2 + ((cP-0.25)/0.25)*(V3-V2); pT = P2 * Math.pow(V2/vT, g); }
      else if (cP < 0.75) { vT = V3 + ((cP-0.5)/0.25)*(V4-V3); pT = TC / vT; }
      else { vT = V4 + ((cP-0.75)/0.25)*(V1-V4); pT = P4 * Math.pow(V4/vT, g); }
      const [gx, gy] = mapPV(vT, pT);
      if (i === 0) ctx.moveTo(gx, gy); else ctx.lineTo(gx, gy);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    const [currX, currY] = mapPV(V, P);
    ctx.beginPath(); ctx.arc(currX, currY, 4, 0, 2*Math.PI);
    ctx.fillStyle = '#ff6b35'; ctx.fill();
    const pWidth = 3.0 * scale;
    const pHeight = 8.0 * scale;
    const [cylX, cylY] = toScreen(-5, -4); 
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.strokeRect(cylX, cylY, pWidth, pHeight);
    const T_norm = (T - TC) / (TH - TC); 
    const rC = Math.round(100 + T_norm * 155);
    const bC = Math.round(255 - T_norm * 200);
    const gasColor = `rgba(${rC}, 50, ${bC}, 0.7)`;
    const vNorm = V / 6.0; 
    const currentGasHeight = pHeight * vNorm;
    ctx.fillStyle = gasColor;
    ctx.fillRect(cylX + 2, cylY + pHeight - currentGasHeight, pWidth - 4, currentGasHeight);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(cylX, cylY + pHeight - currentGasHeight - 1*scale, pWidth, 1*scale);
    ctx.strokeRect(cylX, cylY + pHeight - currentGasHeight - 1*scale, pWidth, 1*scale);
    if (cyclePhase < 0.25) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.moveTo(cylX + pWidth/2, cylY + pHeight + 20); ctx.lineTo(cylX + pWidth/2 - 10, cylY + pHeight + 40); ctx.lineTo(cylX + pWidth/2 + 10, cylY + pHeight + 40); ctx.fill();
      ctx.fillText("Q in (T_H)", cylX + pWidth/2 + 20, cylY + pHeight + 35);
    } else if (cyclePhase >= 0.5 && cyclePhase < 0.75) {
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath(); ctx.moveTo(cylX + pWidth/2, cylY + pHeight + 40); ctx.lineTo(cylX + pWidth/2 - 10, cylY + pHeight + 20); ctx.lineTo(cylX + pWidth/2 + 10, cylY + pHeight + 20); ctx.fill();
      ctx.fillText("Q out (T_C)", cylX + pWidth/2 + 20, cylY + pHeight + 35);
       }
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(255, 107, 53, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ff6b35';
    ctx.fillText('SYS :: CARNOT_HEAT_ENGINE', 40, 170);
    ctx.fillStyle = '#fff';
    ctx.fillText(`PHASE : ${phaseName}`, 40, 195);
    ctx.fillStyle = '#00d4ff';
    ctx.fillText(`VOLUME: ${V.toFixed(2)} m³`, 40, 215);
    ctx.fillStyle = `rgb(${rC}, 50, ${bC})`;
    ctx.fillText(`TEMP  : ${T.toFixed(1)} K`, 40, 235);
  }, [angle, load]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const CentrifugalGovernorSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const originY = height * 0.8; 
    ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }
    const toScreen = (x: number, y: number) => [originX + x * scale, originY - y * scale];
    const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, w: number) => {
      ctx.beginPath();
      const [sx1, sy1] = toScreen(x1, y1); const [sx2, sy2] = toScreen(x2, y2);
      ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2);
      ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke();
    };
    const drawCircle = (x: number, y: number, r: number, color: string, fill = false) => {
      ctx.beginPath(); const [sx, sy] = toScreen(x, y);
      ctx.arc(sx, sy, r * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      if (fill) { ctx.fillStyle = color; ctx.fill(); }
    };
    const L = 4.0; 
    const topY = 10.0;
    const rpmFactor = load / 100;
    const theta = 0.26 + rpmFactor * 1.04;
    const rot = angle;
    const rCurrent = L * Math.sin(theta);
    const mY = topY - L * Math.cos(theta);
    const collarY = topY - 2 * L * Math.cos(theta);
    const m1X = rCurrent * Math.cos(rot);
    const m1Z = rCurrent * Math.sin(rot);
    const m2X = rCurrent * Math.cos(rot + Math.PI);
    const m2Z = rCurrent * Math.sin(rot + Math.PI);
    const masses = [
      { x: m1X, z: m1Z, isFront: m1Z > 0 },
      { x: m2X, z: m2Z, isFront: m2Z > 0 }
    ];
    masses.sort((a, b) => a.z - b.z);
    drawLine(0, 0, 0, topY + 1.0, '#334155', 12);
    drawLine(0, 0, 0, topY + 1.0, '#475569', 6);
    drawCircle(0, topY, 0.4, '#1e293b', true);
    drawCircle(0, topY, 0.2, '#fff', true);
    const drawArmMass = (m: any) => {
      const color = m.isFront ? '#ff3366' : '#9f1239'; 
      const armColor = m.isFront ? '#cbd5e1' : '#64748b';
      drawLine(0, topY, m.x, mY, armColor, m.isFront ? 6 : 4);
      drawLine(m.x, mY, 0, collarY, armColor, m.isFront ? 6 : 4);
      ctx.beginPath();
      const [sx, sy] = toScreen(m.x, mY);
      const radius = (0.8 + m.z * 0.1) * scale;
      ctx.arc(sx, sy, radius, 0, 2*Math.PI);
      ctx.fillStyle = color; ctx.fill();
      if (m.isFront && load > 50) {
        ctx.shadowBlur = (load - 50) * 0.4;
        ctx.shadowColor = '#ff3366';
        ctx.stroke(); ctx.shadowBlur = 0;
      }
    };
    drawArmMass(masses[0]);
    const [cx, cy] = toScreen(0, collarY);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - 1*scale, cy - 0.5*scale, 2*scale, 1*scale);
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 3;
    ctx.strokeRect(cx - 1*scale, cy - 0.5*scale, 2*scale, 1*scale);
    drawLine(-1.0, collarY, -4.0, collarY, '#94a3b8', 4);
    drawLine(-4.0, collarY, -4.0, collarY - 3.0, '#94a3b8', 4);
    drawArmMass(masses[1]);
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(255, 51, 102, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ff3366';
    ctx.fillText('SYS :: CENTRIFUGAL_GOVERNOR', 40, 170);
    ctx.fillStyle = '#fff';
    ctx.fillText(`SYSTEM RPM : ${(rpmFactor * 1200).toFixed(0)}`, 40, 195);
    ctx.fillStyle = '#00d4ff';
    ctx.fillText(`COLLAR LIFT: ${(collarY - (topY - 2*L)).toFixed(2)} cm`, 40, 215);
    ctx.fillStyle = '#ffb703';
    ctx.fillText(`THROTTLE % : ${(rpmFactor * 100).toFixed(1)}%`, 40, 235);
  }, [angle, load]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const CentrifugalImpellerSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<{r: number, t: number, speed: number}[]>([]);
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
    const R_in = 1.0;
    const R_out = 3.5;
    const numBlades = 6;
    const voluteBase = 3.8;
    const voluteGrow = 2.0; 
    const loadFactor = load / 100;
    const flowRate = 1 + loadFactor * 4;
    for (let i = 0; i < flowRate; i++) {
      particlesRef.current.push({
        r: Math.random() * 0.5,
        t: Math.random() * 2 * Math.PI,
        speed: 0.1 + Math.random() * 0.1
        });
    }
    const nextParticles = [];
    for (const p of particlesRef.current) {
      if (p.r < R_out) {
        p.r += 0.05 * (1 + loadFactor);
        p.t += 0.1 * (1 + loadFactor); 
      } else {
        p.t += 0.05 * (1 + loadFactor) * (voluteBase / p.r);
        p.r += 0.02 * (1 + loadFactor);
      }
      let kill = false;
      if (p.r > voluteBase && Math.sin(p.t) > 0.8 && Math.cos(p.t) > 0) {
        p.r += 0.2; 
        if (p.r > 8) kill = true;
      } else if (p.r > voluteBase * 1.5) {
        kill = true;
      }
      if (!kill) nextParticles.push(p);
    }
    particlesRef.current = nextParticles;
    ctx.beginPath();
    const cw_x = voluteBase * Math.cos(Math.PI/2 - 0.2);
    const cw_y = voluteBase * Math.sin(Math.PI/2 - 0.2);
    const [scw_x, scw_y] = toScreen(cw_x, cw_y);
    ctx.moveTo(scw_x, scw_y);
    for(let i=0; i<=100; i++) {
      const th = Math.PI/2 - 0.2 + (i/100) * 2 * Math.PI;
      const rad = voluteBase + (i/100) * voluteGrow;
      const [px, py] = toScreen(rad * Math.cos(th), rad * Math.sin(th));
       ctx.lineTo(px, py);
    }
    const disX_right = voluteBase + voluteGrow;
    const disY_right = 6.0;
    const [sdr_x, sdr_y] = toScreen(disX_right, disY_right);
    ctx.lineTo(sdr_x, sdr_y);
    const disX_left = voluteBase * 0.8;
    const disY_left = 6.0;
    const [sdl_x, sdl_y] = toScreen(disX_left, disY_left);
    ctx.lineTo(sdl_x, sdl_y);
    ctx.lineTo(scw_x, scw_y);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fill();
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 6 * zoom; ctx.stroke();
    ctx.fillStyle = `rgba(0, 212, 255, ${0.4 + loadFactor*0.4})`;
    for(const p of particlesRef.current) {
      const px = p.r * Math.cos(p.t);
      const py = p.r * Math.sin(p.t);
      const [spx, spy] = toScreen(px, py);
      ctx.beginPath(); ctx.arc(spx, spy, 0.1 * scale, 0, 2*Math.PI);
      ctx.fill();
    }
    ctx.save();
    const [ox, oy] = toScreen(0, 0);
    ctx.translate(ox, oy);
    ctx.rotate(-angle);
    ctx.beginPath(); ctx.arc(0, 0, R_out * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#1e293b'; ctx.fill();
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 2 * zoom; ctx.stroke();
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 5 * zoom;
    ctx.lineCap = 'round';
    if (load > 50) {
      ctx.shadowBlur = (load - 50) * 0.3;
      ctx.shadowColor = '#00d4ff';
    }
    for(let i=0; i<numBlades; i++) {
      const baseAng = i * (2*Math.PI/numBlades);
      ctx.beginPath();
      for(let r=R_in; r<=R_out; r+=0.2) {
        const bend = baseAng + 0.5 * (r - R_in); 
        const px = r * scale * Math.cos(bend);
        const py = -r * scale * Math.sin(bend);
        if (r === R_in) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(0, 0, R_in * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#3b82f6'; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 0.3 * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#fff'; ctx.fill();
    ctx.restore();
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    const pressure = 14.7 + loadFactor * 80;
    ctx.font = '10px monospace';
    ctx.fillStyle = '#00d4ff'; ctx.fillText('SYS :: CENTRIFUGAL_IMPELLER', 40, 170);
    ctx.fillStyle = '#fff'; ctx.fillText(`IMPELLER RPM : ${(angle * 180 / Math.PI).toFixed(0)}`, 40, 195);
    ctx.fillStyle = '#3b82f6'; ctx.fillText(`FLOW RATE    : ${(flowRate * 12).toFixed(0)} GPM`, 40, 215);
    ctx.fillStyle = '#00ff88'; ctx.fillText(`HEAD PRESS   : ${pressure.toFixed(1)} PSI`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const ChebyshevStraightLineSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const traceRef = useRef<{x: number, y: number}[]>([]);
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
    const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, w: number) => {
      ctx.beginPath();
      const [sx1, sy1] = toScreen(x1, y1); const [sx2, sy2] = toScreen(x2, y2);
      ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2);
      ctx.strokeStyle = color; ctx.lineWidth = w * zoom; ctx.lineCap = 'round'; ctx.stroke();
    };
    const A = 2.0; 
    const Pin1 = [-A, 0]; 
    const Pin2 = [A, 0];  
    const rCrank = 1.0 * A;
    const lCoupler = 2.5 * A;
    const lRocker = 2.5 * A;
    const D = [Pin1[0] + rCrank * Math.cos(angle), Pin1[1] + rCrank * Math.sin(angle)];
    const dx = Pin2[0] - D[0];
    const dy = Pin2[1] - D[1];
    const d = Math.hypot(dx, dy);
    let C = [0, 0];
    if (d <= lCoupler + lRocker && d >= Math.abs(lCoupler - lRocker)) {
      const a = (lCoupler*lCoupler - lRocker*lRocker + d*d) / (2*d);
      const h = Math.sqrt(Math.max(0, lCoupler*lCoupler - a*a));
      const px = D[0] + a * dx / d;
      const py = D[1] + a * dy / d;
      C = [
        px - h * dy / d,
        py + h * dx / d
      ];
    }
    const loadFactor = load / 100;
    const offset = 0.5 + (loadFactor - 0.5) * 0.4; 
     const P = [
      D[0] + (C[0] - D[0]) * offset,
      D[1] + (C[1] - D[1]) * offset
    ];
    traceRef.current.push({x: P[0], y: P[1]});
    if (traceRef.current.length > 200) traceRef.current.shift();
    if (traceRef.current.length > 1) {
      ctx.beginPath();
      for (let i = 0; i < traceRef.current.length; i++) {
        const pt = traceRef.current[i];
        const [px, py] = toScreen(pt.x, pt.y);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = '#ff3366'; ctx.lineWidth = 3 * zoom; ctx.stroke();
    }
    drawLine(Pin1[0] - 1, 0, Pin2[0] + 1, 0, '#334155', 4);
    drawLine(Pin1[0], Pin1[1], D[0], D[1], '#3b82f6', 8); 
    drawLine(Pin2[0], Pin2[1], C[0], C[1], '#a855f7', 8); 
    drawLine(D[0], D[1], C[0], C[1], '#00d4ff', 8); 
    const drawJoint = (x: number, y: number, color: string) => {
      const [jx, jy] = toScreen(x, y);
      ctx.beginPath(); ctx.arc(jx, jy, 0.3 * scale, 0, 2*Math.PI);
      ctx.fillStyle = '#050d1a'; ctx.fill();
      ctx.strokeStyle = color; ctx.lineWidth = 3 * zoom; ctx.stroke();
    };
    drawJoint(Pin1[0], Pin1[1], '#fff');
    drawJoint(Pin2[0], Pin2[1], '#fff');
    drawJoint(D[0], D[1], '#3b82f6');
    drawJoint(C[0], C[1], '#a855f7');
    const [penX, penY] = toScreen(P[0], P[1]);
    ctx.beginPath(); ctx.arc(penX, penY, 0.4 * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#ff3366'; ctx.fill();
    ctx.shadowBlur = 10; ctx.shadowColor = '#ff3366'; ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 260, 110);
    ctx.strokeStyle = 'rgba(255, 51, 102, 0.3)';
    ctx.strokeRect(30, 150, 260, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ff3366'; ctx.fillText('SYS :: CHEBYSHEV_STRAIGHT_LINE', 40, 170);
    ctx.fillStyle = '#fff'; ctx.fillText(`CRANK ANGLE : ${(angle * 180 / Math.PI % 360).toFixed(1)}°`, 40, 195);
    ctx.fillStyle = '#00d4ff'; ctx.fillText(`PEN OFFSET  : ${(offset * 100).toFixed(0)}% ALONG COUPLER`, 40, 215);
    ctx.fillStyle = '#a855f7'; ctx.fillText(`PEN HEIGHT  : ${P[1].toFixed(2)} cm`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const CheckValvesSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<{x: number, y: number, id: number}[]>([]);
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
    const drawRect = (x: number, y: number, w: number, h: number, fill: string, stroke: string) => {
      const [sx, sy] = toScreen(x, y);
      ctx.fillStyle = fill; ctx.fillRect(sx, sy, w * scale, h * scale);
      ctx.strokeStyle = stroke; ctx.lineWidth = 2 * zoom; ctx.strokeRect(sx, sy, w * scale, h * scale);
    };
    const loadFactor = load / 100; 
    const baseVel = Math.sin(angle) * (1 + loadFactor * 2);
    const isOpen = baseVel > 0;
    const valveTarget = isOpen ? Math.min(1.0, baseVel) : 0;
    const valvePos = valveTarget; 
    if (Math.random() < Math.abs(baseVel)) {
      particlesRef.current.push({
        x: baseVel > 0 ? -8 : 8,
        y: (Math.random() - 0.5) * 1.5 + 4,
        id: Math.random()
      });
      particlesRef.current.push({
        x: baseVel > 0 ? -8 : 8,
        y: (Math.random() - 0.5) * 1.5,
        id: Math.random()