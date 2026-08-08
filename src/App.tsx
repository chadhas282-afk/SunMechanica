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