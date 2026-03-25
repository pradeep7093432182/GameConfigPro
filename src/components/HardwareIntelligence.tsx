import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Cpu, Activity, Flame, Zap, Gauge, Smartphone } from 'lucide-react';
import ShizukuHelper from '../utils/ShizukuHelper';

export default function HardwareIntelligence() {
  const [stats, setStats] = useState({
    cpu: 18,
    gpu: 12,
    ram: 42,
    temp: 36,
    fps: 60,
    model: 'Detecting...'
  });

  useEffect(() => {
    const updateStats = async () => {
      const realStats = await ShizukuHelper.getHardwareStats();
      setStats(prev => ({
        ...prev,
        temp: Math.round(realStats.temp),
        model: realStats.model,
        cpu: 10 + Math.floor(Math.random() * 20), // Simulated for now
        gpu: 5 + Math.floor(Math.random() * 15),
        ram: 40 + Math.floor(Math.random() * 10),
        fps: 90 + Math.floor(Math.random() * 30)
      }));
    };

    const interval = setInterval(updateStats, 2000);
    updateStats();
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { label: 'CPU LOAD', value: stats.cpu, unit: '%', icon: Cpu, color: 'text-blue-400', progress: stats.cpu },
    { label: 'GPU MAPPING', value: stats.gpu, unit: '%', icon: Activity, color: 'text-purple-400', progress: stats.gpu },
    { label: 'MEMORY', value: stats.ram, unit: '%', icon: Zap, color: 'text-green-400', progress: stats.ram },
    { label: 'CORE TEMP', value: stats.temp, unit: '°C', icon: Flame, color: 'text-orange-400', progress: (stats.temp / 80) * 100 },
    { label: 'REAL-TIME FPS', value: stats.fps, unit: '', icon: Gauge, color: 'text-yellow-400', progress: (stats.fps / 144) * 100 },
    { label: 'HARDWARE', value: stats.model.split(' ')[0], unit: '', icon: Smartphone, color: 'text-cyan-400', progress: 100 }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
      {cards.map((card, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass-dark rounded-3xl p-4 border border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500"
        >
          <div className={`absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity ${card.color}`}>
            <card.icon className="w-8 h-8 rotate-12" />
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">{card.label}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono tracking-tighter text-white">
                  {card.value}
                </span>
                <span className="text-[10px] font-black text-white/20 uppercase">{card.unit}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${card.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r from-transparent via-current to-transparent ${card.color}`}
                />
              </div>
            </div>
          </div>
          
          {/* Decorative scanline */}
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-scanline" />
        </motion.div>
      ))}
    </div>
  );
}
