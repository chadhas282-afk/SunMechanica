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
         });
      particlesRef.current.push({
        x: baseVel > 0 ? -8 : 8,
        y: (Math.random() - 0.5) * 1.5 - 4,
        id: Math.random()
      });
    }
    const nextParticles = [];
    for (const p of particlesRef.current) {
      let blocked = false;
      if (!isOpen) {
        if (baseVel < 0 && p.x > 0 && p.x + baseVel * 0.5 <= 0) {
          blocked = true;
          p.x = 0.2; 
        } else if (baseVel > 0 && p.x < 0 && p.x + baseVel * 0.5 >= 0) {
        }
      }
      if (!blocked) {
        p.x += baseVel > 0 ? baseVel * 0.2 : baseVel * 0.2;
      }
      if (p.x > -10 && p.x < 10) nextParticles.push(p);
    }
    particlesRef.current = nextParticles;
    const drawPipe = (y: number) => {
      drawRect(-8, y + 1.0, 16, -2.0, 'rgba(15, 23, 42, 0.5)', '#334155');
    };
    drawPipe(4.0);
    drawPipe(0.0);
    drawPipe(-4.0);
    ctx.fillStyle = isOpen ? '#00d4ff' : '#ff3366';
     for (const p of particlesRef.current) {
      const [px, py] = toScreen(p.x, p.y);
      ctx.beginPath(); ctx.arc(px, py, 0.08 * scale, 0, 2*Math.PI); ctx.fill();
    }
    const stressColor = isOpen ? '#00ff88' : '#ff3366';
    ctx.save();
    const [bvx, bvy] = toScreen(0, 4);
    ctx.translate(bvx, bvy);
    ctx.fillStyle = '#1e293b'; ctx.beginPath();
    ctx.moveTo(-1*scale, -1*scale); ctx.lineTo(-0.2*scale, -1*scale); ctx.lineTo(-0.2*scale, -0.6*scale); ctx.lineTo(-0.8*scale, -0.6*scale); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-1*scale, 1*scale); ctx.lineTo(-0.2*scale, 1*scale); ctx.lineTo(-0.2*scale, 0.6*scale); ctx.lineTo(-0.8*scale, 0.6*scale); ctx.closePath(); ctx.fill(); ctx.stroke();
    const ballX = isOpen ? valvePos * 1.0 : 0;
    ctx.beginPath(); ctx.arc(ballX * scale, 0, 0.6 * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#cbd5e1'; ctx.fill();
    ctx.strokeStyle = stressColor; ctx.lineWidth = 3 * zoom;
    if (!isOpen && load > 10) { ctx.shadowBlur = 10; ctx.shadowColor = stressColor; }
    ctx.stroke(); ctx.shadowBlur = 0;
    ctx.strokeStyle = '#475569'; ctx.beginPath(); ctx.moveTo(1*scale, -1*scale); ctx.lineTo(1*scale, 1*scale); ctx.stroke();
    ctx.restore();
    ctx.save();
    const [svx, svy] = toScreen(0, 0);
    ctx.translate(svx, svy);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-0.4*scale, -1*scale, 0.2*scale, 2*scale);
    ctx.strokeStyle = '#334155'; ctx.strokeRect(-0.4*scale, -1*scale, 0.2*scale, 2*scale);
    const swingAngle = isOpen ? valvePos * (-Math.PI/3) : 0;
    ctx.translate(-0.2*scale, -1.0*scale);
    ctx.rotate(swingAngle);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 0, 0.2*scale, 2.0*scale);
     ctx.strokeStyle = stressColor; ctx.lineWidth = 3 * zoom;
    if (!isOpen && load > 10) { ctx.shadowBlur = 10; ctx.shadowColor = stressColor; }
    ctx.strokeRect(0, 0, 0.2*scale, 2.0*scale); ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(0, 0, 0.15*scale, 0, 2*Math.PI); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.restore();
    ctx.save();
    const [pvx, pvy] = toScreen(0, -4);
    ctx.translate(pvx, pvy);
    ctx.fillStyle = '#1e293b'; ctx.beginPath();
    ctx.moveTo(-0.4*scale, -1*scale); ctx.lineTo(-0.2*scale, -1*scale); ctx.lineTo(-0.2*scale, -0.6*scale); ctx.lineTo(-0.4*scale, -0.6*scale); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-0.4*scale, 1*scale); ctx.lineTo(-0.2*scale, 1*scale); ctx.lineTo(-0.2*scale, 0.6*scale); ctx.lineTo(-0.4*scale, 0.6*scale); ctx.closePath(); ctx.fill();
    const poppetX = isOpen ? valvePos * 1.0 : 0;
    ctx.translate(poppetX * scale, 0);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-0.2*scale, -0.8*scale, 0.2*scale, 1.6*scale); 
    ctx.fillRect(0, -0.1*scale, 1.5*scale, 0.2*scale); 
    ctx.strokeStyle = stressColor; ctx.lineWidth = 3 * zoom;
    if (!isOpen && load > 10) { ctx.shadowBlur = 10; ctx.shadowColor = stressColor; }
    ctx.strokeRect(-0.2*scale, -0.8*scale, 0.2*scale, 1.6*scale); ctx.shadowBlur = 0;
    ctx.translate(-poppetX * scale, 0);
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2 * zoom;
    ctx.beginPath();
    const springStart = poppetX * scale + 1.5 * scale;
    const springEnd = 2.5 * scale;
    const numCoils = 6;
    const coilPitch = (springEnd - springStart) / numCoils;
    ctx.moveTo(springStart, 0);
    for(let i=0; i<numCoils; i++) {
      ctx.lineTo(springStart + (i + 0.25) * coilPitch, 0.3*scale);
      ctx.lineTo(springStart + (i + 0.75) * coilPitch, -0.3*scale);
      ctx.lineTo(springStart + (i + 1.0) * coilPitch, 0);
    }
    ctx.stroke();
    ctx.fillStyle = '#1e293b'; ctx.fillRect(2.5*scale, -0.6*scale, 0.4*scale, 1.2*scale);
    ctx.restore();
    ctx.font = `${12*zoom}px monospace`; ctx.fillStyle = '#94a3b8';
    const [lx, ly1] = toScreen(-7, 4.8); ctx.fillText('BALL CHECK', lx, ly1);
    const [, ly2] = toScreen(-7, 0.8); ctx.fillText('SWING CHECK', lx, ly2);
    const [, ly3] = toScreen(-7, -3.2); ctx.fillText('POPPET CHECK', lx, ly3);
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(255, 107, 53, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ff6b35'; ctx.fillText('SYS :: CHECK_VALVES', 40, 170);
    ctx.fillStyle = '#fff'; ctx.fillText(`FLOW VELOCITY : ${baseVel.toFixed(2)} m/s`, 40, 195);
    ctx.fillStyle = '#00d4ff'; ctx.fillText(`VALVE LIFT    : ${(valvePos * 100).toFixed(0)} %`, 40, 215);
    ctx.fillStyle = stressColor; ctx.fillText(`STATUS        : ${isOpen ? 'OPEN / FLOWING' : 'SEALED / BLOCKED'}`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const CrankshaftSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const originX = width * 0.35;
    const originY = height * 0.5;
    const R = 1.5; 
    const L = 4.0; 
    const pistonW = 1.8;
    const pistonH = 1.4;
    const crankX = R * Math.cos(angle);
    const crankY = R * Math.sin(angle);
    const pistonX = crankX + Math.sqrt(L * L - crankY * crankY);
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
    const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, w: number) => {
      ctx.beginPath();
      const [sx1, sy1] = toScreen(x1, y1);
      const [sx2, sy2] = toScreen(x2, y2);
      ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2);
      ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke();
    };
    const drawCircle = (x: number, y: number, r: number, color: string, fill = false) => {
      ctx.beginPath();
      const [sx, sy] = toScreen(x, y);
      ctx.arc(sx, sy, r * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      if (fill) { ctx.fillStyle = color; ctx.fill(); }
    };
    ctx.setLineDash([5, 5]);
    drawCircle(0, 0, R, '#1e3a8a');
    ctx.setLineDash([]);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    const [cylStartX, cylTopY] = toScreen(R + L - 2.0, pistonH/2 + 0.1);
    const [cylEndX, cylBotY] = toScreen(R + L + 2.0, -pistonH/2 - 0.1);
    ctx.beginPath(); ctx.moveTo(cylStartX, cylTopY); ctx.lineTo(cylEndX, cylTopY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cylStartX, cylBotY); ctx.lineTo(cylEndX, cylBotY); ctx.stroke();
    drawLine(0, 0, crankX, crankY, '#3b82f6', Math.max(8, scale * 0.2));
    drawCircle(0, 0, 0.2, '#fff', true); 
    const stressColor = load > 50 
      ? `rgb(${148 + ((load-50)/50)*91}, ${163 - ((load-50)/50)*95}, ${184 - ((load-50)/50)*116})` 
      : '#94a3b8';
    drawLine(crankX, crankY, pistonX, 0, stressColor, Math.max(6, scale * 0.15));
    drawCircle(crankX, crankY, 0.15, '#22d3ee', true); 
    const [px, py] = toScreen(pistonX, 0);
    const pw = pistonW * scale;
    const ph = pistonH * scale;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(px - pw/2, py - ph/2, pw, ph);
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.strokeRect(px - pw/2, py - ph/2, pw, ph);
    ctx.beginPath(); ctx.moveTo(px + pw/2 - pw*0.2, py - ph/2); ctx.lineTo(px + pw/2 - pw*0.2, py + ph/2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px + pw/2 - pw*0.35, py - ph/2); ctx.lineTo(px + pw/2 - pw*0.35, py + ph/2); ctx.stroke();
    drawCircle(pistonX, 0, 0.12, '#fff', true); 
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(width - 260, 150, 200, 110);
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.strokeRect(width - 260, 150, 200, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#00d4ff';
    ctx.fillText('SYS :: CRANKSHAFT_TELEMETRY', width - 250, 170);
    ctx.fillStyle = '#fff';
    const normAngle = ((angle * 180 / Math.PI) % 360 + 360) % 360;
    ctx.fillText(`ANGLE  : ${normAngle.toFixed(1)}°`, width - 250, 195);
    ctx.fillStyle = '#00ff88';
    ctx.fillText(`STROKE : ${(pistonX - (R + L - R)).toFixed(2)}`, width - 250, 215);
     ctx.fillStyle = '#ff6b35';
    ctx.fillText(`LOAD   : ${load}%`, width - 250, 235);
  }, [angle, load]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
export const DifferentialGearSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
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
    const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, w: number) => {
      ctx.beginPath();
      const [sx1, sy1] = toScreen(x1, y1); const [sx2, sy2] = toScreen(x2, y2);
      ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2);
      ctx.strokeStyle = color; ctx.lineWidth = w * zoom; ctx.lineCap = 'round'; ctx.stroke();
    };
    const R_ring = 4.0;
    const R_pinion = 1.0;
    const w_in = angle * 2;
    const w_ring = w_in * (R_pinion / R_ring); 
    const turnFactor = (load - 50) / 50; 
    const w_diff = turnFactor * 1.5; 
    const w_left = w_ring + w_diff;
    const w_right = w_ring - w_diff;
    const w_spider = (w_left - w_right) / 2;
    const theta_spider = w_spider * 5; 
    const drawGear = (x: number, y: number, r: number, numTeeth: number, rot: number, color: string, innerRing = false) => {
      ctx.save();
      const [gx, gy] = toScreen(x, y);
      ctx.translate(gx, gy);
      ctx.rotate(rot);
      ctx.beginPath();
      for(let i=0; i<numTeeth; i++) {
        const th = i * (2*Math.PI/numTeeth);
        const nextTh = (i+0.5) * (2*Math.PI/numTeeth);
        const rOuter = r * scale;
        const rInner = (r - 0.2) * scale;
        if (i===0) ctx.moveTo(rOuter * Math.cos(th), rOuter * Math.sin(th));
         else ctx.lineTo(rOuter * Math.cos(th), rOuter * Math.sin(th));
        ctx.lineTo(rInner * Math.cos(nextTh), rInner * Math.sin(nextTh));
      }
      ctx.closePath();
      ctx.fillStyle = innerRing ? 'rgba(15, 23, 42, 0.3)' : 'rgba(15, 23, 42, 0.8)';
      ctx.fill();
      ctx.strokeStyle = color; ctx.lineWidth = 2 * zoom; ctx.stroke();
      if (innerRing) {
        ctx.beginPath(); ctx.arc(0, 0, (r - 0.6) * scale, 0, 2*Math.PI);
        ctx.stroke();
      }
      ctx.restore();
    };
    ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 2 * zoom;
    const [lx, ly] = toScreen(-7, -0.4); ctx.fillRect(lx, ly, 5*scale, 0.8*scale); ctx.strokeRect(lx, ly, 5*scale, 0.8*scale);
    const [rx, ry] = toScreen(2, -0.4); ctx.fillRect(rx, ry, 5*scale, 0.8*scale);
    ctx.strokeStyle = '#a855f7'; ctx.strokeRect(rx, ry, 5*scale, 0.8*scale);
    ctx.fillStyle = '#1e293b'; ctx.strokeStyle = '#ffb703';
    const [px, py] = toScreen(-0.4, R_ring + 0.5); ctx.fillRect(px, py, 0.8*scale, 4*scale); ctx.strokeRect(px, py, 0.8*scale, 4*scale);
    drawGear(0, R_ring + 0.5, R_pinion, 12, -w_in, '#ffb703');
    drawGear(0, 0, R_ring, 48, w_ring, '#64748b', true);
    ctx.save();
    const [cx, cy] = toScreen(0, 0);
    ctx.translate(cx, cy);
    ctx.rotate(w_ring);
    ctx.fillStyle = 'rgba(71, 85, 105, 0.5)';
    ctx.fillRect(-1*scale, -2.5*scale, 2*scale, 5*scale);
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2 * zoom;
    ctx.strokeRect(-1*scale, -2.5*scale, 2*scale, 5*scale);
    ctx.beginPath(); ctx.moveTo(0, -R_ring * scale); ctx.lineTo(0, R_ring * scale);
    ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 4 * zoom; ctx.stroke();
    const spiderR = 1.0;
    const drawSpider = (yPos: number) => {
      ctx.save();
      ctx.translate(0, yPos * scale);
      ctx.fillStyle = '#334155';
      ctx.fillRect(-0.4*scale, -spiderR*scale, 0.8*scale, 2*spiderR*scale);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1 * zoom;
      const numSpiderTeeth = 8;
      for(let i=0; i<numSpiderTeeth; i++) {
        const offset = ((theta_spider + i * (Math.PI/numSpiderTeeth)) % Math.PI) - Math.PI/2;
        const yLine = Math.sin(offset) * spiderR * scale;
        ctx.beginPath(); ctx.moveTo(-0.4*scale, yLine); ctx.lineTo(0.4*scale, yLine); ctx.stroke();
      }
      ctx.restore();
    };
    drawSpider(-2.0);
    drawSpider(2.0);
    ctx.restore();
    const sideR = 1.5;
    const drawSideGear = (xPos: number, rot: number, color: string) => {
      ctx.save();
      const [sgx, sgy] = toScreen(xPos, 0);
      ctx.translate(sgx, sgy);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(-0.5*scale, -sideR*scale, 1.0*scale, 2*sideR*scale);
      ctx.strokeStyle = color; ctx.lineWidth = 2 * zoom;
      ctx.strokeRect(-0.5*scale, -sideR*scale, 1.0*scale, 2*sideR*scale);
      ctx.strokeStyle = color; ctx.lineWidth = 1.5 * zoom;
      const numSideTeeth = 12;
      for(let i=0; i<numSideTeeth; i++) {
        const offset = ((rot + i * (Math.PI/numSideTeeth)) % Math.PI) - Math.PI/2;
        const yLine = Math.sin(offset) * sideR * scale;
        ctx.beginPath(); ctx.moveTo(-0.5*scale, yLine); ctx.lineTo(0.5*scale, yLine); ctx.stroke();
      }
      ctx.restore();
    };
    drawSideGear(-1.5, w_left, '#00d4ff'); 
    drawSideGear(1.5, w_right, '#a855f7'); 
    const vecY = -4.5;
    const vScale = 1.5;
    const leftV = w_left * vScale;
    const rightV = w_right * vScale;
    drawLine(-4, vecY, -4, vecY - leftV, '#00d4ff', 4);
    const [lahX, lahY] = toScreen(-4, vecY - leftV);
    ctx.beginPath(); ctx.arc(lahX, lahY, 4*zoom, 0, 2*Math.PI); ctx.fillStyle = '#00d4ff'; ctx.fill();
    drawLine(4, vecY, 4, vecY - rightV, '#a855f7', 4);
    const [rahX, rahY] = toScreen(4, vecY - rightV);
    ctx.beginPath(); ctx.arc(rahX, rahY, 4*zoom, 0, 2*Math.PI); ctx.fillStyle = '#a855f7'; ctx.fill();
    drawLine(-4, vecY - leftV, 4, vecY - rightV, 'rgba(255, 255, 255, 0.4)', 2);
    const avgV = (leftV + rightV) / 2;
    const [cahX, cahY] = toScreen(0, vecY - avgV);
    ctx.beginPath(); ctx.arc(cahX, cahY, 5*zoom, 0, 2*Math.PI); ctx.fillStyle = '#64748b'; ctx.fill();
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#64748b'; ctx.fillText('SYS :: DIFFERENTIAL_GEAR', 40, 170);
    ctx.fillStyle = '#ffb703'; ctx.fillText(`DRIVESHAFT  : ${(w_in * 180 / Math.PI).toFixed(0)} RPM`, 40, 195);
    ctx.fillStyle = '#00d4ff'; ctx.fillText(`LEFT WHEEL  : ${(w_left * 180 / Math.PI).toFixed(0)} RPM`, 40, 215);
    ctx.fillStyle = '#a855f7'; ctx.fillText(`RIGHT WHEEL : ${(w_right * 180 / Math.PI).toFixed(0)} RPM`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const DoublePendulumSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    th1: Math.PI / 2,
    th2: Math.PI / 2,
    w1: 0,
    w2: 0,
    lastAngle: 0
  });
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
    const originY = height * 0.4;
    ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }
    const toScreen = (x: number, y: number) => [originX + x * scale, originY - y * scale];
    const dt_total = angle - stateRef.current.lastAngle;
    stateRef.current.lastAngle = angle;
    const L1 = 3.0;
    const L2 = 3.0;
    const m1 = 1.0;
    const m2 = 1.0;
    const loadFactor = load / 100;
    const g = 9.81 + loadFactor * 20; 
    if (dt_total < 0 || dt_total > 0.5) {
    } else if (dt_total > 0) {
      const steps = 10;
      const dt = dt_total / steps;
      for(let i=0; i<steps; i++) {
        const { th1, th2, w1, w2 } = stateRef.current;
        const dTheta = th1 - th2;
        const num1 = -g * (2 * m1 + m2) * Math.sin(th1) - m2 * g * Math.sin(th1 - 2 * th2);
        const num2 = -2 * Math.sin(dTheta) * m2 * (w2 * w2 * L2 + w1 * w1 * L1 * Math.cos(dTheta));
        const den = L1 * (2 * m1 + m2 - m2 * Math.cos(2 * th1 - 2 * th2));
        const a1 = (num1 + num2) / den;
        const num3 = 2 * Math.sin(dTheta) * (w1 * w1 * L1 * (m1 + m2) + g * (m1 + m2) * Math.cos(th1) + w2 * w2 * L2 * m2 * Math.cos(dTheta));
        const a2 = num3 / (L2 * (2 * m1 + m2 - m2 * Math.cos(2 * th1 - 2 * th2)));
        const damping = 0.001;
        stateRef.current.w1 += (a1 - w1 * damping) * dt;
        stateRef.current.w2 += (a2 - w2 * damping) * dt;
        stateRef.current.th1 += stateRef.current.w1 * dt;
        stateRef.current.th2 += stateRef.current.w2 * dt;
      }
    }
    const { th1, th2 } = stateRef.current;
    const x1 = L1 * Math.sin(th1);
    const y1 = -L1 * Math.cos(th1); 
    const x2 = x1 + L2 * Math.sin(th2);
    const y2 = y1 - L2 * Math.cos(th2);
    traceRef.current.push({ x: x2, y: y2 });
    if (traceRef.current.length > 300) traceRef.current.shift();
    if (traceRef.current.length > 1) {
      ctx.beginPath();
      for (let i = 0; i < traceRef.current.length; i++) {
        const pt = traceRef.current[i];
        const [px, py] = toScreen(pt.x, pt.y);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = `rgba(255, 51, 102, ${0.4 + loadFactor*0.6})`;
       ctx.lineWidth = 2 * zoom; ctx.stroke();
    }
    const [px, py] = toScreen(0, 0);
    ctx.beginPath(); ctx.arc(px, py, 0.4 * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#1e293b'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2 * zoom; ctx.stroke();
    const [p1x, p1y] = toScreen(x1, y1);
    const [p2x, p2y] = toScreen(x2, y2);
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(p1x, p1y);
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 6 * zoom; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(p1x, p1y); ctx.lineTo(p2x, p2y);
    ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 6 * zoom; ctx.stroke();
    ctx.beginPath(); ctx.arc(p1x, p1y, 0.5 * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#0f172a'; ctx.fill();
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 3 * zoom; ctx.stroke();
    ctx.beginPath(); ctx.arc(p2x, p2y, 0.5 * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#0f172a'; ctx.fill();
    ctx.strokeStyle = '#ff3366'; ctx.lineWidth = 3 * zoom; ctx.stroke();
    if (load > 20) {
      ctx.shadowBlur = loadFactor * 20;
      ctx.shadowColor = '#ff3366';
      ctx.stroke(); ctx.shadowBlur = 0;
    }
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(255, 51, 102, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    const ke = 0.5 * m1 * Math.pow(stateRef.current.w1 * L1, 2) + 0.5 * m2 * (Math.pow(stateRef.current.w1 * L1 * Math.cos(th1) + stateRef.current.w2 * L2 * Math.cos(th2), 2) + Math.pow(stateRef.current.w1 * L1 * Math.sin(th1) + stateRef.current.w2 * L2 * Math.sin(th2), 2));
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ff3366'; ctx.fillText('SYS :: DOUBLE_PENDULUM', 40, 170);
    ctx.fillStyle = '#fff'; ctx.fillText(`GRAVITY (G) : ${g.toFixed(1)} m/s²`, 40, 195);
    ctx.fillStyle = '#00d4ff'; ctx.fillText(`KIN ENERGY  : ${ke.toFixed(1)} J`, 40, 215);
    ctx.fillStyle = '#a855f7'; ctx.fillText(`LYAPUNOV    : CHAOTIC`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const EllipticalTrammelSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
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
    const originY = height * 0.5;
    ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }
    const toScreen = (x: number, y: number) => [originX + x * scale, originY - y * scale];
    const trackLen = 10;
    ctx.beginPath();
    const [hL] = toScreen(-trackLen/2, 0); const [hR] = toScreen(trackLen/2, 0);
    const [, vT] = toScreen(0, trackLen/2); const [, vB] = toScreen(0, -trackLen/2);
    const midX = originX; const midY = originY;
    ctx.moveTo(hL, midY); ctx.lineTo(hR, midY);
    ctx.moveTo(midX, vT); ctx.lineTo(midX, vB);
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.lineWidth = 1.2 * scale; ctx.lineCap = 'round';
    ctx.stroke();
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 0.8 * scale; ctx.stroke();
    const theta = -angle; 
    const D = 3.0; 
    const loadFactor = load / 100; 
    const E = 1.0 + loadFactor * 3.0; 
    const Ax = 0;
    const Ay = D * Math.sin(theta);
    const Bx = D * Math.cos(theta);
    const By = 0;
    const vx = Bx - Ax;
    const vy = By - Ay;
    const ux = vx / D;
    const uy = vy / D;
    const Cx = Bx + E * ux;
    const Cy = By + E * uy;
    const tailX = Ax - 1.0 * ux;
    const tailY = Ay - 1.0 * uy;
    const stressColor = '#ff3366';
    traceRef.current.push({ x: Cx, y: Cy });
    if (traceRef.current.length > 300) traceRef.current.shift();
     if (traceRef.current.length > 1) {
      ctx.beginPath();
      for (let i = 0; i < traceRef.current.length; i++) {
        const pt = traceRef.current[i];
        const [px, py] = toScreen(pt.x, pt.y);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = `rgba(255, 51, 102, ${0.5 + 0.5 * loadFactor})`;
      ctx.lineWidth = 3 * zoom;
      ctx.stroke();
    }
    const [tx, ty] = toScreen(tailX, tailY);
    const [cx, cy] = toScreen(Cx, Cy);
    ctx.beginPath();
    ctx.moveTo(tx, ty); ctx.lineTo(cx, cy);
    ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 10 * zoom; ctx.stroke();
    const drawPin = (x: number, y: number, color: string) => {
      const [px, py] = toScreen(x, y);
      ctx.beginPath();
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px - 0.4*scale, py - 0.4*scale, 0.8*scale, 0.8*scale);
      ctx.strokeStyle = color; ctx.lineWidth = 2 * zoom;
      ctx.strokeRect(px - 0.4*scale, py - 0.4*scale, 0.8*scale, 0.8*scale);
      ctx.beginPath(); ctx.arc(px, py, 0.2*scale, 0, 2*Math.PI);
      ctx.fillStyle = '#fff'; ctx.fill();
    };
    drawPin(Ax, Ay, '#00d4ff');
    drawPin(Bx, By, '#3b82f6');
    ctx.beginPath(); ctx.arc(cx, cy, 0.3*scale, 0, 2*Math.PI);
    ctx.fillStyle = stressColor; ctx.fill();
    if (load > 0) {
      ctx.shadowBlur = 10; ctx.shadowColor = stressColor; ctx.stroke(); ctx.shadowBlur = 0;
    }
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 250, 110);
    ctx.strokeStyle = 'rgba(255, 51, 102, 0.3)';
    ctx.strokeRect(30, 150, 250, 110);
    const semiMajor = D + E;
    const semiMinor = Math.abs(E);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ff3366'; ctx.fillText('SYS :: ELLIPTICAL_TRAMMEL', 40, 170);
    ctx.fillStyle = '#00d4ff'; ctx.fillText(`PIN DISTANCE : ${D.toFixed(1)} cm`, 40, 195);
    ctx.fillStyle = '#fff'; ctx.fillText(`PEN OFFSET   : ${E.toFixed(1)} cm`, 40, 215);
    ctx.fillStyle = '#ffb703'; 
    ctx.fillText(`ELLIPSE AXES : ${semiMajor.toFixed(1)} x ${semiMinor.toFixed(1)}`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const EpicyclicVibrationSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const traceRef = useRef<{t: number, carrier: number, pend: number}[]>([]);
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
    const originX = width * 0.4;
    const originY = height * 0.5;
    ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }
    const toScreen = (x: number, y: number) => [originX + x * scale, originY - y * scale];
    const loadFactor = load / 100;
    const vibrationAmp = loadFactor * 0.2; 
    const freq = 12.0; 
    const carrierAngle = angle + vibrationAmp * Math.sin(angle * freq);
    const pendulumSwing = -vibrationAmp * 2.5 * Math.sin(angle * freq);
    const numPendulums = 4;
    const R_mount = 3.5; 
    const L_pend = 1.5;  
    ctx.save();
    const [cx, cy] = toScreen(0, 0);
    ctx.translate(cx, cy);
    ctx.rotate(-carrierAngle); 
    ctx.beginPath();
    ctx.arc(0, 0, R_mount * scale, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a'; ctx.fill();
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 6; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-R_mount*scale, 0); ctx.lineTo(R_mount*scale, 0); ctx.stroke();
     ctx.beginPath(); ctx.moveTo(0, -R_mount*scale); ctx.lineTo(0, R_mount*scale); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 0.5 * scale, 0, 2*Math.PI); ctx.fillStyle = '#1e293b'; ctx.fill(); ctx.stroke();
    const rC = Math.round(168 + loadFactor * 87);
    const stressColor = `rgb(${rC}, 85, 247)`;
    for (let i = 0; i < numPendulums; i++) {
      ctx.save();
      const mountAngle = i * (Math.PI / 2);
      ctx.rotate(-mountAngle);
      const px = R_mount * scale;
      const py = 0;
      ctx.beginPath(); ctx.arc(px, py, 6, 0, 2*Math.PI); ctx.fillStyle = '#fff'; ctx.fill();
      ctx.translate(px, py);
      ctx.rotate(-pendulumSwing); 
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(L_pend * scale, 0);
      ctx.strokeStyle = stressColor; ctx.lineWidth = 8; ctx.stroke();
      ctx.beginPath(); ctx.arc(L_pend * scale, 0, 0.8 * scale, 0, 2*Math.PI);
      ctx.fillStyle = '#1e293b'; ctx.fill();
      ctx.strokeStyle = stressColor; ctx.lineWidth = 4;
      if (load > 50) {
        ctx.shadowBlur = (load - 50) * 0.4;
        ctx.shadowColor = stressColor;
      }
      ctx.stroke(); ctx.shadowBlur = 0;
      ctx.restore();
    }
    ctx.restore();
    const graphX = width - 200;
    const graphY = 150;
    traceRef.current.push({ t: angle, carrier: vibrationAmp * Math.sin(angle * freq), pend: pendulumSwing });
    if (traceRef.current.length > 100) traceRef.current.shift();
     ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(graphX - 20, graphY - 100, 200, 200);
    ctx.strokeStyle = '#475569'; ctx.strokeRect(graphX - 20, graphY - 100, 200, 200);
    ctx.beginPath(); ctx.moveTo(graphX - 20, graphY); ctx.lineTo(graphX + 180, graphY); ctx.strokeStyle = '#334155'; ctx.stroke();
    if (traceRef.current.length > 1) {
      ctx.beginPath();
      for (let i = 0; i < traceRef.current.length; i++) {
        const pt = traceRef.current[i];
        const gx = graphX + (i / 100) * 160;
        const gy = graphY - pt.carrier * 200;
        if (i === 0) ctx.moveTo(gx, gy); else ctx.lineTo(gx, gy);
      }
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath();
      for (let i = 0; i < traceRef.current.length; i++) {
        const pt = traceRef.current[i];
        const gx = graphX + (i / 100) * 160;
        const gy = graphY - pt.pend * 80;
        if (i === 0) ctx.moveTo(gx, gy); else ctx.lineTo(gx, gy);
      }
      ctx.strokeStyle = stressColor; ctx.lineWidth = 2; ctx.stroke();
    }
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ef4444'; ctx.fillText('ROTOR VIBRATION', graphX, graphY - 80);
    ctx.fillStyle = stressColor; ctx.fillText('ABSORBER SWING', graphX, graphY + 80);
  }, [angle, load]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const EscapementSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const originY = height * 0.5;
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
    const numTeeth = 30;
    const toothPitch = (Math.PI * 2) / numTeeth;
    const wheelRadius = 2.5;
    const anchorCenterY = wheelRadius + 1.2; 
    const t = angle;
    const freq = 4.0;
    const maxSwing = 0.2; 
    const pendulumAngle = maxSwing * Math.sin(t * freq);
    const cycle = t * freq / Math.PI;
    const stepIndex = Math.floor(cycle - 0.5); 
    const phase = cycle - 0.5 - stepIndex; 
    let tickEase = 0;
    if (phase < 0.1) {
      tickEase = Math.sin((phase / 0.1) * (Math.PI / 2));
    } else {
      tickEase = 1.0;
    }
    const wheelAngle = (stepIndex + tickEase) * (toothPitch / 2);
    const loadFactor = load / 100;
    const stressColor = `rgba(255, 215, 0, ${0.2 + loadFactor * 0.3})`;
    const strokeColor = load > 50 ? '#ff4444' : '#ffd700';
    ctx.save();
    ctx.translate(originX, originY);
    ctx.rotate(wheelAngle); 
    ctx.beginPath();
    for (let i = 0; i < numTeeth; i++) {
      const a1 = i * toothPitch;
      const a2 = a1 + toothPitch * 0.7; 
      const a3 = a1 + toothPitch; 
      const rInner = wheelRadius * 0.8;
      const p1x = wheelRadius * Math.cos(a1);
      const p1y = wheelRadius * Math.sin(a1);
      const p2x = rInner * Math.cos(a2);
      const p2y = rInner * Math.sin(a2);
      const p3x = rInner * Math.cos(a3);
      const p3y = rInner * Math.sin(a3);
      if (i === 0) ctx.moveTo(p1x * scale, p1y * scale);
      else ctx.lineTo(p1x * scale, p1y * scale);
      ctx.lineTo(p2x * scale, p2y * scale);
      ctx.lineTo(p3x * scale, p3y * scale);
    }
    ctx.closePath();
    ctx.fillStyle = stressColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2 + loadFactor * 2;
    if (load > 60) {
      ctx.shadowBlur = (load - 60) * 0.3;
      ctx.shadowColor = strokeColor;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(0, 0, 0.4 * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#1e293b'; ctx.fill();
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 0.1 * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#fff'; ctx.fill();
    ctx.restore();
    ctx.save();
    const [ax, ay] = toScreen(0, anchorCenterY);
    ctx.translate(ax, ay);
    ctx.rotate(-pendulumAngle); 
    ctx.beginPath();
    const anchorR = anchorCenterY;
    const spanAngle = Math.PI / 4; 
    ctx.arc(0, 0, anchorR * scale, Math.PI/2 - spanAngle, Math.PI/2 + spanAngle);
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 8;
    ctx.stroke();
    const drawPallet = (angleOffset: number, isEntry: boolean) => {
      ctx.save();
      ctx.rotate(Math.PI/2 + angleOffset);
      ctx.translate(anchorR * scale, 0);
      ctx.beginPath();
      ctx.moveTo(-5, -10);
      ctx.lineTo(15, isEntry ? -15 : 15);
      ctx.lineTo(5, 10);
      ctx.closePath();
      const isStriking = isEntry ? (phase < 0.15 && Math.sin(cycle*Math.PI) > 0) : (phase < 0.15 && Math.sin(cycle*Math.PI) < 0);
      ctx.fillStyle = isStriking ? '#fff' : '#0284c7';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();
      if (isStriking) {
        ctx.beginPath();
        ctx.arc(15, isEntry ? -15 : 15, 10, 0, 2*Math.PI);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
      }
      ctx.restore();
    };
     drawPallet(-spanAngle, true); 
    drawPallet(spanAngle, false); 
    ctx.beginPath();
    ctx.moveTo(0, 0);
    const pendLen = 6.0;
    ctx.lineTo(0, pendLen * scale);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, pendLen * scale, 0.8 * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#1e293b'; ctx.fill();
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 4; ctx.stroke();
    ctx.beginPath();
    ctx.arc(-0.2*scale, pendLen*scale - 0.2*scale, 0.2*scale, 0, 2*Math.PI);
    ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, 0.2 * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#fff'; ctx.fill();
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 220, 110);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.strokeRect(30, 150, 220, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ffd700';
    ctx.fillText('SYS :: ANCHOR_ESCAPEMENT', 40, 170);
    ctx.fillStyle = '#fff';
    ctx.fillText(`BEAT RATE  : ${(freq * 30 / Math.PI).toFixed(0)} BPM`, 40, 195);
    ctx.fillStyle = '#00ff88';
    ctx.fillText(`SWING ANG  : ${(pendulumAngle * 180 / Math.PI).toFixed(1)}°`, 40, 215);
    ctx.fillStyle = '#a855f7';
    ctx.fillText(`WHEEL STEP : ${Math.floor(cycle)}`, 40, 235);
  }, [angle, load]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
export const EulerBucklingSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const originY = height * 0.85; 
    ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }
    const toScreen = (x: number, y: number) => [originX + x * scale, originY - y * scale];
    const L = 10.0;
    const h = 0.6; 
    const P_crit = 50;
    let delta = 0;
    if (load > P_crit) {
      const overload = load - P_crit;
      delta = (overload / 50) * 3.0; 
      delta += 0.1 * overload/50 * Math.sin(angle * 15.0);
    }
    const topY = L - (delta * delta * Math.PI * Math.PI) / (4 * L);
    const numPoints = 100;
    const topPoints = [];
    const botPoints = [];
    for (let i = 0; i <= numPoints; i++) {
      const y = (i / numPoints) * topY;
      const x0 = delta * Math.sin(Math.PI * (y / topY));
      const slope = delta * (Math.PI / topY) * Math.cos(Math.PI * (y / topY));
      const theta = Math.atan(slope); 
      const xLeft = x0 - (h/2) * Math.cos(theta);
      const yLeft = y + (h/2) * Math.sin(theta);
      const xRight = x0 + (h/2) * Math.cos(theta);
      const yRight = y - (h/2) * Math.sin(theta);
      topPoints.push([xLeft, yLeft]);
      botPoints.push([xRight, yRight]);
    }
    const loadFactor = load / 100;
    const rC = Math.round(148 + loadFactor * 107);
    const gC = Math.round(163 - loadFactor * 163);
     const bC = Math.round(184 - loadFactor * 184);
    const stressColor = `rgb(${rC}, ${gC}, ${bC})`;
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
    ctx.fillStyle = stressColor;
    if (load > P_crit) {
      ctx.shadowBlur = (load - P_crit) * 0.4;
      ctx.shadowColor = stressColor;
    }
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#475569';
    const [bx, by] = toScreen(0, 0);
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx - 15, by + 20); ctx.lineTo(bx + 15, by + 20); ctx.fill();
    const [tx, ty] = toScreen(0, topY);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(tx - 2*scale, ty - 0.4*scale, 4*scale, 0.4*scale);
    ctx.strokeStyle = '#94a3b8';
    ctx.strokeRect(tx - 2*scale, ty - 0.4*scale, 4*scale, 0.4*scale);
    if (loadFactor > 0) {
      const arrowLen = 20 + loadFactor * 80;
      ctx.beginPath();
      ctx.moveTo(tx, ty - arrowLen - 20);
      ctx.lineTo(tx, ty - 10);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tx, ty - 10);
      ctx.lineTo(tx - 10, ty - 25);
      ctx.lineTo(tx + 10, ty - 25);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
    }
  }, [angle, load]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const ExternalGearPumpSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<{a: number, g: number, r: number, id: number}[]>([]);
  const nextId = useRef(0);
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
    const R = 3.0; 
    const numTeeth = 12;
    const toothDepth = 0.8;
    const casingClearance = 0.1;
    const g1x = -R; const g1y = 0; 
    const g2x = R;  const g2y = 0; 
    const pitchAngle = (2 * Math.PI) / numTeeth;
    const rot1 = -angle;
    const rot2 = angle + pitchAngle / 2;
    const loadFactor = load / 100;
    const intakeColor = '#00d4ff';
    const rC = Math.round(0 + loadFactor * 255);
    const gC = Math.round(255 - loadFactor * 100); 
    const dischargeColor = `rgb(${rC}, ${gC}, 0)`;
    const casingR = R + toothDepth / 2 + casingClearance;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    const [c1x, c1y] = toScreen(g1x, g1y);
    const [c2x, c2y] = toScreen(g2x, g2y);
    const openAngle = Math.PI / 6; 
    ctx.arc(c1x, c1y, casingR * scale, -Math.PI/2 - openAngle, Math.PI/2 + openAngle, true);
    ctx.arc(c2x, c2y, casingR * scale, Math.PI/2 - openAngle, -Math.PI/2 + openAngle, true);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    const [px1, py1] = toScreen(-1.5, -casingR * 0.8);
    ctx.fillRect(px1, py1, 3.0 * scale, -3.0 * scale); 
    ctx.strokeRect(px1, py1, 3.0 * scale, -3.0 * scale);
    const [px2, py2] = toScreen(-1.5, casingR * 0.8);
    ctx.fillRect(px2, py2, 3.0 * scale, 3.0 * scale); 
    ctx.strokeRect(px2, py2, 3.0 * scale, 3.0 * scale);
    for (let i = 0; i < 3; i++) {
      if (Math.random() > 0.3) {
        const side = Math.random() > 0.5 ? 0 : 1; 
        const startAngle = side === 0 ? -Math.PI/2 : -Math.PI/2; 
        particlesRef.current.push({
          id: nextId.current++,
          g: side,
          a: startAngle,
          r: R + (Math.random() * 0.8 - 0.4) * toothDepth 
        });
      }
    }
    const speed = 0.05; 
    const activeParticles = [];
    ctx.save();
    for (let i = 0; i < particlesRef.current.length; i++) {
      const p = particlesRef.current[i];
      if (p.g === 0) {
        p.a += speed; 
        p.a -= speed;
      } else {
        p.a += speed;
      }
      let px, py;
      if (p.g === 0) {
        px = g1x + p.r * Math.cos(p.a);
        py = g1y + p.r * Math.sin(p.a);
      } else {
        px = g2x + p.r * Math.cos(p.a);
        py = g2y + p.r * Math.sin(p.a);
      }
      if (py > R) {
        py += (Math.abs(p.a) > Math.PI ? 0.5 : 0.5); 
        if (p.g === 0) px += 0.1; else px -= 0.1;
      }
      if (py < R + 4) { 
        activeParticles.push(p);
        const [spx, spy] = toScreen(px, py);
        const progress = Math.max(0, Math.min(1, (py + casingR) / (2 * casingR)));
        ctx.fillStyle = progress > 0.7 ? dischargeColor : intakeColor;
        ctx.beginPath();
        ctx.arc(spx, spy, 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
    particlesRef.current = activeParticles;
    ctx.restore();
    const drawGear = (cx: number, cy: number, rot: number, color: string) => {
      ctx.save();
      const [sx, sy] = toScreen(cx, cy);
      ctx.translate(sx, sy);
      ctx.rotate(-rot); 
      ctx.beginPath();
      const numPoints = numTeeth * 4;
      for (let i = 0; i <= numPoints; i++) {
        const a = (i / numPoints) * Math.PI * 2;
        let tr = R;
        const toothPhase = (a * numTeeth) % (Math.PI * 2);
        if (toothPhase < Math.PI * 0.4) tr = R + toothDepth/2;
        else if (toothPhase < Math.PI * 0.6) tr = R + toothDepth/2 - (toothPhase - Math.PI*0.4)*toothDepth/(Math.PI*0.2);
        else if (toothPhase < Math.PI * 1.4) tr = R - toothDepth/2;
        else if (toothPhase < Math.PI * 1.6) tr = R - toothDepth/2 + (toothPhase - Math.PI*1.4)*toothDepth/(Math.PI*0.2);
        else tr = R + toothDepth/2;
        const px = tr * scale * Math.cos(a);
        const py = tr * scale * Math.sin(a);
        if (i === 0) ctx.moveTo(px, py);
         else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      if (load > 50) {
        ctx.shadowBlur = (load - 50) * 0.4;
        ctx.shadowColor = color;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(0, 0, 0.4 * scale, 0, 2 * Math.PI);
      ctx.fillStyle = '#0f172a'; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.fillRect(-0.1 * scale, -0.5 * scale, 0.2 * scale, 0.2 * scale);
      ctx.restore();
    };
    drawGear(g1x, g1y, rot1, '#3b82f6'); 
    drawGear(g2x, g2y, rot2, '#94a3b8'); 
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#00ff88';
    ctx.fillText('SYS :: EXTERNAL_GEAR_PUMP', 40, 170);
    ctx.fillStyle = intakeColor;
    ctx.fillText(`INTAKE FLOW : ${(Math.abs(speed) * 100).toFixed(1)} L/m`, 40, 195);
    ctx.fillStyle = dischargeColor;
    ctx.fillText(`HEAD PRESS  : ${(loadFactor * 300).toFixed(0)} PSI`, 40, 215);
    ctx.fillStyle = '#fff';
    ctx.fillText(`DISP VOL    : 14.2 cc/rev`, 40, 235);
  }, [angle, load]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
export const FluidFilmCavitationSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<{a: number, r: number, size: number, life: number}[]>([]);
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
    const R_bearing = 5.0; 
    const clearance = 0.5; 
    const R_journal = R_bearing - clearance; 
    const loadFactor = load / 100;
    const ecc = 0.9 * clearance * loadFactor;
    const phi = -Math.PI / 4;
    const jx = ecc * Math.cos(phi);
    const jy = ecc * Math.sin(phi);
    const [bx, by] = toScreen(0, 0);
    ctx.beginPath(); ctx.arc(bx, by, (R_bearing + 1.0) * scale, 0, 2*Math.PI);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'; ctx.fill();
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 6 * zoom; ctx.stroke();
    ctx.beginPath(); ctx.arc(bx, by, R_bearing * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#050d1a'; ctx.fill(); 
    ctx.save();
    ctx.translate(bx, by);
    for(let i=0; i<360; i++) {
      const th = i * (Math.PI / 180);
      const nextTh = (i+1) * (Math.PI / 180);
      const dh_dth = ecc * Math.sin(th - phi);
      let pColor = 'rgba(71, 85, 105, 0.4)'; 
      if (dh_dth < -0.05) { 
        const pLevel = Math.min(1.0, (-dh_dth) / clearance * 3);
        pColor = `rgba(255, 51, 102, ${0.4 + pLevel * 0.6})`;
      } else if (dh_dth > 0.05 && loadFactor > 0.3) { 
        const cLevel = Math.min(1.0, (dh_dth) / clearance * 3);
        pColor = `rgba(0, 212, 255, ${0.4 + cLevel * 0.4})`;
      }
      ctx.beginPath();
      const jSurfX = jx * scale + (R_journal) * scale * Math.cos(th);
      const jSurfY = -(jy * scale + (R_journal) * scale * Math.sin(th));
      const bSurfX = R_bearing * scale * Math.cos(th);
      const bSurfY = -R_bearing * scale * Math.sin(th);
      const nextJSurfX = jx * scale + (R_journal) * scale * Math.cos(nextTh);
      const nextJSurfY = -(jy * scale + (R_journal) * scale * Math.sin(nextTh));
      const nextBSurfX = R_bearing * scale * Math.cos(nextTh);
      const nextBSurfY = -R_bearing * scale * Math.sin(nextTh);
      ctx.moveTo(jSurfX, jSurfY);
      ctx.lineTo(bSurfX, bSurfY);
      ctx.lineTo(nextBSurfX, nextBSurfY);
      ctx.lineTo(nextJSurfX, nextJSurfY);
      ctx.closePath();
      ctx.fillStyle = pColor; ctx.fill();
      }
    ctx.restore();
    if (load > 30) {
      for(let i=0; i<loadFactor * 5; i++) {
        const spawnAng = phi + Math.PI/4 + Math.random() * (Math.PI/2);
        const h = clearance - ecc * Math.cos(spawnAng - phi);
        const rSpawn = R_journal + Math.random() * h;
        bubblesRef.current.push({
          a: spawnAng,
          r: rSpawn,
          size: 0.05 + Math.random() * 0.1,
          life: 1.0
        });
      }
    }
    const nextBubbles = [];
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for(const b of bubblesRef.current) {
      b.a -= 0.05; 
      b.life -= 0.02;
      b.size += 0.01; 
      if (b.life > 0) {
        const bx_pos = jx + b.r * Math.cos(b.a);
        const by_pos = jy + b.r * Math.sin(b.a);
        const [sbx, sby] = toScreen(bx_pos, by_pos);
        ctx.beginPath(); ctx.arc(sbx, sby, b.size * scale, 0, 2*Math.PI);
        ctx.fill();
        nextBubbles.push(b);
      } else {
        const bx_pos = jx + b.r * Math.cos(b.a);
        const by_pos = jy + b.r * Math.sin(b.a);
        const [sbx, sby] = toScreen(bx_pos, by_pos);
        ctx.beginPath(); ctx.arc(sbx, sby, (b.size + 0.1) * scale, 0, 2*Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'; ctx.lineWidth = 2*zoom; ctx.stroke();
      }
    }
    bubblesRef.current = nextBubbles;
    const [sjx, sjy] = toScreen(jx, jy);
    ctx.beginPath(); ctx.arc(sjx, sjy, R_journal * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#1e293b'; ctx.fill();
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 4 * zoom; ctx.stroke();
    ctx.beginPath(); ctx.arc(sjx, sjy, 0.1 * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#fff'; ctx.fill();
    ctx.save();
    ctx.translate(sjx, sjy);
    ctx.rotate(-angle);
    ctx.beginPath(); ctx.moveTo(-R_journal*scale, 0); ctx.lineTo(R_journal*scale, 0); ctx.strokeStyle = '#334155'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -R_journal*scale); ctx.lineTo(0, R_journal*scale); ctx.stroke();
    ctx.restore();
    const [fx, fy] = toScreen(0, 0);
    const fMag = loadFactor * 3.0;
    if (fMag > 0.1) {
      ctx.beginPath();
      ctx.moveTo(fx, fy + 1*scale); ctx.lineTo(fx, fy + 1*scale + fMag*scale);
      ctx.strokeStyle = '#ff3366'; ctx.lineWidth = 4 * zoom; ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(fx, fy + 1*scale + fMag*scale);
      ctx.lineTo(fx - 0.3*scale, fy + 1*scale + fMag*scale - 0.4*scale);
      ctx.lineTo(fx + 0.3*scale, fy + 1*scale + fMag*scale - 0.4*scale);
      ctx.fillStyle = '#ff3366'; ctx.fill();
      }
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 250, 110);
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.strokeRect(30, 150, 250, 110);
    const minH = clearance - ecc; 
    ctx.font = '10px monospace';
    ctx.fillStyle = '#00d4ff'; ctx.fillText('SYS :: FLUID_FILM_CAVITATION', 40, 170);
    ctx.fillStyle = '#ffb703'; ctx.fillText(`JOURNAL RPM : ${(angle * 180 / Math.PI).toFixed(0)}`, 40, 195);
    ctx.fillStyle = '#fff'; ctx.fillText(`ECCENTRICITY: ${(ecc / clearance).toFixed(2)} ε`, 40, 215);
    ctx.fillStyle = minH < 0.05 ? '#ff3366' : '#00ff88'; 
    ctx.fillText(`MIN FILM    : ${minH.toFixed(3)} mm`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const FourBarLinkageSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const scale = (Math.min(width, height) / 12) * zoom; 
    const originX = width * 0.35; 
    const originY = height * 0.7; 
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
    const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, w: number) => {
      ctx.beginPath();
      const [sx1, sy1] = toScreen(x1, y1);
      const [sx2, sy2] = toScreen(x2, y2);
      ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2);
      ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke();
    };
    const drawCircle = (x: number, y: number, r: number, color: string, fill = false) => {
      ctx.beginPath();
      const [sx, sy] = toScreen(x, y);
      ctx.arc(sx, sy, r * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      if (fill) { ctx.fillStyle = color; ctx.fill(); }
    };
    const a = 2.0; 
     const b = 6.0; 
    const c = 5.0; 
    const d = 5.5; 
    const Ax = 0; const Ay = 0;
    const Dx = d; const Dy = 0;
    const Bx = a * Math.cos(angle);
    const By = a * Math.sin(angle);
    const L_BD = Math.hypot(Bx - Dx, By - Dy);
    let Cx = 0; let Cy = 0;
    if (L_BD <= b + c && L_BD >= Math.abs(b - c)) {
      const alpha = Math.acos((b * b + L_BD * L_BD - c * c) / (2 * b * L_BD));
      const phi = Math.atan2(Dy - By, Dx - Bx);
      Cx = Bx + b * Math.cos(phi - alpha);
      Cy = By + b * Math.sin(phi - alpha);
    } else {
      Cx = Bx; Cy = By; 
    }
    const L_ext = 2.0;
    const angleBC = Math.atan2(Cy - By, Cx - Bx);
    const Ex = Cx + L_ext * Math.cos(angleBC);
    const Ey = Cy + L_ext * Math.sin(angleBC);
    traceRef.current.push({ x: Ex, y: Ey });
    if (traceRef.current.length > 150) traceRef.current.shift();
    if (traceRef.current.length > 1) {
      ctx.beginPath();
      for (let i = 0; i < traceRef.current.length; i++) {
        const pt = traceRef.current[i];
        const [sx, sy] = toScreen(pt.x, pt.y);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
        }
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.4)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    const loadFactor = load / 100;
    const stressColor = `rgb(${loadFactor * 255}, ${212 - loadFactor * 100}, 255)`;
    drawLine(Ax, Ay, Dx, Dy, '#1e293b', 14);
    drawCircle(Ax, Ay, 0.4, '#475569', true);
    drawCircle(Dx, Dy, 0.4, '#475569', true);
    drawLine(Ax, Ay, Bx, By, '#3b82f6', 10);
    drawLine(Dx, Dy, Cx, Cy, '#94a3b8', 10);
    drawLine(Bx, By, Ex, Ey, stressColor, 8);
    if (load > 60) {
      ctx.shadowBlur = (load - 60) * 0.4;
      ctx.shadowColor = stressColor;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    drawCircle(Bx, By, 0.25, '#fff', true);
    drawCircle(Cx, Cy, 0.25, '#fff', true);
    drawCircle(Ex, Ey, 0.2, '#00d4ff', true);
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(width - 260, 150, 220, 110);
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.strokeRect(width - 260, 150, 220, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#00d4ff';
    ctx.fillText('SYS :: FOUR_BAR_LINKAGE', width - 250, 170);
    ctx.fillStyle = '#fff';
     const outAngle = Math.atan2(Cy - Dy, Cx - Dx);
    const normOut = ((outAngle * 180 / Math.PI) % 360 + 360) % 360;
    ctx.fillText(`OUTPUT ANG : ${normOut.toFixed(1)}°`, width - 250, 195);
    ctx.fillStyle = '#00ff88';
    ctx.fillText(`TRACER Y   : ${Ey.toFixed(2)}`, width - 250, 215);
  }, [angle, load]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
export const GenevaDriveSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revCount = useRef(0);
  const lastTheta = useRef(0);
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
    const originY = height * 0.5;
    const N = 6; 
    const CENTER_DIST = 2.4; 
    const R = 1.6; 
    const slotDepth = 1.2;
    const theta = angle % (Math.PI * 2);
    let normalized = theta;
    if (normalized < 0) normalized += Math.PI * 2;
    let shiftedTheta = normalized > Math.PI ? normalized - Math.PI * 2 : normalized;
    if (lastTheta.current > Math.PI * 1.5 && shiftedTheta < -Math.PI * 0.5) revCount.current += 1;
    if (lastTheta.current < -Math.PI * 1.5 && shiftedTheta > Math.PI * 0.5) revCount.current -= 1;
    lastTheta.current = shiftedTheta;
    let drivenAngle = 0;
    let isEngaged = false;
    if (shiftedTheta > -Math.PI / N && shiftedTheta < Math.PI / N) {
      isEngaged = true;
      drivenAngle = Math.atan2(Math.sin(shiftedTheta), Math.sqrt(2) - Math.cos(shiftedTheta));
    } else {
      const sector = Math.round(normalized / (Math.PI * 2 / N));
      drivenAngle = (sector * Math.PI * 2) / N / N;
    }
    const totalDriven = drivenAngle - revCount.current * (Math.PI * 2 / N);
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
    const drawCircle = (cx: number, cy: number, r: number, color: string, fill = false) => {
      ctx.beginPath();
      const [sx, sy] = toScreen(cx, cy);
      ctx.arc(sx, sy, r * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      if (fill) { ctx.fillStyle = color; ctx.fill(); }
    };
    ctx.save();
    const [dx, dy] = toScreen(CENTER_DIST, 0);
    ctx.translate(dx, dy);
    ctx.rotate(-totalDriven);
    const drivenR = 2.0;
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const aCenter = (i * Math.PI * 2) / N;
      ctx.arc(0, 0, drivenR * scale, -aCenter - 0.2, -aCenter + 0.2);
      const slotX = (drivenR - slotDepth) * scale;
      ctx.lineTo(slotX * Math.cos(-aCenter + 0.05), -slotX * Math.sin(-aCenter + 0.05));
      ctx.lineTo(slotX * Math.cos(-aCenter - 0.05), -slotX * Math.sin(-aCenter - 0.05));
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(168, 85, 247, 0.15)';
    ctx.fill();
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 0.3 * scale, 0, 2 * Math.PI);
    ctx.fillStyle = '#6b21a8'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.stroke();
    ctx.restore();
    ctx.save();
    const [cx, cy] = toScreen(0, 0);
    ctx.translate(cx, cy);
    ctx.rotate(-angle);
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.9 * scale, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
    ctx.fill();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-R * 0.4 * scale, 0, R * 0.7 * scale, Math.PI / 4, -Math.PI / 4, true);
    ctx.strokeStyle = !isEngaged && load > 60 ? '#fca5a5' : '#38bdf8';
    ctx.lineWidth = 6;
    if (!isEngaged && load > 60) {
      ctx.shadowBlur = (load - 60) * 0.5;
      ctx.shadowColor = '#ef4444';
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(R * scale, 0);
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = Math.max(6, scale * 0.2);
     ctx.stroke();
    ctx.beginPath();
    ctx.arc(R * scale, 0, 0.18 * scale, 0, 2 * Math.PI);
    ctx.fillStyle = isEngaged ? (load > 60 ? '#fca5a5' : '#fff') : '#00d4ff';
    ctx.fill();
    if (isEngaged) {
      ctx.shadowBlur = 15 + (load / 100) * 20;
      ctx.shadowColor = load > 60 ? '#ef4444' : '#00d4ff';
      ctx.strokeStyle = load > 60 ? '#ef4444' : '#00d4ff';
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else {
      ctx.strokeStyle = '#00d4ff';
      ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(0, 0, 0.2 * scale, 0, 2 * Math.PI);
    ctx.fillStyle = '#1d4ed8'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
    ctx.setLineDash([4, 4]);
    drawCircle(0, 0, R, 'rgba(0, 212, 255, 0.3)');
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 220, 110);
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
    ctx.strokeRect(30, 150, 220, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#a855f7';
    ctx.fillText('SYS :: GENEVA_DRIVE', 40, 170);
    ctx.fillStyle = '#fff';
    const normAngle = ((angle * 180 / Math.PI) % 360 + 360) % 360;
    ctx.fillText(`DRIVE ANGLE  : ${normAngle.toFixed(1)}°`, 40, 195);
    ctx.fillStyle = isEngaged ? '#00ff88' : '#38bdf8';
    ctx.fillText(`STATE        : ${isEngaged ? 'ENGAGED' : 'LOCKED'}`, 40, 215);
    ctx.fillStyle = '#ff6b35';
    ctx.fillText(`DRIVEN ANGLE : ${(totalDriven * 180 / Math.PI).toFixed(1)}°`, 40, 235);
  }, [angle, load]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
export const HarmonicDriveSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const scale = (Math.min(width, height) / 8) * zoom; 
    const originX = width * 0.5;
    const originY = height * 0.5;
    const N_circ = 60;
    const N_flex = 58;
    const ratio = (N_flex - N_circ) / N_flex; 
    const outputAngle = angle * ratio;
    const R_circ = 2.0;
    const flex_deformation = 0.15; 
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
    const drawGear = (
      numTeeth: number,
      rot: number,
      radiusFunc: (theta: number) => number,
      color: string,
      internal: boolean,
      fillColor?: string
    ) => {
      ctx.beginPath();
      for (let i = 0; i <= numTeeth * 4; i++) {
        const a = (i / (numTeeth * 4)) * Math.PI * 2;
        const toothPhase = i % 4;
        const baseR = radiusFunc(a);
         const teethDepth = 0.08;
        let r = baseR;
        if (internal) {
          if (toothPhase === 1 || toothPhase === 2) r = baseR - teethDepth;
          if (toothPhase === 3 || toothPhase === 0) r = baseR + teethDepth;
        } else {
          if (toothPhase === 1 || toothPhase === 2) r = baseR + teethDepth;
          if (toothPhase === 3 || toothPhase === 0) r = baseR - teethDepth;
        }
        const px = r * Math.cos(a + rot) * scale;
        const py = r * Math.sin(a + rot) * scale;
        if (i === 0) ctx.moveTo(originX + px, originY - py);
        else ctx.lineTo(originX + px, originY - py);
      }
      ctx.closePath();
      if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    };
    drawGear(
      N_circ,
      0, 
      () => R_circ,
      '#0ea5e9',
      true,
      'rgba(14, 165, 233, 0.1)'
      );
    const flexSplineShape = (theta: number) => {
      const globalTheta = theta + outputAngle;
      const relToWaveGen = globalTheta - angle;
      return R_circ - flex_deformation * Math.sin(relToWaveGen) * Math.sin(relToWaveGen);
    };
    drawGear(
      N_flex,
      outputAngle,
      flexSplineShape,
      '#a855f7',
      false,
      'rgba(168, 85, 247, 0.2)'
    );
    ctx.beginPath();
    ctx.arc(originX, originY, 1.2 * scale, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(168, 85, 247, 0.2)'; ctx.fill();
    ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 1; ctx.stroke();
    ctx.save();
    ctx.translate(originX, originY);
    ctx.rotate(-angle); 
    const wgR = Math.round(236 + (load/100)*19);
    const wgG = Math.round(72 - (load/100)*72);
    const wgB = Math.round(153 - (load/100)*153);
    ctx.beginPath();
    ctx.ellipse(0, 0, (R_circ - flex_deformation * 0.1) * scale, (R_circ - flex_deformation * 1.5) * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${wgR}, ${wgG}, ${wgB}, ${0.3 + (load/100)*0.2})`;
    ctx.fill();
    ctx.strokeStyle = `rgb(${wgR}, ${wgG}, ${wgB})`;
    ctx.lineWidth = 3 + (load/100)*2;
    if (load > 60) {
      ctx.shadowBlur = load - 60;
      ctx.shadowColor = `rgb(${wgR}, ${wgG}, ${wgB})`;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(0, 0, 0.3 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#be185d';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 260, 110);
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.3)';
    ctx.strokeRect(30, 150, 260, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ec4899';
    ctx.fillText('SYS :: HARMONIC_DRIVE', 40, 170);
    ctx.fillStyle = '#fff';
    const normInput = ((angle * 180 / Math.PI) % 360 + 360) % 360;
    const normOutput = ((outputAngle * 180 / Math.PI) % 360 + 360) % 360;
    ctx.fillText(`INPUT (WAVE GEN) : ${normInput.toFixed(1)}°`, 40, 195);
    ctx.fillStyle = '#a855f7';
    ctx.fillText(`OUT (FLEX SPLINE): ${normOutput.toFixed(1)}°`, 40, 215);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`REDUCTION RATIO  : 1 : ${Math.abs(Math.round(1/ratio))}`, 40, 235);
  }, [angle, load]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
export const HobermanSphereSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
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
    const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, w: number) => {
      ctx.beginPath();
      const [sx1, sy1] = toScreen(x1, y1); const [sx2, sy2] = toScreen(x2, y2);
      ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2);
      ctx.strokeStyle = color; ctx.lineWidth = w * zoom; ctx.lineCap = 'round'; ctx.stroke();
    };
    const N = 12; 
    const theta = 2 * Math.PI / N;
    const L = 3.5; 
    const maxR = L / (2 * Math.sin(theta / 2)) - 0.1; 
    const minR = 1.5;
    const loadFactor = load / 100;
    const R = minR + loadFactor * (maxR - minR);
    const cosAlpha = (2 * R * Math.sin(theta / 2)) / L;
    const alpha = Math.acos(Math.min(1, Math.max(-1, cosAlpha)));
    const rot = angle * 0.2; 
    for (let i = 0; i < N; i++) {
      const phi_i = i * theta + rot;
      const Cx = R * Math.cos(phi_i);
      const Cy = R * Math.sin(phi_i);
      const tangentAngle = phi_i + Math.PI / 2;
      const a1 = tangentAngle + alpha;
      const a2 = tangentAngle - alpha;
      const p1_out_x = Cx + (L/2) * Math.cos(a1);
      const p1_out_y = Cy + (L/2) * Math.sin(a1);
      const p1_in_x = Cx - (L/2) * Math.cos(a1);
      const p1_in_y = Cy - (L/2) * Math.sin(a1);
      const p2_out_x = Cx + (L/2) * Math.cos(a2);
      const p2_out_y = Cy + (L/2) * Math.sin(a2);
      const p2_in_x = Cx - (L/2) * Math.cos(a2);
      const p2_in_y = Cy - (L/2) * Math.sin(a2);
      drawLine(p1_in_x, p1_in_y, p1_out_x, p1_out_y, '#00d4ff', 6);
      drawLine(p2_in_x, p2_in_y, p2_out_x, p2_out_y, '#a855f7', 6);
      const [sx, sy] = toScreen(Cx, Cy);
      ctx.beginPath(); ctx.arc(sx, sy, 0.15 * scale, 0, 2*Math.PI);
      ctx.fillStyle = '#fff'; ctx.fill();
      const [sox, soy] = toScreen(p1_out_x, p1_out_y);
      ctx.beginPath(); ctx.arc(sox, soy, 0.1 * scale, 0, 2*Math.PI);
      ctx.fillStyle = '#1e293b'; ctx.fill(); ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 2*zoom; ctx.stroke();
      const [six, siy] = toScreen(p1_in_x, p1_in_y);
      ctx.beginPath(); ctx.arc(six, siy, 0.1 * scale, 0, 2*Math.PI);
      ctx.fillStyle = '#1e293b'; ctx.fill(); ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 2*zoom; ctx.stroke();
    }
    const [cenX, cenY] = toScreen(0, 0);
    const grad = ctx.createRadialGradient(cenX, cenY, 0, cenX, cenY, R * scale);
    grad.addColorStop(0, `rgba(0, 212, 255, ${0.1 + loadFactor*0.1})`);
    grad.addColorStop(1, 'rgba(0, 212, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cenX, cenY, R * scale, 0, 2*Math.PI); ctx.fill();
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    const area = Math.PI * R * R;
    const minArea = Math.PI * minR * minR;
    const ratio = area / minArea;
    ctx.font = '10px monospace';
    ctx.fillStyle = '#a855f7'; ctx.fillText('SYS :: HOBERMAN_SPHERE_2D', 40, 170);
    ctx.fillStyle = '#00d4ff'; ctx.fillText(`RADIUS      : ${R.toFixed(2)} cm`, 40, 195);
    ctx.fillStyle = '#fff'; ctx.fillText(`SCISSOR ANG : ${(alpha * 180 / Math.PI).toFixed(1)}°`, 40, 215);
    ctx.fillStyle = '#ffb703'; ctx.fillText(`AREA EXPANS : ${ratio.toFixed(1)}X`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const HookesJointSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const traceRef = useRef<{t: number, speed: number}[]>([]);
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
    const originX = width * 0.4;
    const originY = height * 0.5;
    ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }
    const toScreen = (x: number, y: number) => [originX + x * scale, originY - y * scale];
    const loadFactor = load / 100;
    const beta = loadFactor * (Math.PI / 3); 
    const alpha = angle;
    const gamma = Math.atan2(Math.sin(alpha) * Math.cos(beta), Math.cos(alpha));
    const speedRatio = Math.cos(beta) / (1 - Math.pow(Math.sin(alpha) * Math.sin(beta), 2));
    const project = (x: number, y: number, z: number) => {
      return toScreen(x + z * 0.3, y - z * 0.2);
    };
    const yokeRadius = 1.5;
    const yokeLength = 2.0;
    const drawYoke = (rot: number, shaftAngle: number, color: string, isInput: boolean) => {
      ctx.save();
      const pts = [
        {x: -6, y: 0, z: 0},
        {x: -yokeLength, y: 0, z: 0},
        {x: -yokeLength, y: yokeRadius * Math.cos(rot), z: yokeRadius * Math.sin(rot)},
        {x: 0, y: yokeRadius * Math.cos(rot), z: yokeRadius * Math.sin(rot)},
        {x: -yokeLength, y: -yokeRadius * Math.cos(rot), z: -yokeRadius * Math.sin(rot)},
        {x: 0, y: -yokeRadius * Math.cos(rot), z: -yokeRadius * Math.sin(rot)},
      ];
      const transformed = pts.map(p => {
        let px = p.x; let py = p.y; let pz = p.z;
        if (!isInput) {
           px = -px;
          const nx = px * Math.cos(shaftAngle) - py * Math.sin(shaftAngle);
          const ny = px * Math.sin(shaftAngle) + py * Math.cos(shaftAngle);
          return {x: nx, y: ny, z: pz};
        }
        return p;
      });
      const screenPts = transformed.map(p => project(p.x, p.y, p.z));
      ctx.beginPath();
      ctx.moveTo(screenPts[0][0], screenPts[0][1]);
      ctx.lineTo(screenPts[1][0], screenPts[1][1]);
      ctx.strokeStyle = color; ctx.lineWidth = 12 * zoom; ctx.lineCap = 'round'; ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(screenPts[2][0], screenPts[2][1]);
      ctx.lineTo(screenPts[4][0], screenPts[4][1]);
      ctx.lineWidth = 10 * zoom; ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(screenPts[2][0], screenPts[2][1]);
      ctx.lineTo(screenPts[3][0], screenPts[3][1]);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(screenPts[4][0], screenPts[4][1]);
      ctx.lineTo(screenPts[5][0], screenPts[5][1]);
      ctx.stroke();
      ctx.restore();
    };
    const drawCross = (alpha: number, gamma: number, beta: number) => {
      const cr = yokeRadius;
      const c1 = {x: 0, y: cr * Math.cos(alpha), z: cr * Math.sin(alpha)};
      const c2 = {x: 0, y: -cr * Math.cos(alpha), z: -cr * Math.sin(alpha)};
       const out_rot = gamma + Math.PI/2;
      const c3_pre = {x: 0, y: cr * Math.cos(out_rot), z: cr * Math.sin(out_rot)};
      const c4_pre = {x: 0, y: -cr * Math.cos(out_rot), z: -cr * Math.sin(out_rot)};
      const c3 = {
        x: c3_pre.x * Math.cos(beta) - c3_pre.y * Math.sin(beta),
        y: c3_pre.x * Math.sin(beta) + c3_pre.y * Math.cos(beta),
        z: c3_pre.z
      };
      const c4 = {
        x: c4_pre.x * Math.cos(beta) - c4_pre.y * Math.sin(beta),
        y: c4_pre.x * Math.sin(beta) + c4_pre.y * Math.cos(beta),
        z: c4_pre.z
      };
      const s1 = project(c1.x, c1.y, c1.z);
      const s2 = project(c2.x, c2.y, c2.z);
      const s3 = project(c3.x, c3.y, c3.z);
      const s4 = project(c4.x, c4.y, c4.z);
      ctx.beginPath();
      ctx.moveTo(s1[0], s1[1]); ctx.lineTo(s2[0], s2[1]);
      ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 8 * zoom; ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s3[0], s3[1]); ctx.lineTo(s4[0], s4[1]);
      ctx.stroke();
      const rC = Math.round(168 + loadFactor * 87);
      const stressColor = `rgb(${rC}, 85, 247)`;
      ctx.beginPath();
      const center = project(0, 0, 0);
      ctx.arc(center[0], center[1], 8 * zoom, 0, 2*Math.PI);
      ctx.fillStyle = stressColor; ctx.fill();
    };
    if (Math.sin(alpha) > 0) {
      drawYoke(gamma + Math.PI/2, beta, '#00d4ff', false); 
      drawCross(alpha, gamma, beta);
      drawYoke(alpha, 0, '#3b82f6', true); 
    } else {
      drawYoke(alpha, 0, '#3b82f6', true); 
      drawCross(alpha, gamma, beta);
      drawYoke(gamma + Math.PI/2, beta, '#00d4ff', false); 
    }
    const graphX = width - 260;
    const graphY = 150;
    traceRef.current.push({ t: angle, speed: speedRatio });
    if (traceRef.current.length > 100) traceRef.current.shift();
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(graphX - 20, graphY - 100, 260, 200);
    ctx.strokeStyle = '#475569'; ctx.strokeRect(graphX - 20, graphY - 100, 260, 200);
    ctx.beginPath(); ctx.moveTo(graphX - 20, graphY); ctx.lineTo(graphX + 240, graphY); ctx.strokeStyle = '#334155'; ctx.stroke();
    if (traceRef.current.length > 1) {
      ctx.beginPath();
      for (let i = 0; i < traceRef.current.length; i++) {
        const pt = traceRef.current[i];
        const gx = graphX + (i / 100) * 220;
        const gy = graphY - (pt.speed - 1) * 80;
        if (i === 0) ctx.moveTo(gx, gy); else ctx.lineTo(gx, gy);
      }
      ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 2; ctx.stroke();
    }
    ctx.font = '10px monospace';
    ctx.fillStyle = '#fff'; ctx.fillText('SPEED RATIO (OUT/IN)', graphX, graphY - 80);
    ctx.fillStyle = '#00d4ff'; ctx.fillText(`RATIO: ${speedRatio.toFixed(3)}`, graphX, graphY + 80);
     ctx.fillStyle = '#ffb703'; ctx.fillText(`DEFLECTION: ${(beta * 180 / Math.PI).toFixed(1)}°`, graphX, graphY + 60);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const IBeamStressSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const originY = height * 0.5;
    const oscillatingForce = Math.sin(angle) * (load / 100);
    const L = 8.0; 
    const H = 1.0; 
    const maxDeflection = oscillatingForce * 1.5; 
    const getDeflection = (x: number) => {
      const nx = (x + L/2) / L;
      return maxDeflection * Math.sin(nx * Math.PI);
    };
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
    const drawSupport = (x: number, y: number) => {
      const [sx, sy] = toScreen(x, y);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx - 20, sy + 30);
      ctx.lineTo(sx + 20, sy + 30);
      ctx.closePath();
      ctx.fillStyle = '#64748b'; ctx.fill();
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.arc(sx - 10, sy + 35, 5, 0, 2*Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(sx + 10, sy + 35, 5, 0, 2*Math.PI); ctx.stroke();
    };
    drawSupport(-L/2, -H/2);
    drawSupport(L/2, -H/2);
    const segments = 40;
    const dx = L / segments;
    for (let i = 0; i < segments; i++) {
      const x1 = -L/2 + i * dx;
      const x2 = x1 + dx;
       const y1_mid = getDeflection(x1);
      const y2_mid = getDeflection(x2);
      const [sx1, sy1_mid] = toScreen(x1, y1_mid);
      const [sx2, sy2_mid] = toScreen(x2, y2_mid);
      const hScreen = H * scale;
      const nx1 = Math.abs(x1) / (L/2); 
      const moment = (1 - nx1) * Math.abs(oscillatingForce);
      const topColor = oscillatingForce > 0 
        ? `rgb(${255 * moment}, ${100 - 100*moment}, ${255 - 200*moment})` 
        : `rgb(${50 + 50*moment}, ${150 + 105*moment}, 255)`; 
      ctx.beginPath();
      ctx.moveTo(sx1, sy1_mid - hScreen/2);
      ctx.lineTo(sx2, sy2_mid - hScreen/2);
      ctx.lineTo(sx2, sy2_mid - hScreen/2 + hScreen*0.2);
      ctx.lineTo(sx1, sy1_mid - hScreen/2 + hScreen*0.2);
      ctx.fillStyle = topColor; ctx.fill();
      const botColor = oscillatingForce < 0 
        ? `rgb(${255 * moment}, ${100 - 100*moment}, ${255 - 200*moment})` 
        : `rgb(${50 + 50*moment}, ${150 + 105*moment}, 255)`; 
      ctx.beginPath();
      ctx.moveTo(sx1, sy1_mid + hScreen/2);
      ctx.lineTo(sx2, sy2_mid + hScreen/2);
      ctx.lineTo(sx2, sy2_mid + hScreen/2 - hScreen*0.2);
      ctx.lineTo(sx1, sy1_mid + hScreen/2 - hScreen*0.2);
      ctx.fillStyle = botColor; ctx.fill();
      ctx.beginPath();
      ctx.moveTo(sx1, sy1_mid - hScreen/2 + hScreen*0.2);
      ctx.lineTo(sx2, sy2_mid - hScreen/2 + hScreen*0.2);
      ctx.lineTo(sx2, sy2_mid + hScreen/2 - hScreen*0.2);
      ctx.lineTo(sx1, sy1_mid + hScreen/2 - hScreen*0.2);
      ctx.fillStyle = '#475569'; ctx.fill();
    }
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const x = -L/2 + i * dx;
      const [sx, sy] = toScreen(x, getDeflection(x) + H/2);
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const x = -L/2 + i * dx;
      const [sx, sy] = toScreen(x, getDeflection(x) - H/2);
      if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    const [fx, fyBase] = toScreen(0, getDeflection(0) + H/2 + 0.5 * Math.sign(oscillatingForce));
    const arrowLen = 50 * Math.abs(oscillatingForce) + 20;
    const arrowDir = oscillatingForce > 0 ? -1 : 1;
    ctx.beginPath();
    ctx.moveTo(fx, fyBase);
    ctx.lineTo(fx, fyBase - arrowLen * arrowDir);
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(fx, fyBase);
    ctx.lineTo(fx - 10, fyBase - 15 * arrowDir);
    ctx.lineTo(fx + 10, fyBase - 15 * arrowDir);
    ctx.fillStyle = '#f97316';
     ctx.fill();
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(width - 260, 150, 220, 110);
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.3)';
    ctx.strokeRect(width - 260, 150, 220, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#f97316';
    ctx.fillText('SYS :: BEAM_STRESS_ANALYSIS', width - 250, 170);
    ctx.fillStyle = '#fff';
    ctx.fillText(`APPLIED FORCE: ${(oscillatingForce * 1000).toFixed(0)} N`, width - 250, 195);
    ctx.fillStyle = Math.abs(oscillatingForce) > 0.5 ? '#ff4444' : '#00ff88';
    ctx.fillText(`MAX STRESS   : ${(Math.abs(oscillatingForce) * 250).toFixed(1)} MPa`, width - 250, 215);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`DEFLECTION   : ${(maxDeflection * 10).toFixed(2)} mm`, width - 250, 235);
  }, [angle, load]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
export const InvertedPendulumSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const scale = (Math.min(width, height) / 12) * zoom; 
    const originX = width * 0.5;
    const originY = height * 0.8; 
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
    const drawCircle = (x: number, y: number, r: number, color: string, fill = false) => {
      ctx.beginPath();
      const [sx, sy] = toScreen(x, y);
      ctx.arc(sx, sy, r * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      if (fill) { ctx.fillStyle = color; ctx.fill(); }
    };
    const t = angle;
    const loadFactor = load / 100; 
    const disturbance = loadFactor * Math.sin(t * 1.5);
    const jitter = loadFactor > 0 ? (Math.sin(t * 12.0) * 0.05 + Math.sin(t * 8.0) * 0.03) : 0;
    const theta = disturbance * 0.4 + jitter;
    const cartX = disturbance * 4.0 + jitter * 2.0;
    const cartY = 0;
    const L = 6.0; 
    const bobX = cartX + L * Math.sin(theta);
    const bobY = cartY + L * Math.cos(theta); 
    const effort = Math.abs(theta) / 0.5; 
    const rC = Math.round(59 + effort * 196);
    const gC = Math.round(130 - effort * 130);
    const bC = Math.round(246 - effort * 150);
    const stressColor = `rgb(${rC}, ${gC}, ${bC})`;
    ctx.beginPath();
    const [gx1, gy1] = toScreen(-8, -0.4);
    const [gx2, gy2] = toScreen(8, -0.4);
    ctx.moveTo(gx1, gy1); ctx.lineTo(gx2, gy2);
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 4; ctx.stroke();
    const cartW = 3.0 * scale;
    const cartH = 1.2 * scale;
    const [cx, cy] = toScreen(cartX, cartY);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - cartW/2, cy - cartH/2, cartW, cartH);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - cartW/2, cy - cartH/2, cartW, cartH);
    drawCircle(cartX - 1.0, cartY - 0.6, 0.3, '#94a3b8', true);
    drawCircle(cartX + 1.0, cartY - 0.6, 0.3, '#94a3b8', true);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    const [px, py] = toScreen(bobX, bobY);
     ctx.lineTo(px, py);
    ctx.strokeStyle = stressColor;
    ctx.lineWidth = 8;
    if (effort > 0.5) {
      ctx.shadowBlur = effort * 20;
      ctx.shadowColor = stressColor;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    drawCircle(bobX, bobY, 0.8, '#1e293b', true);
    drawCircle(bobX, bobY, 0.8, stressColor, false);
    drawCircle(cartX, cartY, 0.2, '#fff', true);
    if (Math.abs(theta) > 0.01) {
      ctx.beginPath();
      const thrustDir = theta > 0 ? 1 : -1;
      const [tx, ty] = toScreen(cartX - thrustDir * 1.5, cartY);
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx - thrustDir * 1.5 * effort, ty - 10);
      ctx.lineTo(tx - thrustDir * 1.5 * effort, ty + 10);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 51, 102, 0.8)';
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(255, 51, 102, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ff3366';
    ctx.fillText('SYS :: INVERTED_PENDULUM', 40, 170);
    ctx.fillStyle = '#fff';
    ctx.fillText(`THETA ERR : ${(theta * 180 / Math.PI).toFixed(2)}°`, 40, 195);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`CART POS  : ${cartX.toFixed(2)} m`, 40, 215);
    ctx.fillStyle = stressColor;
    ctx.fillText(`PID EFFORT: ${(effort * 100).toFixed(0)}%`, 40, 235);
  }, [angle, load]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
export const JournalBearingSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const scale = (Math.min(width, height) / 8) * zoom; 
    const originX = width * 0.5;
    const originY = height * 0.5;
    ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }
    const toScreen = (x: number, y: number) => [originX + x * scale, originY - y * scale];
    const R_b = 3.0; 
    const C = 0.5;   
    const R_j = R_b - C; 
    const loadFactor = load / 100;
    const eps = loadFactor * 0.95;
    const e = eps * C;
    const phi = (90 - 50 * eps) * (Math.PI / 180);
    const cx = e * Math.sin(phi);
    const cy = -e * Math.cos(phi);
    const [bx, by] = toScreen(0, 0);
    ctx.beginPath(); ctx.arc(bx, by, R_b * scale + 40, 0, 2*Math.PI);
    ctx.fillStyle = '#0f172a'; ctx.fill();
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 6; ctx.stroke();
    ctx.save();
    ctx.translate(bx, by);
    ctx.beginPath(); ctx.arc(0, 0, R_b * scale, 0, 2*Math.PI);
    ctx.fillStyle = 'rgba(0, 212, 255, 0.2)'; ctx.fill();
    ctx.beginPath();
    const numPoints = 120;
    for (let i = 0; i <= numPoints; i++) {
      const th = (i / numPoints) * 2 * Math.PI;
      const th_rel = th - (Math.PI/2 + phi);
      let p = (eps * Math.sin(th_rel)) / Math.pow(1 + eps * Math.cos(th_rel), 3);
      if (p < 0) p = 0; 
      const pScale = p * 40; 
      const r_p = R_b * scale - pScale; 
      const px = r_p * Math.cos(th);
      const py = -r_p * Math.sin(th);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    const rC = Math.round(148 + loadFactor * 107);
    const stressColor = `rgb(${rC}, 85, 247)`;
    ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.fill();
    ctx.strokeStyle = stressColor; ctx.lineWidth = 3; ctx.stroke();
    ctx.restore();
    const [jx, jy] = toScreen(cx, cy);
    ctx.save();
    ctx.translate(jx, jy);
    ctx.rotate(-angle);
    ctx.beginPath(); ctx.arc(0, 0, R_j * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#1e293b'; ctx.fill();
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 4; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 4, 0, 2*Math.PI); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(R_j * scale, 0); ctx.stroke();
    ctx.restore();
    ctx.beginPath(); ctx.arc(bx, by, 3, 0, 2*Math.PI); ctx.fillStyle = '#ef4444'; ctx.fill();
    if (load > 0) {
      const fx = jx;
      const fy = jy;
      const arrowLen = 20 + loadFactor * 80;
      ctx.beginPath(); ctx.moveTo(fx, fy - R_j*scale - arrowLen); ctx.lineTo(fx, fy - R_j*scale);
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 6; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(fx, fy - R_j*scale); ctx.lineTo(fx - 10, fy - R_j*scale - 15); ctx.lineTo(fx + 10, fy - R_j*scale - 15);
      ctx.fillStyle = '#ef4444'; ctx.fill();
    }
    const min_x = cx - R_j * Math.sin(phi); 
    const min_y = cy + R_j * Math.cos(phi);
    const [mx, my] = toScreen(min_x, min_y);
    ctx.beginPath(); ctx.arc(mx, my, 8, 0, 2*Math.PI);
    ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 2; ctx.stroke();
  }, [angle, load]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const KlannLinkageSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const originY = height * 0.5;
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
    const R = 2.0;
    const L = 2.5 * R;
    const Ox = 0; const Oy = 0;
    const P_x = -L; const P_y = 0;
    const drawLeg = (theta: number, color: string, isFront: boolean) => {
      const Ax = R * Math.cos(theta);
      const Ay = R * Math.sin(theta);
      const dx = Ax - P_x, dy = Ay - P_y;
      const d = Math.hypot(dx, dy);
      let Bx = 0, By = 0, Fx = 0, Fy = 0;
      if (d <= 2*L && d > 0) {
        const a = d / 2;
        const h = Math.sqrt(L*L - a*a);
        const M_x = P_x + (dx * a) / d;
        const M_y = P_y + (dy * a) / d;
        Bx = M_x + h * (dy / d);
        By = M_y - h * (dx / d);
        Fx = Ax + 2.0 * (Bx - Ax);
        Fy = Ay + 2.0 * (By - Ay);
      }
      if (isFront) {
        traceRef.current.push({ x: Fx, y: Fy });
        if (traceRef.current.length > 200) traceRef.current.shift();
      }
      const w = isFront ? 8 : 4;
      const c2 = isFront ? '#cbd5e1' : '#64748b';
      if (isFront && load > 50) {
        ctx.shadowBlur = (load - 50) * 0.4;
        ctx.shadowColor = color;
      }
      drawLine(Ox, Oy, Ax, Ay, color, w); 
      drawLine(P_x, P_y, Bx, By, c2, w); 
      drawLine(Ax, Ay, Fx, Fy, color, w); 
      ctx.shadowBlur = 0;
      const r_j = isFront ? 0.3 : 0.2;
      drawCircle(Ax, Ay, r_j, '#fff', true);
      drawCircle(Bx, By, r_j, '#fff', true);
      drawCircle(Fx, Fy, r_j, color, true);
    };
    const loadFactor = load / 100;
    const rC = Math.round(0 + loadFactor * 255);
    const gC = Math.round(212 - loadFactor * 100);
    const stressColor = `rgb(${rC}, ${gC}, 255)`;
    if (traceRef.current.length > 1) {
       ctx.beginPath();
      for (let i = 0; i < traceRef.current.length; i++) {
        const pt = traceRef.current[i];
        const [sx, sy] = toScreen(pt.x, pt.y);
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.4)'; ctx.lineWidth = 3; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
    }
    drawLeg(angle + Math.PI, '#475569', false);
    drawLeg(angle, stressColor, true);
    drawCircle(Ox, Oy, 0.4, '#1e293b', true); drawCircle(Ox, Oy, 0.2, '#fff', true);
    drawCircle(P_x, P_y, 0.4, '#1e293b', true); drawCircle(P_x, P_y, 0.2, '#fff', true);
    drawLine(Ox, Oy, P_x, P_y, '#334155', 12);
    const [, gy] = toScreen(0, -6.5);
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(width, gy);
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 4; ctx.stroke();
  }, [angle, load]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const LeafSpringSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
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
    const originY = height * 0.4;
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
    const loadFactor = load / 100;
    const vibration = Math.sin(angle * 5) * 0.2 * (loadFactor > 0 ? 1 : 0.2);
    const maxDeflection = -3.0; 
    const deflection = loadFactor * maxDeflection + vibration;
    const y_center = 3.0 + deflection; 
    const numLeaves = 5;
    const leafThickness = 0.3;
    const [cmx, cmy] = toScreen(0, y_center + 0.5);
    ctx.fillStyle = '#1e293b'; ctx.fillRect(cmx - 1*scale, cmy, 2*scale, 1.5*scale);
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 2 * zoom; ctx.strokeRect(cmx - 1*scale, cmy, 2*scale, 1.5*scale);
    ctx.beginPath();
    const [ub1x, ub1y] = toScreen(-0.6, y_center - numLeaves * leafThickness - 0.2);
    const [ub1y2] = toScreen(-0.6, y_center + 1.5);
    ctx.moveTo(ub1x, ub1y); ctx.lineTo(ub1x, ub1y2);
    const [ub2x, ub2y] = toScreen(0.6, y_center - numLeaves * leafThickness - 0.2);
    ctx.moveTo(ub2x, ub2y); ctx.lineTo(ub2x, ub1y2);
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3 * zoom; ctx.stroke();
    const stressColor = loadFactor > 0.5 ? `rgba(255, 51, 102, ${loadFactor})` : '#cbd5e1';
    for (let i = 0; i < numLeaves; i++) {
      const leafLength = 5.0 - i * 0.8;
      const current_y_offset = y_center - i * leafThickness;
      const current_a = -current_y_offset / 25.0; 
      ctx.beginPath();
      for (let x = -leafLength; x <= leafLength; x += 0.2) {
        const y = current_a * x * x + current_y_offset;
        const [px, py] = toScreen(x, y);
        if (x === -leafLength) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      const [pxL, pyL] = toScreen(leafLength, current_a * leafLength * leafLength + current_y_offset);
      ctx.lineTo(pxL, pyL);
      ctx.strokeStyle = i === 0 ? stressColor : '#94a3b8';
      ctx.lineWidth = leafThickness * scale * 0.8; 
      if (i === 0 && load > 50) {
        ctx.shadowBlur = (load - 50) * 0.2;
        ctx.shadowColor = '#ff3366';
      }
      ctx.stroke(); ctx.shadowBlur = 0;
      if (i === 0) {
        const [leyex, leyey] = toScreen(-5, 0);
        ctx.beginPath(); ctx.arc(leyex, leyey, 0.4*scale, 0, 2*Math.PI);
        ctx.strokeStyle = stressColor; ctx.lineWidth = 4 * zoom; ctx.stroke();
        const [reyex, reyey] = toScreen(5, 0);
        ctx.beginPath(); ctx.arc(reyex, reyey, 0.4*scale, 0, 2*Math.PI);
        ctx.stroke();
      }
    }
    const fake_dx = loadFactor * 0.8;
    const rightEyeX = 5.0 + fake_dx;
    const rightEyeY = 0;
    const [reyex, reyey] = toScreen(rightEyeX, rightEyeY);
    ctx.fillStyle = '#050d1a'; ctx.beginPath(); ctx.arc(reyex, reyey, 0.5*scale, 0, 2*Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(reyex, reyey, 0.4*scale, 0, 2*Math.PI); ctx.strokeStyle = stressColor; ctx.stroke();
    const frameMountX = 5.0;
    const frameMountY = -1.5;
    drawLine(rightEyeX, rightEyeY, frameMountX, frameMountY, '#64748b', 8);
    const drawMount = (x: number, y: number) => {
      const [mx, my] = toScreen(x, y);
      ctx.fillStyle = '#1e293b'; ctx.fillRect(mx - 0.6*scale, my - 0.8*scale, 1.2*scale, 0.8*scale);
      ctx.strokeStyle = '#475569'; ctx.strokeRect(mx - 0.6*scale, my - 0.8*scale, 1.2*scale, 0.8*scale);
      ctx.beginPath(); ctx.arc(mx, my, 0.15*scale, 0, 2*Math.PI); ctx.fillStyle = '#fff'; ctx.fill();
    };
    drawMount(-5.0, 0);
    drawMount(frameMountX, frameMountY);
    drawLine(-6, -1.5, 6, -1.5, '#334155', 12);
    const [lax, lay] = toScreen(0, y_center + 1.5);
    const fMag = loadFactor * 2.0 + 0.5;
    ctx.beginPath();
    ctx.moveTo(lax, lay + 2*scale); ctx.lineTo(lax, lay + 2*scale - fMag*scale);
    ctx.strokeStyle = '#ffb703'; ctx.lineWidth = 4 * zoom; ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(lax, lay + 2*scale);
    ctx.lineTo(lax - 0.3*scale, lay + 2.4*scale);
    ctx.lineTo(lax + 0.3*scale, lay + 2.4*scale);
    ctx.fillStyle = '#ffb703'; ctx.fill();
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    const strain = (loadFactor * 100).toFixed(1);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#00ff88'; ctx.fillText('SYS :: LEAF_SPRING', 40, 170);
    ctx.fillStyle = '#ffb703'; ctx.fillText(`AXLE LOAD   : ${(loadFactor * 5000).toFixed(0)} N`, 40, 195);
    ctx.fillStyle = '#ff3366'; ctx.fillText(`DEFLECTION  : ${Math.abs(deflection).toFixed(2)} cm`, 40, 215);
    ctx.fillStyle = '#fff'; ctx.fillText(`MAX STRAIN  : ${strain} %`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const MalteseCrossSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastTheta = useRef(angle);
  const accumPhi = useRef(0);
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
    const d = 5.0; 
    const R = d / Math.SQRT2; 
    let theta = angle % (2 * Math.PI);
    if (theta < 0) theta += 2 * Math.PI;
    const driveX = d/2; const driveY = 0;
    const crossX = -d/2; const crossY = 0;
    let relTheta = theta - Math.PI;
    if (relTheta < -Math.PI) relTheta += 2*Math.PI;
    if (relTheta > Math.PI) relTheta -= 2*Math.PI;
    let isEngaged = false;
    let dPhi = 0;
    if (Math.abs(relTheta) <= Math.PI/4) {
      isEngaged = true;
      const currentPhi = Math.atan2(Math.sin(relTheta), Math.SQRT2 - Math.cos(relTheta));
      let lastRel = (lastTheta.current % (2*Math.PI)) - Math.PI;
      if (lastRel < -Math.PI) lastRel += 2*Math.PI;
      if (lastRel > Math.PI) lastRel -= 2*Math.PI;
      if (Math.abs(lastRel) <= Math.PI/4) {
        const lastPhi = Math.atan2(Math.sin(lastRel), Math.SQRT2 - Math.cos(lastRel));
        dPhi = currentPhi - lastPhi;
      }
    }
    if (!isEngaged) {
      const target = Math.round(accumPhi.current / (Math.PI/2)) * (Math.PI/2);
      accumPhi.current += (target - accumPhi.current) * 0.1; 
    } else {
      accumPhi.current += dPhi;
    }
    lastTheta.current = angle;
    const loadFactor = load / 100;
    const stressColor = isEngaged ? `rgb(${Math.round(100 + loadFactor*155)}, 85, 247)` : '#a855f7';
    const [dx, dy] = toScreen(driveX, driveY);
    ctx.beginPath(); ctx.arc(dx, dy, R * scale, 0, 2*Math.PI);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'; ctx.fill();
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 4; ctx.stroke();
    ctx.beginPath();
    ctx.arc(dx, dy, R * scale * 0.5, theta + Math.PI/4 + Math.PI, theta - Math.PI/4 + Math.PI);
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 12 * zoom; ctx.stroke();
    const pinX = driveX + R * Math.cos(theta);
    const pinY = driveY + R * Math.sin(theta);
     const [px, py] = toScreen(pinX, pinY);
    ctx.beginPath(); ctx.arc(px, py, 0.4 * scale, 0, 2*Math.PI);
    ctx.fillStyle = stressColor; ctx.fill();
    ctx.save();
    const [cx, cy] = toScreen(crossX, crossY);
    ctx.translate(cx, cy);
    ctx.rotate(-accumPhi.current);
    const crossRadius = d - R + 0.5; 
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = stressColor;
    ctx.lineWidth = 4 * zoom;
    if (isEngaged && load > 50) {
      ctx.shadowBlur = (load - 50) * 0.5;
      ctx.shadowColor = stressColor;
    }
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.rotate(i * Math.PI/2);
      ctx.beginPath();
      ctx.arc(d, 0, R * 0.5 * scale, Math.PI - 0.4, Math.PI + 0.4, true);
      ctx.lineTo(1.5 * scale, -0.4 * scale);
      ctx.lineTo(1.5 * scale, 0.4 * scale);
      ctx.lineTo((crossRadius - 0.5) * scale, 0.4 * scale);
      ctx.stroke();
      ctx.fillStyle = '#050d1a';
      ctx.fillRect(0.8 * scale, -0.42 * scale, (crossRadius - 1.0) * scale, 0.84 * scale);
      ctx.restore();
    }
    ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(0, 0, 0.8 * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#a855f7'; ctx.fill();
    ctx.restore();
    ctx.beginPath(); ctx.arc(dx, dy, 0.3 * scale, 0, 2*Math.PI); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#a855f7'; ctx.fillText('SYS :: MALTESE_CROSS', 40, 170);
    ctx.fillStyle = '#fff'; ctx.fillText(`DRIVE ANGLE : ${(theta * 180 / Math.PI).toFixed(0)}°`, 40, 195);
    ctx.fillStyle = '#00d4ff'; ctx.fillText(`CROSS ANGLE : ${(accumPhi.current * 180 / Math.PI).toFixed(0)}°`, 40, 215);
    ctx.fillStyle = isEngaged ? '#00ff88' : '#ff3366';
    ctx.fillText(`STATE : ${isEngaged ? 'ENGAGED' : 'LOCKED'}`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const MassSpringDamperSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const traceRef = useRef<{a: number, base: number, mass: number}[]>([]);
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
    const originX = width * 0.4;
    const originY = height * 0.5;
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
    const t = angle;
    const w = 2.0; 
    const wn = 3.0; 
    const r = w / wn; 
    const zeta = 0.05 + (load / 100) * 0.95;
    const num = Math.sqrt(1 + Math.pow(2 * zeta * r, 2));
    const den = Math.sqrt(Math.pow(1 - r * r, 2) + Math.pow(2 * zeta * r, 2));
    const TR = num / den; 
    const phase = Math.atan2(2 * zeta * Math.pow(r, 3), 1 - r * r + Math.pow(2 * zeta * r, 2));
    const Y_base = 2.0;
    const yBase = Y_base * Math.sin(t * w);
    const yMass = Y_base * TR * Math.sin(t * w - phase);
    const baseY = -5.0 + yBase;
    const massY = 3.0 + yMass; 
    ctx.fillStyle = '#334155';
    const [bx, by] = toScreen(0, baseY);
    ctx.fillRect(bx - 4 * scale, by, 8 * scale, 0.4 * scale);
    const [mx, my] = toScreen(0, massY);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(mx - 3 * scale, my - 2 * scale, 6 * scale, 4 * scale);
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3;
    ctx.strokeRect(mx - 3 * scale, my - 2 * scale, 6 * scale, 4 * scale);
    const springX = -1.5;
    ctx.beginPath();
    let [spX, spY] = toScreen(springX, baseY);
    ctx.moveTo(spX, spY);
    const numCoils = 8;
    const springLen = massY - baseY - 2.0; 
    for (let i = 0; i <= numCoils; i++) {
      const cy = baseY + (i / numCoils) * springLen;
      const cx = springX + (i % 2 === 0 ? 0.8 : -0.8);
      const [px, py] = toScreen(cx, cy);
      ctx.lineTo(px, py);
    }
    const [spEndX, spEndY] = toScreen(springX, massY - 2.0);
    ctx.lineTo(spEndX, spEndY);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.stroke();
    const damperX = 1.5;
    const [dcX1, dcY1] = toScreen(damperX - 0.6, baseY);
    const [dcX2, dcY2] = toScreen(damperX + 0.6, baseY + springLen * 0.6)
     ctx.fillStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.fillRect(dcX1, dcY1, dcX2 - dcX1, dcY2 - dcY1);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.strokeRect(dcX1, dcY1, dcX2 - dcX1, dcY2 - dcY1);
    const [dpX, dpY] = toScreen(damperX, massY - 2.0);
    const [dpEndX, dpEndY] = toScreen(damperX, massY - 2.0 - springLen * 0.4);
    ctx.beginPath();
    ctx.moveTo(dpX, dpY);
    ctx.lineTo(dpEndX, dpEndY);
    ctx.moveTo(dpEndX - 0.5 * scale, dpEndY);
    ctx.lineTo(dpEndX + 0.5 * scale, dpEndY);
    const rC = Math.round(0 + zeta * 255);
    const gC = Math.round(255 - zeta * 255);
    const bC = 136;
    ctx.strokeStyle = `rgb(${rC}, ${gC}, ${bC})`;
    ctx.lineWidth = 4;
    if (zeta > 0.5) {
      ctx.shadowBlur = zeta * 15;
      ctx.shadowColor = `rgb(${rC}, ${gC}, ${bC})`;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    traceRef.current.push({ a: t, base: yBase, mass: yMass });
    if (traceRef.current.length > 200) traceRef.current.shift();
    const graphX = originX + 5 * scale;
    const graphY = originY - 1 * scale;
    ctx.beginPath();
    ctx.moveTo(graphX, graphY - 3 * scale);
    ctx.lineTo(graphX, graphY + 3 * scale);
    ctx.moveTo(graphX, graphY);
    ctx.lineTo(graphX + 5 * scale, graphY);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();
    if (traceRef.current.length > 1) {
      ctx.beginPath();
      for (let i = 0; i < traceRef.current.length; i++) {
        const pt = traceRef.current[i];
        const gx = graphX + (i / 200) * 5 * scale;
        const gy = graphY - pt.base * 0.5 * scale; 
        if (i === 0) ctx.moveTo(gx, gy);
        else ctx.lineTo(gx, gy);
      }
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      for (let i = 0; i < traceRef.current.length; i++) {
        const pt = traceRef.current[i];
        const gx = graphX + (i / 200) * 5 * scale;
        const gy = graphY - pt.mass * 0.5 * scale; 
        if (i === 0) ctx.moveTo(gx, gy);
        else ctx.lineTo(gx, gy);
      }
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#00ff88';
    ctx.fillText('SYS :: MASS_SPRING_DAMPER', 40, 170);
    ctx.fillStyle = '#fff';
    ctx.fillText(`DAMPING ZETA : ${zeta.toFixed(2)}`, 40, 195);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`AMP RATIO TR : ${TR.toFixed(2)}`, 40, 215);
    ctx.fillStyle = '#a855f7';
    ctx.fillText(`PHASE DELAY  : ${(phase * 180 / Math.PI).toFixed(1)}°`, 40, 235);
  }, [angle, load]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
export const MohrsCircleSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
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
    const originX = width * 0.7; 
    const originY = height * 0.5;
    ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }
    const toScreen = (x: number, y: number) => [originX + x * scale, originY - y * scale];
    const sigma_x = 80;
    const sigma_y = -30;
    const loadFactor = load / 100;
    const tau_xy = 20 + loadFactor * 60; 
    const C = (sigma_x + sigma_y) / 2;
    const R = Math.sqrt(Math.pow((sigma_x - sigma_y)/2, 2) + Math.pow(tau_xy, 2));
    const sigma_1 = C + R;
    const sigma_2 = C - R;
    const theta = angle; 
    const sig_x_prime = C + ((sigma_x - sigma_y)/2) * Math.cos(2*theta) + tau_xy * Math.sin(2*theta);
    const sig_y_prime = C - ((sigma_x - sigma_y)/2) * Math.cos(2*theta) - tau_xy * Math.sin(2*theta);
    const tau_prime = -((sigma_x - sigma_y)/2) * Math.sin(2*theta) + tau_xy * Math.cos(2*theta);
    const st = 0.04; 
    ctx.beginPath();
    const [leftX, axisY] = toScreen(-100 * st, 0);
    const [rightX] = toScreen(150 * st, 0);
    ctx.moveTo(leftX, axisY); ctx.lineTo(rightX, axisY);
    const [topX, topY] = toScreen(0, 100 * st);
    const [botX, botY] = toScreen(0, -100 * st);
    ctx.moveTo(topX, topY); ctx.lineTo(botX, botY);
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 1 * zoom; ctx.stroke();
    const [cx, cy] = toScreen(C * st, 0);
    ctx.beginPath(); ctx.arc(cx, cy, R * st * scale, 0, 2*Math.PI);
    ctx.fillStyle = 'rgba(255, 51, 102, 0.1)'; ctx.fill();
    ctx.strokeStyle = '#ff3366'; ctx.lineWidth = 2 * zoom; ctx.stroke();
    const [s1x, s1y] = toScreen(sigma_1 * st, 0);
    const [s2x, s2y] = toScreen(sigma_2 * st, 0);
    ctx.beginPath(); ctx.arc(s1x, s1y, 0.2*scale, 0, 2*Math.PI); ctx.fillStyle = '#00ff88'; ctx.fill();
    ctx.beginPath(); ctx.arc(s2x, s2y, 0.2*scale, 0, 2*Math.PI); ctx.fill();
    const [px1, py1] = toScreen(sig_x_prime * st, -tau_prime * st); 
    const [px2, py2] = toScreen(sig_y_prime * st, tau_prime * st); 
    ctx.beginPath(); ctx.moveTo(px1, py1); ctx.lineTo(px2, py2);
    ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 2 * zoom; ctx.stroke();
    ctx.beginPath(); ctx.arc(px1, py1, 0.3*scale, 0, 2*Math.PI); ctx.fillStyle = '#00d4ff'; ctx.fill();
    ctx.beginPath(); ctx.arc(px2, py2, 0.3*scale, 0, 2*Math.PI); ctx.fillStyle = '#a855f7'; ctx.fill();
    ctx.font = `${12*zoom}px monospace`;
    ctx.fillStyle = '#00d4ff'; ctx.fillText('X\' FACE', px1 + 10, py1 - 10);
    ctx.fillStyle = '#a855f7'; ctx.fillText('Y\' FACE', px2 + 10, py2 - 10);
    ctx.fillStyle = '#00ff88'; ctx.fillText('σ1', s1x + 10, s1y - 10);
    ctx.fillText('σ2', s2x - 20, s2y - 10);
    const elemOriginX = width * 0.25;
    const elemOriginY = height * 0.5;
    ctx.save();
    ctx.translate(elemOriginX, elemOriginY);
    ctx.rotate(-theta); 
    const s = 1.5; 
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(-s*scale, -s*scale, 2*s*scale, 2*s*scale);
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2 * zoom;
    ctx.strokeRect(-s*scale, -s*scale, 2*s*scale, 2*s*scale);
    const drawStressArrow = (x: number, y: number, angle: number, mag: number, color: string) => {
      ctx.save();
      ctx.translate(x*scale, -y*scale);
      ctx.rotate(angle);
      const len = 0.5 + Math.abs(mag) * 0.01; 
      const dir = mag >= 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(dir * len * scale, 0);
      ctx.strokeStyle = color; ctx.lineWidth = 3 * zoom; ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(dir * len * scale, 0);
      ctx.lineTo(dir * len * scale - dir * 0.2*scale, -0.15*scale);
      ctx.lineTo(dir * len * scale - dir * 0.2*scale, 0.15*scale);
      ctx.fillStyle = color; ctx.fill();
      ctx.restore();
    };
    drawStressArrow(s, 0, 0, sig_x_prime, '#00d4ff'); 
    drawStressArrow(-s, 0, Math.PI, sig_x_prime, '#00d4ff'); 
    drawStressArrow(0, s, -Math.PI/2, sig_y_prime, '#a855f7'); 
    drawStressArrow(0, -s, Math.PI/2, sig_y_prime, '#a855f7'); 
    drawStressArrow(s, 0, -Math.PI/2, tau_prime, '#ffb703'); 
    drawStressArrow(-s, 0, Math.PI/2, tau_prime, '#ffb703'); 
    drawStressArrow(0, s, 0, tau_prime, '#ffb703'); 
    drawStressArrow(0, -s, Math.PI, tau_prime, '#ffb703'); 
    ctx.restore();
    ctx.fillStyle = '#fff'; ctx.fillText(`θ = ${(theta * 180 / Math.PI % 360).toFixed(1)}°`, elemOriginX - 20, elemOriginY + s*scale + 40);
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(255, 51, 102, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ff3366'; ctx.fillText('SYS :: MOHRS_CIRCLE', 40, 170);
    ctx.fillStyle = '#00d4ff'; ctx.fillText(`σ_x' : ${sig_x_prime.toFixed(1)} MPa`, 40, 195);
    ctx.fillStyle = '#a855f7'; ctx.fillText(`σ_y' : ${sig_y_prime.toFixed(1)} MPa`, 40, 215);
    ctx.fillStyle = '#ffb703'; ctx.fillText(`τ_x'y': ${tau_prime.toFixed(1)} MPa`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const OldhamCouplingSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const originY = height * 0.5;
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
    const drawCircle = (x: number, y: number, r: number, color: string, fill = false) => {
      ctx.beginPath();
      const [sx, sy] = toScreen(x, y);
      ctx.arc(sx, sy, r * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      if (fill) { ctx.fillStyle = color; ctx.fill(); }
    };
    const offset = 2.0; 
    const R = 3.5; 
    const inX = -offset / 2;
    const inY = 0;
    const outX = offset / 2;
    const outY = 0;
    const midX = (offset / 2) * Math.cos(2 * -angle);
    const midY = (offset / 2) * Math.sin(2 * -angle);
    const loadFactor = load / 100;
    const loadAlpha = 0.2 + loadFactor * 0.4;
    const glow = load > 50;
    const drawDisc = (cx: number, cy: number, rotAngle: number, color: string, rgb: string, isCross = false) => {
      ctx.save();
      const [sx, sy] = toScreen(cx, cy);
      ctx.translate(sx, sy);
      ctx.rotate(rotAngle);
      ctx.beginPath();
      ctx.arc(0, 0, R * scale, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(${rgb}, ${isCross ? loadAlpha + 0.1 : loadAlpha - 0.1})`;
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      if (isCross && glow) {
        ctx.shadowBlur = (load - 50) * 0.4;
        ctx.shadowColor = color;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      const slotWidth = 0.6 * scale;
      if (isCross) {
        ctx.fillStyle = `rgba(${rgb}, 0.8)`;
        ctx.fillRect(-R * scale, -slotWidth/2, R*2*scale, slotWidth);
        ctx.fillRect(-slotWidth/2, -R * scale, slotWidth, R*2*scale);
      } else {
        ctx.fillStyle = '#050d1a'; 
        ctx.fillRect(-R * scale, -slotWidth/2, R*2*scale, slotWidth);
        ctx.strokeStyle = color;
        ctx.strokeRect(-R * scale, -slotWidth/2, R*2*scale, slotWidth);
      }
      ctx.beginPath();
      ctx.arc(0, 0, 0.4 * scale, 0, 2 * Math.PI);
      ctx.fillStyle = '#1e293b'; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
      ctx.restore();
    };
    drawDisc(inX, inY, -angle, '#ef4444', '239, 68, 68');
    drawDisc(outX, outY, -angle + Math.PI/2, '#3b82f6', '59, 130, 246');
    drawDisc(midX, midY, -angle, '#10b981', '16, 185, 129', true);
    ctx.beginPath();
    const [origX, origY] = toScreen(0, 0);
    ctx.arc(origX, origY, (offset / 2) * scale, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
     ctx.stroke();
    ctx.setLineDash([]);
    drawCircle(inX, inY, 0.15, '#fff', true);
    drawCircle(outX, outY, 0.15, '#fff', true);
    drawCircle(midX, midY, 0.15, '#10b981', true);
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#a855f7';
    ctx.fillText('SYS :: OLDHAM_COUPLING', 40, 170);
    ctx.fillStyle = '#ef4444';
    ctx.fillText(`INPUT RPM  : SYNCHRONIZED`, 40, 195);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`OUTPUT RPM : SYNCHRONIZED`, 40, 215);
    ctx.fillStyle = '#10b981';
    ctx.fillText(`ORBIT RATE : 2X SHAFT RPM`, 40, 235);
  }, [angle, load]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
export const OttoCycleSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const originY = height * 0.7; 
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
    const drawCircle = (x: number, y: number, r: number, color: string, fill = false) => {
      ctx.beginPath();
      const [sx, sy] = toScreen(x, y);
      ctx.arc(sx, sy, r * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      if (fill) { ctx.fillStyle = color; ctx.fill(); }
    };
    const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, w: number) => {
      ctx.beginPath();
      const [sx1, sy1] = toScreen(x1, y1);
      const [sx2, sy2] = toScreen(x2, y2);
      ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2);
      ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke();
    };
    const R = 2.0; 
    const L = 5.0; 
    const theta = -angle + Math.PI / 2;
    const pinX = R * Math.cos(theta);
    const pinY = R * Math.sin(theta);
    const pistonX = 0;
    const pistonY = pinY + Math.sqrt(L * L - pinX * pinX);
    let cycleAngle = (angle % (4 * Math.PI) + 4 * Math.PI) % (4 * Math.PI);
    let strokeName = '';
    let gasColor = '';
    let intakeValveOpen = false;
    let exhaustValveOpen = false;
    let spark = false;
    const loadFactor = load / 100;
    if (cycleAngle >= 0 && cycleAngle < Math.PI) {
      strokeName = 'INTAKE';
      intakeValveOpen = true;
      gasColor = 'rgba(0, 212, 255, 0.4)'; 
    } else if (cycleAngle >= Math.PI && cycleAngle < 2 * Math.PI) {
      strokeName = 'COMPRESSION';
      const progress = (cycleAngle - Math.PI) / Math.PI;
      const r = Math.round(progress * 255);
      const b = Math.round(255 - progress * 255);
      gasColor = `rgba(${r}, 0, ${b}, 0.6)`;
    } else if (cycleAngle >= 2 * Math.PI && cycleAngle < 3 * Math.PI) {
      strokeName = 'POWER';
      if (cycleAngle < 2 * Math.PI + 0.3) spark = true;
      const progress = (cycleAngle - 2 * Math.PI) / Math.PI;
      const g = Math.round(200 * (1 - progress));
      gasColor = `rgba(255, ${g}, 0, 0.8)`;
    } else {
      strokeName = 'EXHAUST';
      exhaustValveOpen = true;
      gasColor = 'rgba(100, 116, 139, 0.5)'; 
    }
    const cylWidth = 3.2;
    const tdcY = R + L;
    const bdcY = -R + L;
    const cylTop = tdcY + 0.5; 
    const [gx, gy1] = toScreen(-cylWidth/2 + 0.1, cylTop);
    const [, gy2] = toScreen(-cylWidth/2 + 0.1, pistonY);
    ctx.fillStyle = gasColor;
    ctx.fillRect(gx, gy1, (cylWidth - 0.2) * scale, gy2 - gy1);
    if (spark) {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(gx + (cylWidth/2)*scale, gy1 + 0.3*scale, 1.5*scale, 0, 2*Math.PI);
      ctx.shadowBlur = 30;
      ctx.shadowColor = '#fff';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
     ctx.strokeStyle = '#475569';
    ctx.lineWidth = 6;
    ctx.beginPath();
    const [cxL2, cyB2] = toScreen(-cylWidth/2, bdcY - 1);
    const [cxL3, cyT2] = toScreen(-cylWidth/2, cylTop);
    const [cxR, cyT3] = toScreen(cylWidth/2, cylTop);
    const [cxR2, cyB3] = toScreen(cylWidth/2, bdcY - 1);
    ctx.moveTo(cxL2, cyB2);
    ctx.lineTo(cxL3, cyT2);
    ctx.lineTo(cxR, cyT3);
    ctx.lineTo(cxR2, cyB3);
    ctx.stroke();
    const valveWidth = 0.8;
    const valveLift = 0.6;
    const intakeY = cylTop - (intakeValveOpen ? valveLift : 0);
    const exhaustY = cylTop - (exhaustValveOpen ? valveLift : 0);
    drawLine(-1.0, cylTop + 1.0, -1.0, intakeY, '#94a3b8', 4); 
    drawLine(-1.0 - valveWidth/2, intakeY, -1.0 + valveWidth/2, intakeY, '#cbd5e1', 6); 
    drawLine(1.0, cylTop + 1.0, 1.0, exhaustY, '#94a3b8', 4); 
    drawLine(1.0 - valveWidth/2, exhaustY, 1.0 + valveWidth/2, exhaustY, '#cbd5e1', 6); 
    drawLine(0, cylTop + 1.0, 0, cylTop, '#fff', 4);
    ctx.fillStyle = '#0f172a';
    const [pxL, pyTop] = toScreen(-cylWidth/2, cylTop + 0.8);
    ctx.fillRect(pxL, pyTop, cylWidth*scale, -1.0*scale); 
    const pistonH = 1.6;
    const [px, py] = toScreen(-cylWidth/2 + 0.1, pistonY);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px, py, (cylWidth - 0.2) * scale, pistonH * scale);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.strokeRect(px, py, (cylWidth - 0.2) * scale, pistonH * scale);
    const stressColor = strokeName === 'POWER' 
      ? `rgb(255, ${200 - loadFactor*150}, 0)`
      : '#3b82f6';
    drawLine(pinX, pinY, pistonX, pistonY - 0.4, stressColor, 12);
    if (strokeName === 'POWER' && load > 40) {
      ctx.shadowBlur = (load - 40) * 0.5;
      ctx.shadowColor = stressColor;
      ctx.stroke();
      ctx.shadowBlur = 0;
      }
    drawCircle(pistonX, pistonY - 0.4, 0.3, '#fff', true);
    drawLine(0, 0, pinX, pinY, '#475569', 16);
    drawCircle(0, 0, R*0.6, '#1e293b', true);
    drawCircle(pinX, pinY, 0.4, '#fff', true);
    drawCircle(0, 0, 0.3, '#fff', true);
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(255, 51, 102, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ff3366';
    ctx.fillText('SYS :: OTTO_CYCLE', 40, 170);
    ctx.fillStyle = '#fff';
    ctx.fillText(`CURRENT STROKE : ${strokeName}`, 40, 195);
    ctx.fillStyle = '#00d4ff';
    const volume = (tdcY + 0.5 - pistonY);
    ctx.fillText(`CYL VOLUME     : ${volume.toFixed(2)} L`, 40, 215);
    ctx.fillStyle = '#ffb703';
    ctx.fillText(`CRANK ANGLE    : ${(cycleAngle * 180 / Math.PI).toFixed(0)}°`, 40, 235);
  }, [angle, load]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
export const PeaucellierLipkinSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const scale = (Math.min(width, height) / 20) * zoom; 
    const originX = width * 0.4;
    const originY = height * 0.5;
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
    const d = 3.0; 
    const r = 3.0; 
    const L = 8.0; 
    const a = 3.5; 
    const Ox = -d; const Oy = 0; 
    const Ax = 0;  const Ay = 0; 
    const maxTheta = Math.PI / 3;
    const theta = maxTheta * Math.sin(angle);
    const Bx = Ax + r * Math.cos(theta);
    const By = Ay + r * Math.sin(theta);
    const distOB = Math.hypot(Bx - Ox, By - Oy);
    let Cx = 0, Cy = 0, Dx = 0, Dy = 0, Ex = 0, Ey = 0;
    if (distOB <= L + a && distOB >= Math.abs(L - a) && distOB > 0) {
      const alpha = (L*L - a*a + distOB*distOB) / (2 * distOB);
      const h = Math.sqrt(L*L - alpha*alpha);
      const P2x = Ox + alpha * (Bx - Ox) / distOB;
      const P2y = Oy + alpha * (By - Oy) / distOB;
       Cx = P2x + h * (By - Oy) / distOB;
      Cy = P2y - h * (Bx - Ox) / distOB;
      Dx = P2x - h * (By - Oy) / distOB;
      Dy = P2y + h * (Bx - Ox) / distOB;
      Ex = 2 * P2x - Bx;
      Ey = 2 * P2y - By;
    }
    traceRef.current.push({ x: Ex, y: Ey });
    if (traceRef.current.length > 200) traceRef.current.shift();
    if (traceRef.current.length > 1) {
      ctx.beginPath();
      for (let i = 0; i < traceRef.current.length; i++) {
        const pt = traceRef.current[i];
        const [sx, sy] = toScreen(pt.x, pt.y);
        if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 3; ctx.stroke();
    }
    const loadFactor = load / 100;
    const stressColor = `rgb(${168 + loadFactor*87}, 85, ${247 - loadFactor*200})`;
    drawLine(Ox, Oy, Ax, Ay, '#334155', 12);
    drawCircle(Ox, Oy, 0.4, '#475569', true);
    drawCircle(Ax, Ay, 0.4, '#475569', true);
    drawLine(Ax, Ay, Bx, By, '#3b82f6', 8); 
    drawLine(Ox, Oy, Cx, Cy, '#94a3b8', 6);
    drawLine(Ox, Oy, Dx, Dy, '#94a3b8', 6);
    ctx.shadowBlur = load > 50 ? (load - 50) * 0.3 : 0;
    ctx.shadowColor = stressColor;
    drawLine(Bx, By, Cx, Cy, stressColor, 8);
    drawLine(Bx, By, Dx, Dy, stressColor, 8);
    drawLine(Cx, Cy, Ex, Ey, stressColor, 8);
    drawLine(Dx, Dy, Ex, Ey, stressColor, 8);
    ctx.shadowBlur = 0;
    drawCircle(Bx, By, 0.25, '#fff', true);
    drawCircle(Cx, Cy, 0.25, '#fff', true);
    drawCircle(Dx, Dy, 0.25, '#fff', true);
    drawCircle(Ex, Ey, 0.3, '#a855f7', true); 
  }, [angle, load]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const PeltonWheelSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<{x: number, y: number, vx: number, vy: number, active: boolean}[]>([]);
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
    const originX = width * 0.55;
    const originY = height * 0.5;
    ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }
    const toScreen = (x: number, y: number) => [originX + x * scale, originY - y * scale];
    const R_wheel = 4.0;
    const numBuckets = 12;
    const bucketPitch = 2 * Math.PI / numBuckets;
    const nozzleX = -8.0;
    const nozzleY = -R_wheel;
    const loadFactor = load / 100;
    const jetVelocity = 0.2 + loadFactor * 0.4;
    if (load > 0) {
      for(let i=0; i<3 * (loadFactor + 0.5); i++) {
        particlesRef.current.push({
          x: nozzleX + Math.random() * 0.5,
          y: nozzleY + (Math.random() - 0.5) * 0.4,
          vx: jetVelocity + Math.random() * 0.05,
          vy: 0,
          active: true
        });
        }
    }
    const activeParticles = [];
    for (const p of particlesRef.current) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.active && p.x > -0.5 && p.x < 1.0 && p.y > -R_wheel - 1.0 && p.y < -R_wheel + 1.0) {
        p.active = false; 
        const sign = Math.random() > 0.5 ? 1 : -1;
        p.vx = -p.vx * 0.4 * Math.random();
        p.vy = sign * (jetVelocity * 0.6 + Math.random() * 0.2);
      }
      if (!p.active) {
        p.vy -= 0.02;
      }
      if (p.y > -10 && p.x > -10) {
        activeParticles.push(p);
      }
    }
    particlesRef.current = activeParticles;
    ctx.fillStyle = `rgba(0, 255, 136, ${0.4 + loadFactor*0.4})`;
    for(const p of particlesRef.current) {
      const [px, py] = toScreen(p.x, p.y);
      ctx.beginPath(); ctx.arc(px, py, 0.08 * scale, 0, 2*Math.PI);
      ctx.fill();
    }
    if (load > 0) {
      const [njx, njy] = toScreen(nozzleX, nozzleY);
      const [hitx] = toScreen(0, nozzleY);
      ctx.beginPath();
      ctx.moveTo(njx, njy); ctx.lineTo(hitx, njy);
      ctx.strokeStyle = `rgba(0, 255, 136, ${0.2 + loadFactor*0.6})`;
      ctx.lineWidth = 10 * zoom; ctx.stroke();
    }
    const [nx, ny] = toScreen(nozzleX, nozzleY);
    ctx.beginPath();
    ctx.moveTo(nx - 2*scale, ny + scale);
    ctx.lineTo(nx, ny + 0.4*scale);
    ctx.lineTo(nx, ny - 0.4*scale);
    ctx.lineTo(nx - 2*scale, ny - scale);
    ctx.closePath();
    ctx.fillStyle = '#1e293b'; ctx.fill();
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3 * zoom; ctx.stroke();
    ctx.save();
    const [cx, cy] = toScreen(0, 0);
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath(); ctx.arc(0, 0, R_wheel * 0.8 * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#0f172a'; ctx.fill();
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 4 * zoom; ctx.stroke();
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#00ff88';
    if (load > 50) {
      ctx.shadowBlur = (load - 50) * 0.3;
      ctx.shadowColor = '#00ff88';
    }
    for (let i = 0; i < numBuckets; i++) {
      ctx.save();
      ctx.rotate(i * bucketPitch);
      ctx.translate(0, -R_wheel * scale); 
      ctx.beginPath();
      ctx.arc(0, 0, 0.6 * scale, 0, Math.PI, true); 
      ctx.lineTo(0.6 * scale, 0.4 * scale);
      ctx.lineTo(-0.6 * scale, 0.4 * scale);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 3 * zoom;
      ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -0.6 * scale); ctx.lineTo(0, 0.4 * scale);
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 1 * zoom; ctx.stroke();
      ctx.restore();
    }
    ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(0, 0, 0.5 * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#3b82f6'; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, 0.2 * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#fff'; ctx.fill();
    ctx.restore();
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
     ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    const power = (loadFactor * 100 * jetVelocity * 5).toFixed(1);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#00ff88'; ctx.fillText('SYS :: PELTON_WHEEL', 40, 170);
    ctx.fillStyle = '#00d4ff'; ctx.fillText(`JET VELOCITY: ${(jetVelocity * 100).toFixed(1)} m/s`, 40, 195);
    ctx.fillStyle = '#fff'; ctx.fillText(`TURBINE RPM : ${(angle * 180 / Math.PI).toFixed(0)}`, 40, 215);
    ctx.fillStyle = '#ffb703'; ctx.fillText(`OUTPUT PWR  : ${power} MW`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const PlanetaryGearSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const originY = height * 0.5;
    const SUN_R = 1.0;
    const PLANET_R = 1.2;
    const RING_R = SUN_R + 2 * PLANET_R;
    const NUM_PLANETS = 3;
    const ratio = 1 + RING_R / SUN_R;
    const carrierAngle = -angle / ratio;
    const planetSelfAngle = (angle / ratio) * (RING_R / PLANET_R);
    const CENTER_OFFSET = SUN_R + PLANET_R;
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
    const drawGear = (x: number, y: number, r: number, numTeeth: number, rot: number, color: string, internal = false) => {
      ctx.save();
      const [sx, sy] = toScreen(x, y);
      ctx.translate(sx, sy);
      ctx.rotate(rot);
      const teethDepth = 0.2;
      ctx.beginPath();
      for (let i = 0; i <= numTeeth * 4; i++) {
        const a = (i / (numTeeth * 4)) * Math.PI * 2;
        const toothPhase = i % 4;
        let radius = r;
        if (internal) {
          if (toothPhase === 1 || toothPhase === 2) radius = r - teethDepth;
          if (toothPhase === 3 || toothPhase === 0) radius = r + teethDepth;
        } else {
          if (toothPhase === 1 || toothPhase === 2) radius = r + teethDepth;
          if (toothPhase === 3 || toothPhase === 0) radius = r - teethDepth;
        }
        const px = radius * Math.cos(a) * scale;
        const py = radius * Math.sin(a) * scale;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      if (internal) {
        ctx.arc(0, 0, (r + 0.6) * scale, 0, Math.PI * 2, true);
        ctx.fillStyle = `rgba(${color}, 0.15)`;
        ctx.fill();
        ctx.strokeStyle = `rgb(${color})`;
        ctx.lineWidth = 3;
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(${color}, 0.15)`;
        ctx.fill();
        ctx.strokeStyle = `rgb(${color})`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      ctx.restore();
    };
    drawGear(0, 0, RING_R, 36, 0, '14, 165, 233', true); 
    const sunColor = load > 50 
      ? `${249 + (load-50)*0.12}, ${115 - (load-50)*1.5}, ${22 - (load-50)*0.4}` 
      : '249, 115, 22';
    drawGear(0, 0, SUN_R, 12, -angle, sunColor, false); 
    ctx.beginPath();
    ctx.arc(originX, originY, 0.2 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#ea580c'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    ctx.save();
    ctx.translate(originX, originY);
    ctx.rotate(carrierAngle); 
    ctx.beginPath();
    for (let i = 0; i < NUM_PLANETS; i++) {
      const a = (i * Math.PI * 2) / NUM_PLANETS;
      const px = Math.cos(a) * CENTER_OFFSET * scale;
      const py = Math.sin(a) * CENTER_OFFSET * scale;
      ctx.moveTo(0, 0);
      ctx.lineTo(px, py);
    }
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = Math.max(12, scale * 0.4);
    ctx.lineCap = 'round';
    ctx.stroke();
    for (let i = 0; i < NUM_PLANETS; i++) {
      const a = (i * Math.PI * 2) / NUM_PLANETS;
      ctx.save();
      const px = Math.cos(a) * CENTER_OFFSET * scale;
      const py = Math.sin(a) * CENTER_OFFSET * scale;
      ctx.translate(px, py);
      ctx.rotate(planetSelfAngle);
      const r = PLANET_R;
      const numTeeth = 14;
      const teethDepth = 0.2;
      ctx.beginPath();
      for (let j = 0; j <= numTeeth * 4; j++) {
        const ta = (j / (numTeeth * 4)) * Math.PI * 2;
        const tp = j % 4;
        let radius = r;
        if (tp === 1 || tp === 2) radius = r + teethDepth;
        if (tp === 3 || tp === 0) radius = r - teethDepth;
        const tx = radius * Math.cos(ta) * scale;
        const ty = radius * Math.sin(ta) * scale;
        if (j === 0) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(168, 85, 247, 0.15)'; 
      ctx.fill();
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 0.2 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#6b21a8'; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(20, height - 130, 240, 110);
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.3)';
    ctx.strokeRect(20, height - 130, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#f97316';
    ctx.fillText('SYS :: PLANETARY_GEARSET', 30, height - 110);
    ctx.fillStyle = '#fff';
    const normSun = ((angle * 180 / Math.PI) % 360 + 360) % 360;
    const normCarrier = ((Math.abs(carrierAngle) * 180 / Math.PI) % 360 + 360) % 360;
    ctx.fillText(`SUN INPUT     : ${normSun.toFixed(1)}°`, 30, height - 85);
    ctx.fillStyle = '#00ff88';
    ctx.fillText(`CARRIER OUT   : ${normCarrier.toFixed(1)}°`, 30, height - 65);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`GEAR RATIO    : 1 : ${ratio.toFixed(2)}`, 30, height - 45);
  }, [angle, load]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
export const PrattTrussSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const toScreen = (x: number, y: number) => [originX + x * scale, originY - y * scale];
    const drawCircle = (x: number, y: number, r: number, color: string, fill = false) => {
      ctx.beginPath();
      const [sx, sy] = toScreen(x, y);
      ctx.arc(sx, sy, r * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      if (fill) { ctx.fillStyle = color; ctx.fill(); }
    };
    const loadFactor = load / 100;
    const dynamicLoad = loadFactor * (1.0 + 0.1 * Math.sin(angle * 6.0));
    const maxDeflect = 1.2; 
    const h = 3.0; 
    const nodes = [
      { id: 0, x: -6, y: 0, type: 'support' },
      { id: 1, x: -3, y: 0, type: 'bottom' },
      { id: 2, x: 0, y: 0, type: 'bottom' },
      { id: 3, x: 3, y: 0, type: 'bottom' },
      { id: 4, x: 6, y: 0, type: 'support' },
      { id: 5, x: -3, y: h, type: 'top' },
      { id: 6, x: 0, y: h, type: 'top' },
      { id: 7, x: 3, y: h, type: 'top' }
    ];
    const defNodes = nodes.map(n => {
      let dy = 0;
      if (n.type !== 'support') {
        dy = -maxDeflect * dynamicLoad * (1 - Math.pow(n.x / 6, 2));
      }
      return { ...n, dx: n.x, dy: n.y + dy };
    });
    const getCol = (stress: number) => {
      if (stress > 0) return `rgb(${148 - stress*148}, ${163 - stress*10}, ${184 + stress*71})`; 
      const s = -stress;
      return `rgb(${148 + s*107}, ${163 - s*100}, ${184 - s*184})`; 
    };
    const members = [
      { n1: 0, n2: 1, stress: 0.5 }, { n1: 1, n2: 2, stress: 1.0 }, { n1: 2, n2: 3, stress: 1.0 }, { n1: 3, n2: 4, stress: 0.5 },
      { n1: 5, n2: 6, stress: -1.0 }, { n1: 6, n2: 7, stress: -1.0 },
      { n1: 0, n2: 5, stress: -0.8 }, { n1: 4, n2: 7, stress: -0.8 },
      { n1: 1, n2: 5, stress: -0.4 }, { n1: 2, n2: 6, stress: -0.2 }, { n1: 3, n2: 7, stress: -0.4 },
      { n1: 5, n2: 2, stress: 0.6 }, { n1: 7, n2: 2, stress: 0.6 }
    ];
    members.forEach(m => {
      const p1 = defNodes[m.n1];
      const p2 = defNodes[m.n2];
      const actStress = m.stress * loadFactor;
      const color = getCol(actStress);
      ctx.beginPath();
      const [sx1, sy1] = toScreen(p1.dx, p1.dy);
      const [sx2, sy2] = toScreen(p2.dx, p2.dy);
      ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2);
      ctx.strokeStyle = color; 
      const lineW = 6 + Math.abs(actStress) * 6;
       ctx.lineWidth = lineW;
      if (Math.abs(actStress) > 0.5) {
        ctx.shadowBlur = Math.abs(actStress) * 15;
        ctx.shadowColor = color;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
    defNodes.forEach(n => {
      drawCircle(n.dx, n.dy, 0.3, '#1e293b', true);
      drawCircle(n.dx, n.dy, 0.15, '#fff', true);
    });
    ctx.fillStyle = '#475569';
    const [sup1x, sup1y] = toScreen(-6, 0);
    ctx.beginPath(); ctx.moveTo(sup1x, sup1y); ctx.lineTo(sup1x - 20, sup1y + 30); ctx.lineTo(sup1x + 20, sup1y + 30); ctx.fill();
    const [sup2x, sup2y] = toScreen(6, 0);
    ctx.beginPath(); ctx.moveTo(sup2x, sup2y); ctx.lineTo(sup2x - 20, sup2y + 30); ctx.lineTo(sup2x + 20, sup2y + 30); ctx.fill();
  }, [angle, load]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const QuickReturnSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const scale = (Math.min(width, height) / 12) * zoom; 
    const originX = width * 0.5;
    const originY = height * 0.7; 
    const pivotX = 0;
    const pivotY = 0;
     const crankCenterY = 2.5; 
    const R = 1.2; 
    const pinX = R * Math.cos(angle);
    const pinY = crankCenterY + R * Math.sin(angle);
    const leverAngle = Math.atan2(pinY, pinX);
    const leverLen = 6.0;
    const leverEndX = leverLen * Math.cos(leverAngle);
    const leverEndY = leverLen * Math.sin(leverAngle);
    const L_rod = 4.0;
    const ramY = 6.0; 
    let ramX = 0;
    const diffY = ramY - leverEndY;
    if (Math.abs(diffY) <= L_rod) {
      ramX = leverEndX - Math.sqrt(L_rod * L_rod - diffY * diffY);
    } else {
      ramX = leverEndX; 
    }
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
    const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, w: number) => {
      ctx.beginPath();
      const [sx1, sy1] = toScreen(x1, y1);
      const [sx2, sy2] = toScreen(x2, y2);
      ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2);
      ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke();
    };
    const drawCircle = (x: number, y: number, r: number, color: string, fill = false) => {
      ctx.beginPath();
      const [sx, sy] = toScreen(x, y);
      ctx.arc(sx, sy, r * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      if (fill) { ctx.fillStyle = color; ctx.fill(); }
    };
    const isCutting = Math.sin(angle) > 0;
    const loadFactor = load / 100;
    const rC = Math.round(0 + loadFactor * 255);
    const gC = Math.round(212 - loadFactor * 212);
    const bC = Math.round(255 - loadFactor * 255);
    const stressColor = isCutting ? `rgb(${rC}, ${gC}, ${bC})` : '#00d4ff';
    drawCircle(pivotX, pivotY, 0.3, '#475569', true);
    ctx.setLineDash([4, 4]);
    drawCircle(0, crankCenterY, R, '#1e3a8a');
    ctx.setLineDash([]);
    drawCircle(0, crankCenterY, 0.2, '#fff', true); 
    drawLine(0, crankCenterY, pinX, pinY, '#3b82f6', 8);
    drawLine(pivotX, pivotY, leverEndX, leverEndY, stressColor, 12);
    ctx.beginPath();
    const [sl1X, sl1Y] = toScreen(pivotX + 1.0 * Math.cos(leverAngle), pivotY + 1.0 * Math.sin(leverAngle));
    const [sl2X, sl2Y] = toScreen(leverEndX - 0.5 * Math.cos(leverAngle), leverEndY - 0.5 * Math.sin(leverAngle));
    ctx.moveTo(sl1X, sl1Y); ctx.lineTo(sl2X, sl2Y);
    ctx.strokeStyle = '#050d1a'; ctx.lineWidth = 4; ctx.stroke();
    drawCircle(pinX, pinY, 0.25, '#fff', true);
    drawCircle(pinX, pinY, 0.15, '#3b82f6', true);
    drawLine(leverEndX, leverEndY, ramX, ramY, '#94a3b8', 6);
    drawCircle(leverEndX, leverEndY, 0.15, '#fff', true);
    drawCircle(ramX, ramY, 0.15, '#fff', true);
    const [rx, ry] = toScreen(ramX, ramY);
    const rw = 2.0 * scale;
    const rh = 1.0 * scale;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(rx - rw/2, ry - rh/2, rw, rh);
    ctx.strokeStyle = stressColor;
    ctx.lineWidth = 2 + (isCutting ? loadFactor * 2 : 0);
    if (isCutting && load > 50) {
      ctx.shadowBlur = (load - 50) * 0.5;
      ctx.shadowColor = stressColor;
    }
    ctx.strokeRect(rx - rw/2, ry - rh/2, rw, rh);
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(rx - rw/2, ry + rh/2);
    ctx.lineTo(rx - rw/2 - 15, ry + rh/2 + 20);
    ctx.lineTo(rx - rw/2 + 10, ry + rh/2);
    ctx.fillStyle = '#94a3b8';
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    const [gx1, gy1] = toScreen(-7, ramY + 0.6);
    const [gx2, gy2] = toScreen(3, ramY + 0.6);
    ctx.moveTo(gx1, gy1); ctx.lineTo(gx2, gy2);
    ctx.stroke();
    const [gx3, gy3] = toScreen(-7, ramY - 0.6);
    const [gx4, gy4] = toScreen(3, ramY - 0.6);
    ctx.moveTo(gx3, gy3); ctx.lineTo(gx4, gy4);
    ctx.stroke();
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(width - 260, 150, 220, 110);
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.strokeRect(width - 260, 150, 220, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#00d4ff';
    ctx.fillText('SYS :: QUICK_RETURN', width - 250, 170);
    ctx.fillStyle = '#fff';
    ctx.fillText(`PHASE  : ${isCutting ? 'CUTTING (SLOW)' : 'RETURN (FAST)'}`, width - 250, 195);
    ctx.fillStyle = isCutting ? '#ff4444' : '#00ff88';
    ctx.fillText(`TOOL X : ${ramX.toFixed(2)} cm`, width - 250, 215);
    ctx.fillStyle = '#a855f7';
    const normAngle = ((angle * 180 / Math.PI) % 360 + 360) % 360;
    ctx.fillText(`CRANK  : ${normAngle.toFixed(1)}°`, width - 250, 235);
  }, [angle, load]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
export const RackPinionSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const originY = height * 0.4;
    const pitchRadius = 2.0;
    const numTeeth = 16;
    const teethDepth = 0.3;
    const oscillAngle = Math.sin(angle * 0.5) * Math.PI;
    const rackX = -oscillAngle * pitchRadius;
    const rackY = -pitchRadius; 
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
    ctx.save();
    ctx.beginPath();
    const rackPathYBase = rackY - 0.8;
    const rackPathYTop = rackY + teethDepth * 0.5;
    const [rxStart, ryBase] = toScreen(-10, rackPathYBase);
    const [, ryTop] = toScreen(0, rackPathYTop);
    ctx.moveTo(rxStart, ryBase);
    const rackToothPitch = (Math.PI * 2 * pitchRadius) / numTeeth;
    for (let xOffset = -15; xOffset <= 15; xOffset += rackToothPitch) {
      const physicalX = xOffset + rackX;
      if (physicalX < -8 || physicalX > 8) continue; 
      const [tx1] = toScreen(physicalX, 0);
      const [tx2] = toScreen(physicalX + rackToothPitch * 0.25, 0);
      const [tx3] = toScreen(physicalX + rackToothPitch * 0.5, 0);
      const [tx4] = toScreen(physicalX + rackToothPitch * 0.75, 0);
      const [tx5] = toScreen(physicalX + rackToothPitch, 0);
      const [ , yBot ] = toScreen(0, rackY - teethDepth * 0.5);
      ctx.lineTo(tx1, ryTop);
      ctx.lineTo(tx2, yBot);
      ctx.lineTo(tx3, yBot);
      ctx.lineTo(tx4, ryTop);
      ctx.lineTo(tx5, ryTop);
    }
    const [rxEnd] = toScreen(10, rackPathYBase);
    ctx.lineTo(rxEnd, ryTop);
    ctx.lineTo(rxEnd, ryBase);
    ctx.closePath();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(0, ryBase + 10); ctx.lineTo(width, ryBase + 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, ryBase + 15); ctx.lineTo(width, ryBase + 15);
    ctx.stroke();
    ctx.restore();
    ctx.save();
    const [px, py] = toScreen(0, 0);
    ctx.translate(px, py);
    ctx.rotate(-oscillAngle);
    ctx.beginPath();
    for (let i = 0; i <= numTeeth * 4; i++) {
      const a = (i / (numTeeth * 4)) * Math.PI * 2;
      const toothPhase = i % 4;
      let r = pitchRadius;
       if (toothPhase === 1) r = pitchRadius + teethDepth * 0.5;
      if (toothPhase === 2) r = pitchRadius + teethDepth * 0.5;
      if (toothPhase === 3) r = pitchRadius - teethDepth * 0.5;
      if (toothPhase === 0) r = pitchRadius - teethDepth * 0.5;
      const x = r * Math.cos(a) * scale;
      const y = -r * Math.sin(a) * scale;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    const rBase = 236; const rHigh = 255;
    const gBase = 72;  const gHigh = 50;
    const bBase = 153; const bHigh = 50;
    const loadFactor = load / 100;
    const rC = Math.round(rBase + (rHigh - rBase) * loadFactor);
    const gC = Math.round(gBase + (gHigh - gBase) * loadFactor);
    const bC = Math.round(bBase + (bHigh - bBase) * loadFactor);
    ctx.fillStyle = `rgba(${rC}, ${gC}, ${bC}, ${0.2 + loadFactor * 0.3})`;
    ctx.fill();
    ctx.strokeStyle = `rgb(${rC}, ${gC}, ${bC})`;
    ctx.lineWidth = 3 + loadFactor * 2;
    if (load > 70) {
      ctx.shadowBlur = (load - 70);
      ctx.shadowColor = `rgb(${rC}, ${gC}, ${bC})`;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(0, 0, pitchRadius * 0.7 * scale, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.5)';
    ctx.stroke();
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(pitchRadius * 0.7 * scale * Math.cos(i * Math.PI / 2), pitchRadius * 0.7 * scale * Math.sin(i * Math.PI / 2));
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 0.3 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#9d174d';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    ctx.beginPath();
    ctx.arc(px, py, pitchRadius * scale, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 200, 110);
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.3)';
    ctx.strokeRect(30, 150, 200, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ec4899';
    ctx.fillText('SYS :: RACK_PINION', 40, 170);
    ctx.fillStyle = '#fff';
    ctx.fillText(`ROTATION : ${(oscillAngle * 180 / Math.PI).toFixed(1)}°`, 40, 195);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`RACK POS : ${rackX.toFixed(2)} cm`, 40, 215);
    ctx.fillStyle = '#ff6b35';
    ctx.fillText(`LOAD     : ${load}%`, 40, 235);
  }, [angle, load]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
export const RankineCycleSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
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
    const originX = width * 0.4;
    const originY = height * 0.5;
    ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }
    const toScreen = (x: number, y: number) => [originX + x * scale, originY - y * scale];
    const drawRect = (x: number, y: number, w: number, h: number, fill: string, stroke: string, lw: number = 2) => {
      const [sx, sy] = toScreen(x, y);
      ctx.fillStyle = fill; ctx.fillRect(sx, sy, w * scale, h * scale);
      if (stroke !== 'transparent') {
        ctx.strokeStyle = stroke; ctx.lineWidth = lw * zoom; ctx.strokeRect(sx, sy, w * scale, h * scale);
      }
    };
    const R_crank = 2.0;
    const L_rod = 6.0;
    const R_eccentric = 1.0;
    const cx = 6.0;
    const cy = 0.0;
    const crankX = cx + R_crank * Math.cos(angle);
    const crankY = cy + R_crank * Math.sin(angle);
    const p_dx = Math.sqrt(Math.max(0, L_rod*L_rod - (crankY - cy)*(crankY - cy)));
    const pistonX = crankX - p_dx; 
    const eccX = cx + R_eccentric * Math.cos(angle + Math.PI/2);
    const valveX = (eccX - cx) - 2.5; 
    const loadFactor = load / 100;
    const cylLen = 6.0;
    const cylH = 3.0;
    const cylX = -5.0; 
    const leftPortState = valveX > -2.5 ? 'hot' : 'cold';
    const rightPortState = valveX < -2.5 ? 'hot' : 'cold';
    const hotColor = `rgba(255, 51, 102, ${0.4 + loadFactor*0.4})`;
    const coldColor = 'rgba(0, 212, 255, 0.4)';
    drawRect(cylX, cylH/2, cylLen, -cylH, 'rgba(15, 23, 42, 0.9)', '#475569');
    const pistonWidth = 1.0;
    drawRect(cylX, cylH/2 - 0.2, pistonX - cylX, -(cylH - 0.4), leftPortState === 'hot' ? hotColor : coldColor, 'transparent');
    const rightChamX = pistonX + pistonWidth;
    drawRect(rightChamX, cylH/2 - 0.2, cylX + cylLen - rightChamX, -(cylH - 0.4), rightPortState === 'hot' ? hotColor : coldColor, 'transparent');
    const portW = 0.6;
    const chestH = 1.5;
    const chestY = cylH/2 + 0.5 + chestH;
    drawRect(cylX + 0.5, chestY, cylLen - 1.0, -chestH, hotColor, 'transparent');
    drawRect(cylX + 0.5, cylH/2 + 0.5, portW, -0.5, leftPortState === 'hot' ? hotColor : coldColor, '#475569');
    drawRect(cylX + cylLen - 0.5 - portW, cylH/2 + 0.5, portW, -0.5, rightPortState === 'hot' ? hotColor : coldColor, '#475569');
    const exX = cylX + cylLen/2 - portW/2;
    drawRect(exX, cylH/2 + 0.5, portW, -2.5, coldColor, '#475569'); 
    ctx.fillStyle = '#94a3b8';
    const [svx, svy] = toScreen(valveX, cylH/2 + 0.5);
    ctx.beginPath();
    ctx.moveTo(svx - 1.2*scale, svy);
    ctx.lineTo(svx - 1.2*scale, svy - 0.8*scale);
    ctx.lineTo(svx + 1.2*scale, svy - 0.8*scale);
    ctx.lineTo(svx + 1.2*scale, svy);
    ctx.lineTo(svx + 0.6*scale, svy);
    ctx.lineTo(svx + 0.6*scale, svy - 0.5*scale);
    ctx.lineTo(svx - 0.6*scale, svy - 0.5*scale);
    ctx.lineTo(svx - 0.6*scale, svy);
    ctx.closePath();
    ctx.fill(); ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2 * zoom; ctx.stroke();
    ctx.beginPath(); const [vrx, vry] = toScreen(valveX, cylH/2 + 0.9);
    ctx.moveTo(vrx, vry);
    const [vrx2] = toScreen(cx, cylH/2 + 0.9);
    ctx.lineTo(vrx2, vry);
    ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 4 * zoom; ctx.stroke();
    drawRect(pistonX, cylH/2 - 0.1, pistonWidth, -(cylH - 0.2), '#cbd5e1', '#64748b', 3);
    ctx.beginPath();
    const [prx, pry] = toScreen(pistonX + pistonWidth, 0);
    const [prx2, pry2] = toScreen(crankX, crankY);
    ctx.moveTo(prx, pry); ctx.lineTo(prx2, pry2);
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 6 * zoom; ctx.stroke();
    const [csx, csy] = toScreen(cx, cy);
    ctx.beginPath(); ctx.arc(csx, csy, R_crank * scale, 0, 2*Math.PI);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'; ctx.fill();
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 4 * zoom; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(csx, csy); ctx.lineTo(prx2, pry2);
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 8 * zoom; ctx.stroke();
    ctx.beginPath(); ctx.arc(prx2, pry2, 0.3*scale, 0, 2*Math.PI);
    ctx.fillStyle = '#fff'; ctx.fill();
    const [ecx, ecy] = toScreen(eccX, cy + R_eccentric * Math.sin(angle + Math.PI/2));
    ctx.beginPath(); ctx.moveTo(csx, csy); ctx.lineTo(ecx, ecy);
    ctx.strokeStyle = '#ffb703'; ctx.lineWidth = 6 * zoom; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ecx, ecy); ctx.lineTo(vrx2, vry);
    ctx.strokeStyle = '#ffb703'; ctx.lineWidth = 4 * zoom; ctx.stroke();
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    const hp = (loadFactor * 500).toFixed(0);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#00ff88'; ctx.fillText('SYS :: RANKINE_STEAM_ENGINE', 40, 170);
    ctx.fillStyle = '#ff3366'; ctx.fillText(`STEAM PRESS : ${(100 + loadFactor*150).toFixed(0)} PSI`, 40, 195);
    ctx.fillStyle = '#00d4ff'; ctx.fillText(`CRANK RPM   : ${(angle * 180 / Math.PI).toFixed(0)}`, 40, 215);
    ctx.fillStyle = '#fff'; ctx.fillText(`POWER OUT   : ${hp} HP`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const RatchetPawlSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastDriver = useRef(0);
  const wheelAngle = useRef(0);
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
    const driverAngle = Math.sin(angle) * (Math.PI / 4); 
    const dDriver = driverAngle - lastDriver.current;
    let isPushing = false;
    if (dDriver > 0) {
      wheelAngle.current += dDriver;
      isPushing = true;
    }
    if (Math.abs(dDriver) > 1.0) {
      wheelAngle.current = 0;
    }
    lastDriver.current = driverAngle;
    const N = 12; 
    const R_out = 4.0;
    const R_in = 3.2;
    const toothPitch = (2 * Math.PI) / N;
    const loadFactor = load / 100;
    const stressColor = isPushing ? `rgb(${Math.round(255)}, ${Math.round(107 - loadFactor*50)}, 53)` : '#475569';
    ctx.save();
    const [cx, cy] = toScreen(0, 0);
    ctx.translate(cx, cy);
    ctx.rotate(-wheelAngle.current);
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const theta = i * toothPitch;
      const t1 = theta;
      const px1 = R_out * Math.cos(t1) * scale;
      const py1 = -R_out * Math.sin(t1) * scale;
      const t2 = theta + 0.15; 
      const px2 = R_in * Math.cos(t2) * scale;
      const py2 = -R_in * Math.sin(t2) * scale;
      if (i === 0) ctx.moveTo(px1, py1);
      else ctx.lineTo(px1, py1);
      ctx.lineTo(px2, py2);
    }
    ctx.closePath();
    ctx.fillStyle = '#1e293b'; ctx.fill();
    ctx.strokeStyle = '#ff6b35'; ctx.lineWidth = 3 * zoom; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 0.6 * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#0f172a'; ctx.fill(); ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-driverAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(0, - (R_out + 1.0) * scale);
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 8 * zoom; ctx.lineCap = 'round'; ctx.stroke();
    const relAngle = wheelAngle.current - driverAngle;
    const toothPhase = (relAngle % toothPitch + toothPitch) % toothPitch; 
    const pawlDrop = toothPhase / toothPitch; 
    ctx.translate(0, - (R_out + 1.0) * scale);
    const pawlAngle = -Math.PI/6 - pawlDrop * 0.4; 
    ctx.rotate(pawlAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(0, 1.5 * scale); 
    ctx.lineTo(0.5 * scale, 1.5 * scale); 
    ctx.closePath();
    ctx.fillStyle = '#cbd5e1'; ctx.fill();
    ctx.strokeStyle = stressColor; ctx.lineWidth = 3 * zoom;
    if (isPushing && load > 50) {
      ctx.shadowBlur = 10; ctx.shadowColor = stressColor;
    }
    ctx.stroke(); ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(0, 0, 0.3*scale, 0, 2*Math.PI); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.restore();
    ctx.save();
    const holdPivotX = - (R_out + 1.5);
    const holdPivotY = 0;
    const [hpx, hpy] = toScreen(holdPivotX, holdPivotY);
    ctx.translate(hpx, hpy);
    const hRelAngle = wheelAngle.current; 
    const hToothPhase = (hRelAngle % toothPitch + toothPitch) % toothPitch;
    const hPawlDrop = hToothPhase / toothPitch;
    const hPawlAngle = Math.PI/8 + hPawlDrop * 0.3;
    ctx.rotate(hPawlAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(1.8 * scale, -0.2 * scale);
    ctx.lineTo(1.8 * scale, 0.2 * scale);
    ctx.closePath();
    ctx.fillStyle = '#94a3b8'; ctx.fill();
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 2 * zoom; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 0.3*scale, 0, 2*Math.PI); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.restore();
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(255, 107, 53, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ff6b35'; ctx.fillText('SYS :: RATCHET_PAWL', 40, 170);
    ctx.fillStyle = '#3b82f6'; ctx.fillText(`ARM ANGLE   : ${(driverAngle * 180 / Math.PI).toFixed(0)}°`, 40, 195);
    ctx.fillStyle = '#fff'; ctx.fillText(`WHEEL ANGLE : ${(wheelAngle.current * 180 / Math.PI).toFixed(0)}°`, 40, 215);
    ctx.fillStyle = isPushing ? '#00ff88' : '#94a3b8';
    ctx.fillText(`STATUS      : ${isPushing ? 'DRIVING' : 'SLIPPING'}`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const RhombicStirlingSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
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
    const originY = height * 0.55;
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
    const drawRect = (x: number, y: number, w: number, h: number, fill: string, stroke: string, lw: number = 2) => {
      const [sx, sy] = toScreen(x, y);
      ctx.fillStyle = fill; ctx.fillRect(sx, sy, w * scale, h * scale);
      ctx.strokeStyle = stroke; ctx.lineWidth = lw * zoom; ctx.strokeRect(sx, sy, w * scale, h * scale);
    };
    const c = 1.8; 
    const r = 1.2; 
    const L = 3.5; 
    const theta = -angle;
    const Ax = -c + r * Math.cos(theta);
    const Ay = r * Math.sin(theta);
    const Bx = c - r * Math.cos(theta); 
    const By = r * Math.sin(theta);
    const dy = Math.sqrt(Math.max(0, L*L - Ax*Ax));
    const Uy = Ay + dy; 
    const Dy = Ay - dy; 
    const loadFactor = load / 100;
    const cylRadius = 2.0;
    const cylTop = 9.0;
    const cylBottom = 2.0;
    drawRect(-cylRadius, cylTop, cylRadius*2, -(cylTop - cylBottom), 'rgba(15, 23, 42, 0.5)', '#475569');
    const dispTop = Uy + 3.0; 
    const dispHeight = 2.5;
    const dispBottom = dispTop - dispHeight;
    const pPistonTop = Dy + 3.0; 
    const pPistonHeight = 1.0;
    const hotSpaceVol = cylTop - dispTop;
    drawRect(-cylRadius, cylTop, cylRadius*2, -hotSpaceVol, 'rgba(255, 51, 102, 0.4)', 'transparent');
    const coldSpaceVol = dispBottom - pPistonTop;
    if (coldSpaceVol > 0) {
      drawRect(-cylRadius, dispBottom, cylRadius*2, -coldSpaceVol, 'rgba(0, 212, 255, 0.4)', 'transparent');
    }
    ctx.fillStyle = '#ff3366'; 
    for(let i=0; i<4; i++) {
      const [hx, hy] = toScreen(-cylRadius - 0.5, cylTop - 0.2 - i*0.4);
      ctx.fillRect(hx, hy, 0.5*scale, 0.2*scale);
      const [hx2, hy2] = toScreen(cylRadius, cylTop - 0.2 - i*0.4);
      ctx.fillRect(hx2, hy2, 0.5*scale, 0.2*scale);
    }
    ctx.fillStyle = '#00d4ff'; 
    for(let i=0; i<4; i++) {
      const [cx, cy] = toScreen(-cylRadius - 0.5, cylBottom + 1.5 - i*0.4);
      ctx.fillRect(cx, cy, 0.5*scale, 0.2*scale);
      const [cx2, cy2] = toScreen(cylRadius, cylBottom + 1.5 - i*0.4);
      ctx.fillRect(cx2, cy2, 0.5*scale, 0.2*scale);
    }
    drawRect(-cylRadius + 0.1, dispTop, cylRadius*2 - 0.2, -dispHeight, 'rgba(71, 85, 105, 0.8)', '#94a3b8');
    drawRect(-cylRadius, pPistonTop, cylRadius*2, -pPistonHeight, '#3b82f6', '#00d4ff', 3);
    drawLine(0, Uy, 0, dispBottom, '#cbd5e1', 4);
    drawLine(-0.4, Dy, -0.4, pPistonTop, '#94a3b8', 4);
    drawLine(0.4, Dy, 0.4, pPistonTop, '#94a3b8', 4);
    drawLine(-0.6, Dy, 0.6, Dy, '#64748b', 10);
    drawLine(-0.4, Uy, 0.4, Uy, '#94a3b8', 8);
    const drawGear = (x: number, y: number) => {
      const [gx, gy] = toScreen(x, y);
      ctx.beginPath(); ctx.arc(gx, gy, c * scale, 0, 2*Math.PI);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)'; ctx.fill();
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 2 * zoom; ctx.stroke();
      ctx.setLineDash([4*zoom, 6*zoom]);
      ctx.beginPath(); ctx.arc(gx, gy, (c - 0.2) * scale, 0, 2*Math.PI); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(gx, gy, 0.2 * scale, 0, 2*Math.PI);
      ctx.fillStyle = '#fff'; ctx.fill();
    };
    drawGear(-c, 0); drawGear(c, 0);
    drawLine(-c, 0, Ax, Ay, '#ffb703', 8);
    drawLine(c, 0, Bx, By, '#ffb703', 8);
    const rodColor = '#cbd5e1';
     drawLine(Ax, Ay, 0, Uy, rodColor, 6);
    drawLine(Bx, By, 0, Uy, rodColor, 6);
    drawLine(Ax, Ay, 0, Dy, rodColor, 6);
    drawLine(Bx, By, 0, Dy, rodColor, 6);
    const drawJoint = (x: number, y: number) => {
      const [jx, jy] = toScreen(x, y);
      ctx.beginPath(); ctx.arc(jx, jy, 0.25 * scale, 0, 2*Math.PI);
      ctx.fillStyle = '#050d1a'; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2 * zoom; ctx.stroke();
    };
    drawJoint(Ax, Ay); drawJoint(Bx, By);
    drawJoint(0, Uy); drawJoint(0, Dy);
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(255, 107, 53, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    const pressure = 14.7 - Ay * 5 + loadFactor * 10;
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ff6b35'; ctx.fillText('SYS :: RHOMBIC_STIRLING', 40, 170);
    ctx.fillStyle = '#00d4ff'; ctx.fillText(`ENGINE SPEED : ${(angle * 180 / Math.PI).toFixed(0)} RPM`, 40, 195);
    ctx.fillStyle = '#ff3366'; ctx.fillText(`INT PRESSURE : ${pressure.toFixed(1)} PSI`, 40, 215);
    ctx.fillStyle = '#fff'; ctx.fillText(`PHASE ANGLE  : 90° (IDEAL)`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const RootsBlowerSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
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
    const d = 4.0; 
    const R_out = d * 0.75; 
    const L_x1 = -d/2;
    const L_x2 = d/2;
    const [c1x, c1y] = toScreen(L_x1, 0);
    const [c2x, c2y] = toScreen(L_x2, 0);
    ctx.beginPath();
    ctx.arc(c1x, c1y, R_out * scale, Math.PI/2, -Math.PI/2);
    ctx.arc(c2x, c2y, R_out * scale, -Math.PI/2, Math.PI/2);
    ctx.closePath();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'; ctx.fill();
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 6 * zoom; ctx.stroke();
    const loadFactor = load / 100;
    const stressColor = `rgb(255, ${215 - loadFactor*100}, 0)`;
    if (load > 0) {
      ctx.beginPath();
      ctx.arc(c1x, c1y, (R_out - 0.4) * scale, Math.PI/2, Math.PI);
      ctx.strokeStyle = `rgba(255, ${215 - loadFactor*100}, 0, ${0.4 * loadFactor})`;
      ctx.lineWidth = 15 * zoom;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(c2x, c2y, (R_out - 0.4) * scale, 0, Math.PI/2);
      ctx.stroke();
    }
    const drawLobe = (cx: number, cy: number, rot: number, color: string) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.beginPath();
      const numPoints = 180;
      for(let i=0; i<=numPoints; i++) {
        const t = (i / numPoints) * 2 * Math.PI;
         const R_tip = d/2 + 0.5; 
        const e = 0.4;
        const k = 2.5; 
        const r = R_tip * (1 - e * Math.pow(Math.abs(Math.sin(t)), k));
        const px = r * Math.cos(t) * scale;
        const py = r * Math.sin(t) * scale;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = '#1e293b'; ctx.fill();
      ctx.strokeStyle = color; ctx.lineWidth = 4 * zoom;
      if (load > 50) {
        ctx.shadowBlur = (load - 50) * 0.4;
        ctx.shadowColor = color;
      }
      ctx.stroke(); ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.arc(0, 0, 0.4 * scale, 0, 2*Math.PI);
      ctx.fillStyle = '#050d1a'; ctx.fill(); ctx.stroke();
      ctx.restore();
    };
    drawLobe(c1x, c1y, angle, '#3b82f6');
    drawLobe(c2x, c2y, -angle + Math.PI/2, '#00d4ff');
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(originX - 1.5*scale, originY - (R_out + 1.5)*scale, 3*scale, 1.5*scale);
    ctx.fillRect(originX - 1.5*scale, originY + R_out*scale, 3*scale, 1.5*scale);
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 2 * zoom;
    ctx.strokeRect(originX - 1.5*scale, originY - (R_out + 1.5)*scale, 3*scale, 1.5*scale);
    ctx.strokeRect(originX - 1.5*scale, originY + R_out*scale, 3*scale, 1.5*scale);
    const arrowY = originY - (R_out + 0.5)*scale;
    ctx.beginPath(); ctx.moveTo(originX, arrowY); ctx.lineTo(originX, arrowY - 0.8*scale);
    ctx.lineTo(originX - 0.4*scale, arrowY - 0.4*scale); ctx.moveTo(originX, arrowY - 0.8*scale); ctx.lineTo(originX + 0.4*scale, arrowY - 0.4*scale);
    ctx.strokeStyle = stressColor; ctx.lineWidth = 4 * zoom; ctx.stroke();
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ffd700'; ctx.fillText('SYS :: ROOTS_BLOWER', 40, 170);
    ctx.fillStyle = '#3b82f6'; ctx.fillText(`ROTOR 1 ANG : ${(angle * 180 / Math.PI % 360).toFixed(0)}°`, 40, 195);
     ctx.fillStyle = '#00d4ff'; ctx.fillText(`ROTOR 2 ANG : ${((-angle + Math.PI/2) * 180 / Math.PI % 360).toFixed(0)}°`, 40, 215);
    ctx.fillStyle = stressColor; 
    ctx.fillText(`BOOST PRESS : ${(loadFactor * 14.7).toFixed(1)} PSI`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const SarrusLinkageSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
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
    const originY = height * 0.7; 
    ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }
    const loadFactor = load / 100;
    const viewAngle = Math.PI / 6 + loadFactor * 0.5;
    const cosV = Math.cos(viewAngle);
    const sinV = Math.sin(viewAngle);
    const zScale = 0.8;
    const project = (x: number, y: number, z: number) => {
      const px = x * cosV - y * sinV;
      const py = x * sinV * zScale + y * cosV * zScale;
      return [originX + px * scale, originY - (z + py) * scale];
    };
    const drawPoly3D = (pts: number[][], fill: string, stroke: string, lw: number = 2) => {
      ctx.beginPath();
      for (let i = 0; i < pts.length; i++) {
        const [px, py] = project(pts[i][0], pts[i][1], pts[i][2]);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = fill; ctx.fill();
      ctx.strokeStyle = stroke; ctx.lineWidth = lw * zoom; ctx.stroke();
    };
    const L = 3.5; 
    const w = 4.0; 
    const minZ = 1.0;
    const maxZ = 2 * L - 0.5;
    const Z = minZ + ((Math.sin(angle) + 1) / 2) * (maxZ - minZ);
    const foldY = Math.sqrt(Math.max(0, L*L - (Z/2)*(Z/2)));
    const foldX = Math.sqrt(Math.max(0, L*L - (Z/2)*(Z/2)));
    const w2 = w/2;
    drawPoly3D([
      [-w2, -w2, 0], [w2, -w2, 0], [w2, w2, 0], [-w2, w2, 0]
    ], 'rgba(15, 23, 42, 0.9)', '#475569', 3);
    const armW = 1.0;
    drawPoly3D([
      [w2, -armW, 0], [w2, armW, 0],
      [w2 + foldX, armW, Z/2], [w2 + foldX, -armW, Z/2]
    ], 'rgba(168, 85, 247, 0.4)', '#a855f7', 2);
    drawPoly3D([
      [w2 + foldX, -armW, Z/2], [w2 + foldX, armW, Z/2],
      [w2, armW, Z], [w2, -armW, Z]
    ], 'rgba(168, 85, 247, 0.6)', '#a855f7', 2);
    drawPoly3D([
      [-w2, -armW, 0], [-w2, armW, 0],
      [-w2 - foldX, armW, Z/2], [-w2 - foldX, -armW, Z/2]
    ], 'rgba(168, 85, 247, 0.4)', '#a855f7', 2);
    drawPoly3D([
      [-w2 - foldX, -armW, Z/2], [-w2 - foldX, armW, Z/2],
      [-w2, armW, Z], [-w2, -armW, Z]
    ], 'rgba(168, 85, 247, 0.6)', '#a855f7', 2);
    drawPoly3D([
      [-armW, -w2, 0], [armW, -w2, 0],
      [armW, -w2 - foldY, Z/2], [-armW, -w2 - foldY, Z/2]
       ], 'rgba(0, 212, 255, 0.4)', '#00d4ff', 2);
    drawPoly3D([
      [-armW, -w2 - foldY, Z/2], [armW, -w2 - foldY, Z/2],
      [armW, -w2, Z], [-armW, -w2, Z]
    ], 'rgba(0, 212, 255, 0.6)', '#00d4ff', 2);
    drawPoly3D([
      [-armW, w2, 0], [armW, w2, 0],
      [armW, w2 + foldY, Z/2], [-armW, w2 + foldY, Z/2]
    ], 'rgba(0, 212, 255, 0.4)', '#00d4ff', 2);
    drawPoly3D([
      [-armW, w2 + foldY, Z/2], [armW, w2 + foldY, Z/2],
      [armW, w2, Z], [-armW, w2, Z]
    ], 'rgba(0, 212, 255, 0.6)', '#00d4ff', 2);
    drawPoly3D([
      [-w2, -w2, Z], [w2, -w2, Z], [w2, w2, Z], [-w2, w2, Z]
    ], 'rgba(30, 41, 59, 0.9)', '#94a3b8', 4);
    const [cpx, cpy] = project(0, 0, Z);
    ctx.beginPath(); ctx.arc(cpx, cpy, 0.2*scale, 0, 2*Math.PI);
    ctx.fillStyle = '#fff'; ctx.fill();
    ctx.beginPath();
    const [glx1, gly1] = project(0, 0, 0);
    const [glx2, gly2] = project(0, 0, Z + 2);
    ctx.moveTo(glx1, gly1); ctx.lineTo(glx2, gly2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; ctx.lineWidth = 1 * zoom;
    ctx.setLineDash([5*zoom, 5*zoom]); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#00d4ff'; ctx.fillText('SYS :: SARRUS_LINKAGE_3D', 40, 170);
    ctx.fillStyle = '#a855f7'; ctx.fillText(`Z ELEVATION : ${Z.toFixed(2)} cm`, 40, 195);
    ctx.fillStyle = '#fff'; ctx.fillText(`FOLD RADIUS : ${foldX.toFixed(2)} cm`, 40, 215);
    ctx.fillStyle = '#ffb703'; ctx.fillText(`CONSTRAINT  : PERFECT LINEAR`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const ScissorLiftSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const originY = height * 0.85; 
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
    const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, w: number) => {
      ctx.beginPath();
      const [sx1, sy1] = toScreen(x1, y1);
      const [sx2, sy2] = toScreen(x2, y2);
      ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2);
      ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke();
    };
    const drawCircle = (x: number, y: number, r: number, color: string, fill = false) => {
      ctx.beginPath();
      const [sx, sy] = toScreen(x, y);
      ctx.arc(sx, sy, r * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      if (fill) { ctx.fillStyle = color; ctx.fill(); }
    };
    const L = 6.0; 
    const numStages = 3;
    const dMin = 1.5;
    const dMax = 5.5;
    const extensionPhase = 0.5 - 0.5 * Math.cos(angle); 
    const d = dMax - extensionPhase * (dMax - dMin);
    const h = Math.sqrt(L * L - d * d); 
    const loadFactor = load / 100;
    const rC = Math.round(0 + loadFactor * 255);
    const gC = Math.round(255 - loadFactor * 255);
    const bC = 136;
    const stressColor = `rgb(${rC}, ${gC}, ${bC})`;
    ctx.fillStyle = '#0f172a';
    const [bx, by] = toScreen(0, -0.2);
    ctx.fillRect(bx - 3.5 * scale, by, 7 * scale, 0.4 * scale);
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
    ctx.strokeRect(bx - 3.5 * scale, by, 7 * scale, 0.4 * scale);
    const slideBaseX = d / 2;
    drawLine(0, 0, slideBaseX, 0, '#475569', 16); 
    drawLine(slideBaseX, 0, slideBaseX - (dMax - d) * 0.5, 0, '#94a3b8', 8); 
    for (let i = 0; i < numStages; i++) {
      const yBottom = i * h;
      const yTop = (i + 1) * h;
      const xLeft = -d / 2;
      const xRight = d / 2;
      const stageStressColor = i === 0 ? stressColor : (i === 1 ? '#10b981' : '#34d399');
      drawLine(xLeft, yBottom, xRight, yTop, stageStressColor, 10);
      drawLine(xRight, yBottom, xLeft, yTop, stageStressColor, 10);
      drawCircle(0, yBottom + h / 2, 0.15, '#fff', true);
      drawCircle(xLeft, yBottom, 0.2, '#fff', true);
      drawCircle(xRight, yBottom, 0.2, '#fff', true);
      if (i === numStages - 1) {
        drawCircle(xLeft, yTop, 0.2, '#fff', true);
        drawCircle(xRight, yTop, 0.2, '#fff', true);
      }
    }
    const topY = numStages * h;
    const [tx, ty] = toScreen(0, topY);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(tx - 3.5 * scale, ty - 0.4 * scale, 7 * scale, 0.4 * scale);
    ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 2;
    ctx.strokeRect(tx - 3.5 * scale, ty - 0.4 * scale, 7 * scale, 0.4 * scale);
    if (load > 0) {
      const boxW = 2.0 * scale;
      const boxH = (0.5 + loadFactor * 1.5) * scale; 
      ctx.fillStyle = stressColor;
      ctx.fillRect(tx - boxW/2, ty - 0.4 * scale - boxH, boxW, boxH);
      if (load > 60) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = stressColor;
        ctx.strokeRect(tx - boxW/2, ty - 0.4 * scale - boxH, boxW, boxH);
        ctx.shadowBlur = 0;
      }
    }
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 220, 110);
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
    ctx.strokeRect(30, 150, 220, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#00ff88';
    ctx.fillText('SYS :: SCISSOR_LIFT', 40, 170);
    ctx.fillStyle = '#fff';
    ctx.fillText(`EXTENSION : ${(extensionPhase * 100).toFixed(1)}%`, 40, 195);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`HEIGHT    : ${topY.toFixed(2)}m`, 40, 215);
    ctx.fillStyle = stressColor;
    ctx.fillText(`LOAD MASS : ${Math.round(load * 20)} kg`, 40, 235);
  }, [angle, load]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
export const ScotchYokeSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const traceRef = useRef<{a: number, pos: number}[]>([]);
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
    const originX = width * 0.4;
    const originY = height * 0.5;
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
    const drawCircle = (x: number, y: number, r: number, color: string, fill = false) => {
      ctx.beginPath();
      const [sx, sy] = toScreen(x, y);
      ctx.arc(sx, sy, r * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      if (fill) { ctx.fillStyle = color; ctx.fill(); }
    };
    const R = 3.0; 
    const pinX = R * Math.cos(-angle);
    const pinY = R * Math.sin(-angle);
    const yokeX = pinX;
    const loadFactor = load / 100;
    const rC = Math.round(0 + loadFactor * 255);
    const gC = Math.round(212 - loadFactor * 212);
    const bC = Math.round(255 - loadFactor * 255);
    const stressColor = `rgb(${rC}, ${gC}, ${bC})`;
    const glow = load > 50;
    ctx.beginPath();
    const [origX, origY] = toScreen(0, 0);
    ctx.arc(origX, origY, R * scale, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fill();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 10]);
    ctx.stroke();
    ctx.setLineDash([]);
    drawCircle(0, 0, 0.3, '#fff', true);
    ctx.fillStyle = '#475569';
    const [tgx, tgy] = toScreen(5.5, 1.2);
    ctx.fillRect(tgx - 1.5 * scale, tgy - 0.4 * scale, 3 * scale, 0.4 * scale);
    const [bgx, bgy] = toScreen(5.5, -1.2);
    ctx.fillRect(bgx - 1.5 * scale, bgy, 3 * scale, 0.4 * scale);
    const slotWidth = 1.0;
    const slotHeight = R * 2 + 1.5;
    const [yx, yy] = toScreen(yokeX, 0);
    ctx.save();
    ctx.translate(yx, yy);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = stressColor;
    ctx.lineWidth = 4;
    if (glow) {
      ctx.shadowBlur = (load - 50) * 0.4;
      ctx.shadowColor = stressColor;
    }
    ctx.beginPath();
    ctx.rect(-1.0 * scale, -(slotHeight/2) * scale, 2.0 * scale, slotHeight * scale);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#050d1a';
    ctx.fillRect(-(slotWidth/2) * scale, -(slotHeight/2 - 0.5) * scale, slotWidth * scale, (slotHeight - 1.0) * scale);
    ctx.strokeRect(-(slotWidth/2) * scale, -(slotHeight/2 - 0.5) * scale, slotWidth * scale, (slotHeight - 1.0) * scale);
    ctx.fillStyle = stressColor;
    ctx.fillRect(1.0 * scale, -0.4 * scale, 6.0 * scale, 0.8 * scale);
    ctx.fillRect(7.0 * scale, -1.0 * scale, 1.0 * scale, 2.0 * scale);
    ctx.restore();
    drawCircle(pinX, pinY, 0.4, '#fff', true);
    drawCircle(pinX, pinY, 0.2, '#ef4444', true);
    ctx.beginPath();
    ctx.moveTo(origX, origY);
    const [px, py] = toScreen(pinX, pinY);
    ctx.lineTo(px, py);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
    traceRef.current.push({ a: -angle, pos: yokeX });
    if (traceRef.current.length > 150) traceRef.current.shift();
    const graphX = width * 0.1;
    const graphY = height * 0.8;
    ctx.beginPath();
    ctx.moveTo(graphX, graphY - 3 * scale);
    ctx.lineTo(graphX, graphY + 3 * scale);
    ctx.moveTo(graphX, graphY);
    ctx.lineTo(graphX + 4 * scale, graphY);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
     ctx.lineWidth = 2;
    ctx.stroke();
    if (traceRef.current.length > 1) {
      ctx.beginPath();
      for (let i = 0; i < traceRef.current.length; i++) {
        const pt = traceRef.current[i];
        const gx = graphX + (i / 150) * 4 * scale;
        const gy = graphY - pt.pos * 0.8 * scale;
        if (i === 0) ctx.moveTo(gx, gy);
        else ctx.lineTo(gx, gy);
      }
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(width - 260, 150, 220, 110);
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.strokeRect(width - 260, 150, 220, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#00d4ff';
    ctx.fillText('SYS :: SCOTCH_YOKE', width - 250, 170);
    ctx.fillStyle = '#fff';
    ctx.fillText(`YOKE X POS : ${yokeX.toFixed(3)} m`, width - 250, 195);
    ctx.fillStyle = '#3b82f6';
    const vel = -R * Math.sin(-angle);
    ctx.fillText(`YOKE VELOC : ${vel.toFixed(3)} m/s`, width - 250, 215);
    ctx.fillStyle = stressColor;
    ctx.fillText(`AXIAL LOAD : ${(loadFactor * 100).toFixed(0)} kN`, width - 250, 235);
  }, [angle, load]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
export const ShaftTorsionSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
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
    const originX = width * 0.4;
    const originY = height * 0.5;
    ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }
    const toScreen = (x: number, y: number) => [originX + x * scale, originY - y * scale];
    const project = (x: number, y: number, z: number) => {
      const px = x + z * 0.3;
      const py = y - z * 0.15;
      return toScreen(px, py);
    };
    const L = 8.0;
    const R = 2.0;
    const twist = Math.sin(angle) * (Math.PI / 2) * (load / 100);
    ctx.fillStyle = '#0f172a';
    const [sup1x, sup1y] = project(0, R + 0.5, R + 0.5);
    const [sup2x, sup2y] = project(0, -(R + 0.5), R + 0.5);
    const [sup3x, sup3y] = project(-1, -(R + 0.5), R + 0.5);
    const [sup4x, sup4y] = project(-1, R + 0.5, R + 0.5);
    ctx.beginPath(); ctx.moveTo(sup1x, sup1y); ctx.lineTo(sup2x, sup2y); ctx.lineTo(sup3x, sup3y); ctx.lineTo(sup4x, sup4y); ctx.closePath();
    ctx.fill(); ctx.strokeStyle = '#475569'; ctx.stroke();
    const numSections = 20;
    const numLines = 16;
    ctx.lineWidth = 1 * zoom;
    const drawGridLines = (front: boolean) => {
      for (let j = 0; j < numLines; j++) {
        const theta0 = j * (2 * Math.PI / numLines);
        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= numSections; i++) {
          const x = (i / numSections) * L;
          const currentTwist = (x / L) * twist;
          const theta = theta0 + currentTwist;
          const y = R * Math.cos(theta);
          const z = R * Math.sin(theta);
          if ((front && z >= -0.1) || (!front && z <= 0.1)) {
            const [px, py] = project(x, y, z);
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            started = false;
          }
        }
        ctx.strokeStyle = front ? '#00d4ff' : 'rgba(0, 212, 255, 0.2)';
        ctx.stroke();
      }
    };
    const drawCircSections = (front: boolean) => {
      for (let i = 0; i <= numSections; i++) {
        const x = (i / numSections) * L;
        ctx.beginPath();
        let started = false;
        for (let j = 0; j <= 40; j++) {
          const theta = (j / 40) * 2 * Math.PI;
          const y = R * Math.cos(theta);
          const z = R * Math.sin(theta);
          if ((front && z >= -0.1) || (!front && z <= 0.1)) {
            const [px, py] = project(x, y, z);
            if (!started) { ctx.moveTo(px, py); started = true; }
            else { ctx.lineTo(px, py); }
          } else {
            started = false;
          }
           }
        ctx.strokeStyle = front ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)';
        ctx.stroke();
      }
    };
    drawCircSections(false);
    drawGridLines(false);
    drawGridLines(true);
    drawCircSections(true);
    ctx.beginPath();
    for (let j = 0; j <= 40; j++) {
      const theta = (j / 40) * 2 * Math.PI;
      const [px, py] = project(L, R * Math.cos(theta), R * Math.sin(theta));
      if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'; ctx.fill();
    ctx.strokeStyle = '#00d4ff'; ctx.lineWidth = 3 * zoom; ctx.stroke();
    const [cx, cy] = project(L, 0, 0);
    const [rx, ry] = project(L, R * Math.cos(twist), R * Math.sin(twist));
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(rx, ry);
    ctx.strokeStyle = '#ff3366'; ctx.lineWidth = 3 * zoom; ctx.stroke();
    const graphOriginX = width * 0.8;
    const graphOriginY = height * 0.5;
    const gx = (x: number, y: number) => [graphOriginX + x * scale, graphOriginY - y * scale];
    const [gcx, gcy] = gx(0, 0);
    ctx.beginPath(); ctx.arc(gcx, gcy, R * scale, 0, 2*Math.PI);
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 2 * zoom; ctx.stroke();
    const maxShear = Math.abs(twist) * 2; 
    ctx.beginPath();
    const [gL, gy] = gx(-R, 0); const [gR] = gx(R, 0);
    ctx.moveTo(gL, gy); ctx.lineTo(gR, gy); ctx.strokeStyle = '#334155'; ctx.stroke();
    const sign = twist >= 0 ? 1 : -1;
    const [t1x, t1y] = gx(-R, -sign * maxShear);
    const [t2x, t2y] = gx(R, sign * maxShear);
    ctx.beginPath(); ctx.moveTo(t1x, t1y); ctx.lineTo(t2x, t2y);
    ctx.strokeStyle = '#ffb703'; ctx.lineWidth = 2 * zoom; ctx.stroke();
    for (let r = -R; r <= R; r += R/4) {
      if (Math.abs(r) < 0.1) continue;
      const sh = (r / R) * maxShear * sign;
      const [ax, ay] = gx(r, 0);
       const [ax2, ay2] = gx(r, sh);
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax2, ay2);
      ctx.strokeStyle = '#ffb703'; ctx.stroke();
      const ahDir = sh > 0 ? 1 : -1;
      ctx.beginPath(); ctx.moveTo(ax2, ay2);
      ctx.lineTo(ax2 - 0.1*scale, ay2 - ahDir*0.1*scale);
      ctx.lineTo(ax2 + 0.1*scale, ay2 - ahDir*0.1*scale);
      ctx.fillStyle = '#ffb703'; ctx.fill();
    }
    ctx.font = `${12*zoom}px monospace`; ctx.fillStyle = '#ffb703';
    ctx.fillText('SHEAR STRESS (τ)', graphOriginX - 50, graphOriginY - R * scale - 20);
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#00d4ff'; ctx.fillText('SYS :: SHAFT_TORSION', 40, 170);
    ctx.fillStyle = '#fff'; ctx.fillText(`TWIST ANGLE  : ${(twist * 180 / Math.PI).toFixed(1)}°`, 40, 195);
    ctx.fillStyle = '#ff3366'; ctx.fillText(`MAX SHEAR    : ${maxShear.toFixed(1)} MPa`, 40, 215);
    ctx.fillStyle = '#3b82f6'; ctx.fillText(`SHAFT LENGTH : ${(L * 10).toFixed(0)} cm`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const SlidingVanePumpSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const scale = (Math.min(width, height) / 12) * zoom; 
    const originX = width * 0.5;
    const originY = height * 0.5;
    ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }
    const toScreen = (x: number, y: number) => [originX + x * scale, originY - y * scale];
    const drawCircle = (x: number, y: number, r: number, color: string, fill = false) => {
      ctx.beginPath(); const [sx, sy] = toScreen(x, y);
      ctx.arc(sx, sy, r * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      if (fill) { ctx.fillStyle = color; ctx.fill(); }
    };
    const Rc = 4.0; 
    const Rr = 2.5; 
    const e = 1.2; 
    ctx.beginPath();
    const [cx, cy] = toScreen(0, 0);
    ctx.arc(cx, cy, Rc * scale, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a'; ctx.fill();
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx + Rc * scale * 0.5, cy, 3 * scale, 1.5 * scale); 
    ctx.fillRect(cx - Rc * scale * 0.5 - 3 * scale, cy, 3 * scale, -1.5 * scale); 
    const numVanes = 8;
    const rot = -angle;
    const loadFactor = load / 100;
    const stressColor = `rgb(${loadFactor*255}, 212, 255)`;
    ctx.save();
    const [rx, ry] = toScreen(0, -e);
    ctx.translate(rx, ry);
    ctx.lineWidth = 4;
    for (let i = 0; i < numVanes; i++) {
      const alpha = rot + (i * 2 * Math.PI) / numVanes;
      const b = -2 * e * Math.sin(alpha);
      const c = e * e - Rc * Rc;
      const r_ext = (-b + Math.sqrt(b * b - 4 * c)) / 2;
      const vx1 = Rr * scale * Math.cos(alpha);
      const vy1 = -Rr * scale * Math.sin(alpha); 
      const vx2 = r_ext * scale * Math.cos(alpha);
      const vy2 = -r_ext * scale * Math.sin(alpha);
       ctx.beginPath();
      ctx.moveTo(vx1, vy1);
      ctx.lineTo(vx2, vy2);
      ctx.strokeStyle = stressColor;
      if (load > 50) { ctx.shadowBlur = (load - 50)*0.2; ctx.shadowColor = stressColor; }
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(vx2, vy2, 3, 0, 2*Math.PI);
      ctx.fillStyle = '#fff'; ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(0, 0, Rr * scale, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e293b'; ctx.fill();
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 0.4 * scale, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.stroke();
    ctx.restore();
    drawCircle(0, 0, 0.1, '#fff', true); 
  }, [angle, load]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const StirlingEngineSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const originY = height * 0.5;
    const R = 1.0;
    const L_rod = 3.5;
    const crankX = R * Math.cos(angle);
    const crankY = R * Math.sin(angle); 
    const alphaX = crankX - Math.sqrt(L_rod * L_rod - crankY * crankY);
    const betaAngle = angle + Math.PI / 2;
    const betaCrankX = R * Math.cos(betaAngle);
    const betaCrankY = R * Math.sin(betaAngle);
    const betaX = betaCrankX + Math.sqrt(L_rod * L_rod - betaCrankY * betaCrankY);
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
    const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, w: number) => {
      ctx.beginPath();
      const [sx1, sy1] = toScreen(x1, y1);
      const [sx2, sy2] = toScreen(x2, y2);
      ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2);
      ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke();
    };
    const drawCircle = (x: number, y: number, r: number, color: string, fill = false) => {
      ctx.beginPath();
      const [sx, sy] = toScreen(x, y);
      ctx.arc(sx, sy, r * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      if (fill) { ctx.fillStyle = color; ctx.fill(); }
    };
    const drawCylinder = (xCenter: number, isHot: boolean) => {
      const [sx, sy] = toScreen(xCenter, 0);
      const cw = 3.5 * scale;
      const ch = 1.4 * scale;
      const heatPhase = isHot ? Math.max(0, Math.sin(angle)) : Math.max(0, Math.sin(betaAngle));
      const intensity = 0.1 + 0.3 * heatPhase + (load / 100) * 0.4;
      ctx.fillStyle = isHot 
        ? `rgba(220, 38, 38, ${intensity})` 
        : `rgba(14, 165, 233, ${intensity})`;
      ctx.fillRect(sx - cw/2, sy - ch/2, cw, ch);
      ctx.strokeStyle = isHot ? '#ef4444' : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx - cw/2, sy - ch/2); ctx.lineTo(sx + cw/2, sy - ch/2);
      ctx.moveTo(sx - cw/2, sy + ch/2); ctx.lineTo(sx + cw/2, sy + ch/2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(isHot ? sx - cw/2 : sx + cw/2, sy - ch/2);
      ctx.lineTo(isHot ? sx - cw/2 : sx + cw/2, sy + ch/2);
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.lineWidth = 2;
      for (let i=0; i<5; i++) {
        const finX = sx + (isHot ? -cw/2 + 10 + i*10 : cw/2 - 10 - i*10);
        ctx.beginPath(); ctx.moveTo(finX, sy - ch/2); ctx.lineTo(finX, sy - ch/2 - 15); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(finX, sy + ch/2); ctx.lineTo(finX, sy + ch/2 + 15); ctx.stroke();
      }
    };
    drawCylinder(-3.5, true);
    drawCylinder(3.5, false);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 12;
    ctx.beginPath();
    const [tx1, ty1] = toScreen(-4.5, 0.7);
    const [tx2, ty2] = toScreen(4.5, 0.7);
    ctx.moveTo(tx1, ty1);
    ctx.lineTo(tx1, ty1 - 40);
    ctx.lineTo(tx2, ty2 - 40);
    ctx.lineTo(tx2, ty2);
    ctx.stroke();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 8;
    ctx.stroke();
    const drawPiston = (x: number, isHot: boolean) => {
      const [sx, sy] = toScreen(x, 0);
      const pw = 1.0 * scale;
      const ph = 1.35 * scale;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(sx - pw/2, sy - ph/2, pw, ph);
      ctx.strokeStyle = isHot ? '#fca5a5' : '#bae6fd';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx - pw/2, sy - ph/2, pw, ph);
      drawCircle(x, 0, 0.15, '#fff', true);
    };
    drawPiston(alphaX, true);
    drawPiston(betaX, false);
    ctx.setLineDash([4, 4]);
    drawCircle(0, 0, R, '#64748b');
    ctx.setLineDash([]);
    drawLine(alphaX, 0, crankX, crankY, '#94a3b8', 6);
    drawLine(betaX, 0, betaCrankX, betaCrankY, '#94a3b8', 6);
    drawLine(0, 0, crankX, crankY, '#ef4444', 8); 
    drawLine(0, 0, betaCrankX, betaCrankY, '#38bdf8', 8); 
    drawCircle(crankX, crankY, 0.15, '#fca5a5', true);
    drawCircle(betaCrankX, betaCrankY, 0.15, '#bae6fd', true);
    drawCircle(0, 0, 0.25, '#fff', true);
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(width/2 - 120, height - 120, 240, 110);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
    ctx.strokeRect(width/2 - 120, height - 120, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('SYS :: STIRLING_CYCLE', width/2 - 110, height - 100);
    ctx.fillStyle = '#fff';
    const normAngle = ((angle * 180 / Math.PI) % 360 + 360) % 360;
    ctx.fillText(`CRANK ANGLE : ${normAngle.toFixed(1)}°`, width/2 - 110, height - 75);
    ctx.fillStyle = '#fca5a5';
    ctx.fillText(`ALPHA (HOT) : ${Math.abs(alphaX).toFixed(2)}`, width/2 - 110, height - 55);
    ctx.fillStyle = '#bae6fd';
    ctx.fillText(`BETA (COLD) : ${Math.abs(betaX).toFixed(2)}`, width/2 - 110, height - 35);
  }, [angle, load]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
    );
};
export const StrandbeestSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const scale = (Math.min(width, height) / 20) * zoom; 
    const originX = width * 0.6;
    const originY = height * 0.4;
    ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }
    const toScreen = (x: number, y: number) => [originX + x * scale, originY - y * scale];
    const drawLine = (p1: number[], p2: number[], color: string, w: number) => {
      ctx.beginPath();
      const [sx1, sy1] = toScreen(p1[0], p1[1]); const [sx2, sy2] = toScreen(p2[0], p2[1]);
      ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2);
      ctx.strokeStyle = color; ctx.lineWidth = w; ctx.stroke();
    };
    const drawCircle = (p: number[], r: number, color: string, fill = false) => {
      ctx.beginPath(); const [sx, sy] = toScreen(p[0], p[1]);
      ctx.arc(sx, sy, r * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      if (fill) { ctx.fillStyle = color; ctx.fill(); }
    };
    const intersect = (p1: number[], r1: number, p2: number[], r2: number, dir: number) => {
      const dx = p2[0] - p1[0], dy = p2[1] - p1[1];
       const d = Math.hypot(dx, dy);
      if (d > r1 + r2 || d < Math.abs(r1 - r2) || d === 0) return [0, 0]; 
      const a = (r1*r1 - r2*r2 + d*d) / (2*d);
      const h = Math.sqrt(Math.max(0, r1*r1 - a*a));
      const mx = p1[0] + (dx * a) / d;
      const my = p1[1] + (dy * a) / d;
      return [
        mx + dir * h * (dy / d),
        my - dir * h * (dx / d)
      ];
    };
    const a = 3.8, b = 4.15, c = 3.93, d = 4.01, e = 5.58, f = 3.94, g = 3.67, h = 6.57, i = 4.9, j = 5.0, k = 6.19, l = 0.78, m = 1.5;
    const drawLeg = (theta: number, color: string, glow: boolean) => {
      const P = [-a, -l]; 
      const A = [m * Math.cos(theta), m * Math.sin(theta)];
      const B = intersect(P, b, A, j, -1);
      const D = intersect(P, c, B, k, -1);
      const C = intersect(P, d, B, e, 1);
      const E = intersect(C, f, D, g, 1);
      const Foot = intersect(C, h, E, i, 1);
      ctx.shadowBlur = glow ? 15 : 0;
      ctx.shadowColor = color;
      const w = 4;
      drawLine(P, B, color, w); drawLine(A, B, color, w);
      drawLine(P, D, color, w); drawLine(B, D, color, w);
      drawLine(P, C, color, w); drawLine(B, C, color, w);
      drawLine(C, E, color, w); drawLine(D, E, color, w);
      drawLine(C, Foot, color, w); drawLine(E, Foot, color, w);
      ctx.shadowBlur = 0;
      const jCol = glow ? '#fff' : '#64748b';
      [B, C, D, E, Foot].forEach(pt => drawCircle(pt, 0.15, jCol, true));
    };
    const loadFactor = load / 100;
    const rC = Math.round(168 + loadFactor * 87);
    const stressColor = `rgb(${rC}, 85, 247)`;
    drawLeg(angle + Math.PI, '#475569', false);
    drawLeg(angle, stressColor, load > 50);
    const O = [0, 0];
    const P = [-a, -l];
    const A = [m * Math.cos(angle), m * Math.sin(angle)];
    const A_back = [m * Math.cos(angle + Math.PI), m * Math.sin(angle + Math.PI)];
    drawLine(O, P, '#334155', 8);
    drawLine(O, A, '#fff', 6);
    drawLine(O, A_back, '#64748b', 4);
    drawCircle(O, 0.3, '#1e293b', true); drawCircle(O, 0.15, '#fff', true);
    drawCircle(P, 0.3, '#1e293b', true); drawCircle(P, 0.15, '#fff', true);
    drawCircle(A, 0.2, '#fff', true);
    const [, gy] = toScreen(0, 6.0); 
    ctx.beginPath();
    ctx.moveTo(0, gy); ctx.lineTo(width, gy);
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 4; ctx.stroke();
  }, [angle, load]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const SwashplateSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const originX = width * 0.4;
    const originY = height * 0.5;
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
    const loadFactor = load / 100;
    const maxAlpha = Math.PI / 4; 
    const alpha = loadFactor * maxAlpha;
    const R = 4.0; 
    drawLine(-6, 0, 6, 0, '#334155', 20); 
    drawLine(-6, 0, 6, 0, '#475569', 10);
    const [cbX, cbY] = toScreen(4, 0);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(cbX, cbY - (R+1.5)*scale, 6*scale, (2*R+3)*scale);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 4;
    ctx.strokeRect(cbX, cbY - (R+1.5)*scale, 6*scale, (2*R+3)*scale);
    const pistons = [
      { phi: 0, color: '#3b82f6' },
      { phi: (2*Math.PI)/3, color: '#00d4ff' },
      { phi: (4*Math.PI)/3, color: '#a855f7' }
    ];
    pistons.sort((a, b) => Math.cos(a.phi) - Math.cos(b.phi));
    const topX = R * Math.tan(alpha) * Math.cos(angle);
    const botX = R * Math.tan(alpha) * Math.cos(angle + Math.PI);
    ctx.beginPath();
    const [swT_x, swT_y] = toScreen(topX, R + 1);
    const [swB_x, swB_y] = toScreen(botX, -(R + 1));
    ctx.moveTo(swT_x, swT_y);
    ctx.lineTo(swB_x, swB_y);
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 15; ctx.lineCap = 'round';
    if (load > 50) {
      ctx.shadowBlur = (load - 50) * 0.4;
      ctx.shadowColor = '#ffd700';
    }
    ctx.stroke(); ctx.shadowBlur = 0;
    pistons.forEach(p => {
      const py = R * Math.sin(p.phi);
      const pz = R * Math.cos(p.phi);
      const px = py * Math.tan(alpha) * Math.cos(angle) + pz * Math.tan(alpha) * Math.sin(angle);
      const [screenX, screenY] = toScreen(px, py);
      const [cylBaseX, ] = toScreen(4, py);
      ctx.beginPath();
      ctx.moveTo(screenX, screenY);
      ctx.lineTo(cylBaseX + 6*scale, screenY);
      ctx.strokeStyle = p.color; ctx.lineWidth = 8; ctx.stroke();
      ctx.beginPath();
      ctx.arc(screenX, screenY, 6, 0, 2*Math.PI);
      ctx.fillStyle = '#fff'; ctx.fill();
      ctx.fillStyle = '#050d1a';
      ctx.fillRect(cylBaseX, screenY - 6, 6*scale, 12);
      ctx.strokeStyle = p.color; ctx.lineWidth = 2;
      ctx.strokeRect(cylBaseX, screenY - 6, 6*scale, 12);
      ctx.fillStyle = p.color;
      ctx.fillRect(cylBaseX, screenY - 4, screenX - cylBaseX > 0 ? 0 : (cylBaseX - screenX), 8); 
      ctx.fillRect(screenX, screenY - 4, (cylBaseX + 5*scale) - screenX, 8);
    });
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ffd700';
    ctx.fillText('SYS :: SWASHPLATE', 40, 170);
    ctx.fillStyle = '#fff';
    ctx.fillText(`SWASH ANGLE: ${(alpha * 180/Math.PI).toFixed(1)}°`, 40, 195);
    ctx.fillStyle = '#3b82f6';
    const strokeLen = 2 * R * Math.tan(alpha);
    ctx.fillText(`STROKE LEN : ${strokeLen.toFixed(2)} cm`, 40, 215);
    ctx.fillStyle = '#00d4ff';
    ctx.fillText(`DISP VOLUME: ${(strokeLen * 3 * Math.PI).toFixed(1)} cc/rev`, 40, 235);
  }, [angle, load]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const TeslaTurbineSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<{r: number, t: number, l: number}[]>([]);
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
    const originY = height * 0.5;
    ctx.fillStyle = '#050d1a'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke(); }
    for (let i = 0; i < height; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke(); }
    const toScreen = (x: number, y: number) => [originX + x * scale, originY - y * scale];
    const drawCircle = (x: number, y: number, r: number, color: string, fill = false) => {
      ctx.beginPath(); const [sx, sy] = toScreen(x, y);
      ctx.arc(sx, sy, r * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      if (fill) { ctx.fillStyle = color; ctx.fill(); }
      };
    const R = 4.0; 
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    const [nx, ny] = toScreen(R, R * 0.8);
    ctx.moveTo(nx, ny); ctx.lineTo(nx + 40, ny - 40); ctx.lineTo(nx + 60, ny - 20); ctx.lineTo(nx + 20, ny + 20);
    ctx.fill(); ctx.strokeStyle = '#475569'; ctx.lineWidth = 4; ctx.stroke();
    for (let i = 0; i < 6; i++) {
      particlesRef.current.push({
        r: R - 0.1,
        t: Math.PI / 4 + (Math.random() * 0.2 - 0.1), 
        l: 1.0 
      });
    }
    const loadFactor = load / 100;
    const speed = 0.05 + loadFactor * 0.1;
    const viscosity = 0.02; 
    const activeParticles = [];
    ctx.save();
    for (let i = 0; i < particlesRef.current.length; i++) {
      const p = particlesRef.current[i];
      p.r -= viscosity * p.r * speed;
      p.t -= speed * (R / Math.max(0.5, p.r)); 
      p.l -= 0.005; 
      if (p.r > 0.8 && p.l > 0) {
        activeParticles.push(p);
        const px = p.r * Math.cos(p.t);
        const py = p.r * Math.sin(p.t);
        const [spx, spy] = toScreen(px, py);
        ctx.fillStyle = `rgba(0, 255, 136, ${p.l})`;
        ctx.beginPath();
        ctx.arc(spx, spy, 1.5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
    particlesRef.current = activeParticles;
    ctx.restore();
    drawCircle(0, 0, R, '#3b82f6', false);
    ctx.beginPath();
    const [cx, cy] = toScreen(0, 0);
    ctx.arc(cx, cy, R * scale, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.fill();
    const exhaustRot = -angle; 
    for (let i = 0; i < 4; i++) {
      const a = exhaustRot + i * Math.PI / 2;
      const hx = 0.8 * Math.cos(a);
      const hy = 0.8 * Math.sin(a);
      drawCircle(hx, hy, 0.3, '#050d1a', true);
      drawCircle(hx, hy, 0.3, '#475569', false);
    }
    drawCircle(0, 0, 0.4, '#fff', true);
  }, [angle, load]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const ToggleMechanismSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
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
    const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string, w: number) => {
      ctx.beginPath();
      const [sx1, sy1] = toScreen(x1, y1); const [sx2, sy2] = toScreen(x2, y2);
      ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2);
      ctx.strokeStyle = color; ctx.lineWidth = w * zoom; ctx.lineCap = 'round'; ctx.stroke();
    };
    const drawCircle = (x: number, y: number, r: number, color: string, fill = false) => {
      ctx.beginPath(); const [sx, sy] = toScreen(x, y);
      ctx.arc(sx, sy, r * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = color; ctx.lineWidth = 2 * zoom; ctx.stroke();
      if (fill) { ctx.fillStyle = color; ctx.fill(); }
    };
    const intersect = (p1: number[], r1: number, p2: number[], r2: number, dir: number) => {
      const dx = p2[0] - p1[0], dy = p2[1] - p1[1];
      const d = Math.hypot(dx, dy);
      if (d > r1 + r2 || d < Math.abs(r1 - r2) || d === 0) return [0, 0];
      const a = (r1*r1 - r2*r2 + d*d) / (2*d);
      const h = Math.sqrt(Math.max(0, r1*r1 - a*a));
      const mx = p1[0] + (dx * a) / d;
      const my = p1[1] + (dy * a) / d;
      return [
        mx + dir * h * (dy / d),
        my - dir * h * (dx / d)
      ];
    };
    const O = [3.5, 0]; 
    const r = 1.0;
    const A = [O[0] + r * Math.cos(angle), O[1] + r * Math.sin(angle)];
    const C = [-2, -3]; 
    const L_ab = 4.5;
    const L_cb = 3.2;
    const L_bd = 4.2;
    const B = intersect(C, L_cb, A, L_ab, 1);
    const dx = Math.sqrt(Math.max(0, L_bd*L_bd - B[1]*B[1]));
    const D = [B[0] - dx, 0]; 
    const alpha = Math.atan2(Math.abs(B[1]), L_bd); 
    const ma = 1 / Math.tan(Math.max(0.01, alpha));
    const loadFactor = load / 100;
    const rC = Math.round(100 + loadFactor * 155);
    const stressColor = `rgb(${rC}, 255, 136)`;
    const forceColor = load > 50 && ma > 3 ? '#ff3366' : '#00ff88';
    drawCircle(O[0], O[1], 0.4, '#1e293b', true); drawCircle(O[0], O[1], 0.2, '#fff', true);
    drawCircle(C[0], C[1], 0.4, '#1e293b', true); drawCircle(C[0], C[1], 0.2, '#fff', true);
    drawLine(O[0], O[1], A[0], A[1], '#3b82f6', 10);
    drawLine(A[0], A[1], B[0], B[1], '#64748b', 8);
    if (load > 50 && ma > 3) {
      ctx.shadowBlur = ma * 3;
      ctx.shadowColor = forceColor;
    }
    drawLine(C[0], C[1], B[0], B[1], stressColor, 12);
    drawLine(B[0], B[1], D[0], D[1], stressColor, 12);
    ctx.shadowBlur = 0;
    const [dx_s, dy_s] = toScreen(D[0], D[1]);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(dx_s - 1.5*scale, dy_s - 2*scale, 2*scale, 4*scale);
    ctx.strokeStyle = forceColor; ctx.lineWidth = 4 * zoom;
    ctx.strokeRect(dx_s - 1.5*scale, dy_s - 2*scale, 2*scale, 4*scale);
    const fixedJawX = -6;
    const [fjx, fjy] = toScreen(fixedJawX, 0);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(fjx - scale, fjy - 2.5*scale, 2*scale, 5*scale);
    ctx.strokeStyle = '#475569';
    ctx.strokeRect(fjx - scale, fjy - 2.5*scale, 2*scale, 5*scale);
    if (D[0] < fixedJawX + 2.0 && load > 0) {
      ctx.fillStyle = forceColor;
      for(let i=0; i<5; i++) {
        const rx = fixedJawX + 1.0 + Math.random();
        const ry = (Math.random() - 0.5) * 4;
        drawCircle(rx, ry, 0.1 + Math.random()*0.1, forceColor, true);
      }
    }
    drawCircle(A[0], A[1], 0.3, '#fff', true);
    drawCircle(B[0], B[1], 0.3, '#fff', true);
    drawCircle(D[0], D[1], 0.3, '#fff', true);
    drawLine(D[0] - 2, D[1] + 2.2, D[0] + 2, D[1] + 2.2, '#334155', 4);
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#00ff88'; ctx.fillText('SYS :: TOGGLE_MECHANISM', 40, 170);
    ctx.fillStyle = '#fff'; ctx.fillText(`TOGGLE ANGLE : ${(alpha * 180 / Math.PI).toFixed(1)}°`, 40, 195);
    ctx.fillStyle = '#00d4ff'; ctx.fillText(`JAW POSITION : ${D[0].toFixed(2)} cm`, 40, 215);
    ctx.fillStyle = forceColor; 
    ctx.fillText(`MECH ADVANTAGE: ${ma > 50 ? 'MAX' : ma.toFixed(2)}X`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const TrussJointMethodSim: React.FC<SimulationProps> = ({ angle, load, zoom = 1 }) => {
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
    const nodeX = 0;
    const nodeY = 2;
    const supAX = -4; const supAY = -2;
    const supBX = 4; const supBY = -2;
    const loadFactor = load / 100;
    const W = 2.0 + loadFactor * 5.0; 
    const H = Math.sin(angle) * 4.0;
    const vecA = [supAX - nodeX, supAY - nodeY]; 
    const lenA = Math.hypot(vecA[0], vecA[1]);
    const dirA = [vecA[0]/lenA, vecA[1]/lenA];
    const vecB = [supBX - nodeX, supBY - nodeY]; 
    const lenB = Math.hypot(vecB[0], vecB[1]);
    const dirB = [vecB[0]/lenB, vecB[1]/lenB];
    const det = dirA[0] * dirB[1] - dirA[1] * dirB[0];
    const F_A = (-H * dirB[1] - W * dirB[0]) / det;
    const F_B = (dirA[0] * W - dirA[1] * -H) / det;
    const drawMember = (x1: number, y1: number, x2: number, y2: number, force: number) => {
      const isTension = force > 0;
      const mag = Math.abs(force);
      const color = isTension ? `rgba(0, 212, 255, ${0.4 + mag*0.1})` : `rgba(255, 51, 102, ${0.4 + mag*0.1})`;
      const [sx1, sy1] = toScreen(x1, y1);
      const [sx2, sy2] = toScreen(x2, y2);
      ctx.beginPath();
      ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2);
      ctx.strokeStyle = color; ctx.lineWidth = 12 * zoom; ctx.stroke();
      ctx.strokeStyle = isTension ? '#00d4ff' : '#ff3366'; ctx.lineWidth = 2 * zoom; ctx.stroke();
    };
    drawMember(nodeX, nodeY, supAX, supAY, F_A);
    drawMember(nodeX, nodeY, supBX, supBY, F_B);
    const [nx, ny] = toScreen(nodeX, nodeY);
    const drawArrow = (x: number, y: number, dx: number, dy: number, color: string, label: string) => {
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return;
      const vs = 0.5 * scale;
      const endX = x + dx * vs;
      const endY = y - dy * vs; 
      ctx.beginPath();
      ctx.moveTo(x, y); ctx.lineTo(endX, endY);
      ctx.strokeStyle = color; ctx.lineWidth = 3 * zoom; ctx.stroke();
      const angle = Math.atan2(-dy, dx);
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - 10*zoom * Math.cos(angle - Math.PI/6), endY - 10*zoom * Math.sin(angle - Math.PI/6));
      ctx.lineTo(endX - 10*zoom * Math.cos(angle + Math.PI/6), endY - 10*zoom * Math.sin(angle + Math.PI/6));
      ctx.closePath(); ctx.fillStyle = color; ctx.fill();
      ctx.font = `${12*zoom}px monospace`; ctx.fillStyle = color;
      ctx.fillText(label, endX + 10, endY - 10);
    };
    drawArrow(nx, ny, H, 0, '#ffd700', `H = ${Math.abs(H).toFixed(1)} kN`);
    drawArrow(nx, ny, 0, -W, '#ffb703', `W = ${W.toFixed(1)} kN`);
    drawArrow(nx, ny, F_A * dirA[0], F_A * dirA[1], F_A > 0 ? '#00d4ff' : '#ff3366', `FA = ${Math.abs(F_A).toFixed(1)} kN ${F_A > 0 ? '(T)' : '(C)'}`);
    drawArrow(nx, ny, F_B * dirB[0], F_B * dirB[1], F_B > 0 ? '#00d4ff' : '#ff3366', `FB = ${Math.abs(F_B).toFixed(1)} kN ${F_B > 0 ? '(T)' : '(C)'}`);
    ctx.beginPath(); ctx.arc(nx, ny, 0.4 * scale, 0, 2*Math.PI);
    ctx.fillStyle = '#1e293b'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2 * zoom; ctx.stroke();
    const drawSupport = (x: number, y: number) => {
      const [sx, sy] = toScreen(x, y);
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx - 0.6*scale, sy + 0.6*scale); ctx.lineTo(sx + 0.6*scale, sy + 0.6*scale); ctx.closePath();
      ctx.fillStyle = '#0f172a'; ctx.fill();
      ctx.strokeStyle = '#475569'; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sx - scale, sy + 0.6*scale); ctx.lineTo(sx + scale, sy + 0.6*scale); ctx.stroke();
    };
    drawSupport(supAX, supAY);
    drawSupport(supBX, supBY);
    const px0 = width - 150;
    const py0 = height - 150;
    const ps = scale * 0.4;
    ctx.beginPath();
    let cx = px0, cy = py0;
    ctx.moveTo(cx, cy);
    cx += 0 * ps; cy -= (-W) * ps; ctx.lineTo(cx, cy);
    cx += H * ps; cy -= 0 * ps; ctx.lineTo(cx, cy);
    cx += F_A * dirA[0] * ps; cy -= F_A * dirA[1] * ps; ctx.lineTo(cx, cy);
    cx += F_B * dirB[0] * ps; cy -= F_B * dirB[1] * ps; ctx.lineTo(cx, cy);
    ctx.fillStyle = 'rgba(168, 85, 247, 0.1)'; ctx.fill();
    ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 2 * zoom; ctx.stroke();
    ctx.font = '10px monospace'; ctx.fillStyle = '#a855f7';
    ctx.fillText('FORCE POLYGON (ΣF=0)', px0 - 50, py0 - W * ps - 20);
    ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#a855f7'; ctx.fillText('SYS :: TRUSS_JOINT_METHOD', 40, 170);
    ctx.fillStyle = '#00d4ff'; ctx.fillText(`TENSION (+)  : BLUE`, 40, 195);
    ctx.fillStyle = '#ff3366'; ctx.fillText(`COMPRESS (-) : RED`, 40, 215);
    ctx.fillStyle = '#fff'; ctx.fillText(`EQUILIBRIUM  : ACHIEVED`, 40, 235);
  }, [angle, load, zoom]);
  return <div style={{ width: '100%', height: '100%' }}><canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} /></div>;
};
export const TrussModelSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const drawCircle = (x: number, y: number, r: number, color: string, fill = false) => {
      ctx.beginPath();
      const [sx, sy] = toScreen(x, y);
      ctx.arc(sx, sy, r * scale, 0, 2 * Math.PI);
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
      if (fill) { ctx.fillStyle = color; ctx.fill(); }
    };
    const loadFactor = load / 100;
    const dynamicLoad = loadFactor * (1.0 + 0.1 * Math.sin(angle * 6.0));
    const maxDeflect = 1.5; 
    const h = 3.0; 
    const nodes = [
      { id: 0, x: -6, y: 0, type: 'support' },
      { id: 1, x: -2, y: 0, type: 'bottom' },
      { id: 2, x: 2, y: 0, type: 'bottom' },
      { id: 3, x: 6, y: 0, type: 'support' },
      { id: 4, x: -4, y: h, type: 'top' },
      { id: 5, x: 0, y: h, type: 'top' },
      { id: 6, x: 4, y: h, type: 'top' }
    ];
    const defNodes = nodes.map(n => {
      let dy = 0;
      if (n.type !== 'support') {
        dy = -maxDeflect * dynamicLoad * (1 - Math.pow(n.x / 6, 2));
      }
      return { ...n, dx: n.x, dy: n.y + dy };
    });
    const getCol = (stress: number) => {
      if (stress > 0) {
        return `rgb(${148 - stress*148}, ${163 - stress*10}, ${184 + stress*71})`;
      } else {
        const s = -stress;
        return `rgb(${148 + s*107}, ${163 - s*100}, ${184 - s*184})`;
      }
    };
    const members = [
      { n1: 0, n2: 1, stress: 0.5 },
      { n1: 1, n2: 2, stress: 1.0 },
      { n1: 2, n2: 3, stress: 0.5 },
      { n1: 4, n2: 5, stress: -1.0 },
      { n1: 5, n2: 6, stress: -1.0 },
      { n1: 0, n2: 4, stress: -0.8 }, 
      { n1: 1, n2: 4, stress: 0.6 },  
      { n1: 1, n2: 5, stress: -0.4 }, 
      { n1: 2, n2: 5, stress: -0.4 }, 
      { n1: 2, n2: 6, stress: 0.6 },  
      { n1: 3, n2: 6, stress: -0.8 }, 
    ];
    members.forEach(m => {
      const p1 = defNodes[m.n1];
      const p2 = defNodes[m.n2];
      const actStress = m.stress * loadFactor;
      const color = getCol(actStress);
      ctx.beginPath();
      const [sx1, sy1] = toScreen(p1.dx, p1.dy);
      const [sx2, sy2] = toScreen(p2.dx, p2.dy);
      ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2);
      ctx.strokeStyle = color; 
      const lineW = 6 + Math.abs(actStress) * 6;
      ctx.lineWidth = lineW;
      if (Math.abs(actStress) > 0.5) {
        ctx.shadowBlur = Math.abs(actStress) * 15;
        ctx.shadowColor = color;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    });
    defNodes.forEach(n => {
      drawCircle(n.dx, n.dy, 0.3, '#1e293b', true);
      drawCircle(n.dx, n.dy, 0.15, '#fff', true);
    });
    ctx.fillStyle = '#475569';
    const [sup1x, sup1y] = toScreen(-6, 0);
    ctx.beginPath(); ctx.moveTo(sup1x, sup1y); ctx.lineTo(sup1x - 20, sup1y + 30); ctx.lineTo(sup1x + 20, sup1y + 30); ctx.fill();
    const [sup2x, sup2y] = toScreen(6, 0);
    ctx.beginPath(); ctx.moveTo(sup2x, sup2y); ctx.lineTo(sup2x - 20, sup2y + 30); ctx.lineTo(sup2x + 20, sup2y + 30); ctx.fill();
    if (loadFactor > 0) {
      const pC = defNodes[5]; 
      const [fx, fy] = toScreen(pC.dx, pC.dy);
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
     ctx.fillStyle = 'rgba(8, 15, 30, 0.85)';
    ctx.fillRect(30, 150, 240, 110);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.strokeRect(30, 150, 240, 110);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#ffd700';
    ctx.fillText('SYS :: WARREN_TRUSS', 40, 170);
    ctx.fillStyle = '#fff';
    ctx.fillText(`CENTER DEFLECTION : ${(defNodes[1].dy).toFixed(3)} m`, 40, 195);
    ctx.fillStyle = '#00d4ff';
    ctx.fillText(`MAX TENSION       : ${(loadFactor * 100).toFixed(0)} kN`, 40, 215);
    ctx.fillStyle = '#ff4444';
    ctx.fillText(`MAX COMPRESSION   : ${(loadFactor * 100).toFixed(0)} kN`, 40, 235);
  }, [angle, load]);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};
export const TunedMassDamperSim: React.FC<SimulationProps> = ({ angle, load , zoom = 1 }) => {
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
    const scale = (Math.min(width, height) / 14) * zoom; 
    const originX = width * 0.5;
    const originY = height * 0.9; 
    const forceFreq = 0.5; 
    const baseDeflection = Math.sin(angle * forceFreq) * (load / 100);
    const tmdDeflection = Math.sin(angle * forceFreq + Math.PI) * (load / 100) * 1.5;
    const buildingHeight = 10.0;
    const buildingWidth = 2.0;
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
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.save();
    ctx.translate(originX, originY); 
    const numSegments = 20;
    const dy = buildingHeight / numSegments;
    const getDeflectedX = (y: number) => {
      const normalizedY = y / buildingHeight;
      return baseDeflection * Math.pow(normalizedY, 1.5) * 5.0; 
    };
    ctx.beginPath();
    for (let i = 0; i <= numSegments; i++) {
      const y = i * dy;
      const x = getDeflectedX(y);
      if (i === 0) ctx.moveTo(x * scale, -y * scale);
      else ctx.lineTo(x * scale, -y * scale);
    }
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    for (let i = 0; i < numSegments; i++) {