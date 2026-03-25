import React from 'react';
import { motion } from 'motion/react';
import { Box, Target, Zap } from 'lucide-react';

interface Props {
  value: number;
  label: string;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  icon?: React.ElementType;
}

export default function AntigravitySlider({ 
  value, 
  label, 
  onChange, 
  min = 0, 
  max = 2, 
  step = 0.1, 
  unit = 'x',
  icon: Icon = Box
}: Props) {
  return (
    <div className="glass-dark rounded-3xl p-5 border border-white/5 relative group hover:border-blue-500/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
            <Icon className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-blue-400/60 mb-0.5">{label}</div>
            <div className="text-white font-mono text-sm font-bold">
              {value.toFixed(2)}<span className="text-[10px] ml-0.5 text-white/30 uppercase">{unit}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
          <Zap className="w-3 h-3 text-yellow-400" />
          <span className="text-[9px] font-black text-white/40 uppercase">Variable Injection: Active</span>
        </div>
      </div>

      <div className="relative h-12 flex items-center">
        {/* Background Track */}
        <div className="absolute inset-0 h-1.5 bg-white/5 rounded-full my-auto overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"
            style={{ width: `${((value - min) / (max - min)) * 100}%` }}
          />
        </div>

        {/* Real Input Slider */}
        <input 
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        {/* Visual Thumb */}
        <motion.div 
          className="absolute top-1/2 -mt-3.5 w-7 h-7 bg-white rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.5)] border-4 border-blue-500 z-0 flex items-center justify-center pointer-events-none"
          animate={{ left: `calc(${((value - min) / (max - min)) * 100}% - 14px)` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="w-1 h-3 bg-blue-500 rounded-full" />
        </motion.div>
      </div>

      <div className="flex justify-between mt-2 px-1">
        <span className="text-[8px] font-black text-white/20 uppercase tracking-tighter">Min {min}{unit}</span>
        <span className="text-[8px] font-black text-white/20 uppercase tracking-tighter">Optimal Range</span>
        <span className="text-[8px] font-black text-white/20 uppercase tracking-tighter">Max {max}{unit}</span>
      </div>
    </div>
  );
}
