import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, CheckCircle } from 'lucide-react';
import ShizukuHelper from '../utils/ShizukuHelper';

export default function LiveConsole() {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ShizukuHelper.onLog((newLog) => {
      setLogs(prev => [...prev, newLog].slice(-100));
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-dark rounded-2xl border border-white/5 overflow-hidden flex flex-col h-[300px] font-mono shadow-2xl">
      <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-blue-400" />
          <span className="text-[10px] uppercase font-black tracking-widest text-blue-400/80">Kernel-Level Console</span>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/20" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
          <div className="w-2 h-2 rounded-full bg-green-500/20" />
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-1 scrollbar-hide bg-black/40 backdrop-blur-md"
      >
        <AnimatePresence mode="popLayout">
          {logs.map((log, i) => {
            const isSuccess = log.includes('SUCCESS');
            const isError = log.includes('ERROR');
            const isInjection = log.includes('INJECTION');
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-[9px] leading-relaxed break-all ${
                  isSuccess ? 'text-green-400 font-bold' : 
                  isError ? 'text-red-400' : 
                  isInjection ? 'text-blue-400 font-black' : 
                  'text-white/60'
                }`}
              >
                <span className="opacity-30 mr-2">{'>'}</span>
                {log}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-white/10 space-y-2">
            <Shield className="w-8 h-8 opacity-20 animate-pulse" />
            <span className="text-[10px] tracking-widest uppercase font-black">Waiting for System Commands...</span>
          </div>
        )}
      </div>
      <div className="px-4 py-1.5 bg-blue-500/5 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] text-blue-400/50 uppercase font-bold tracking-widest">BRIDGE ACTIVE: SHIZUKU V13.1.5</span>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
          <span className="text-[8px] text-green-500/80 font-black uppercase">Secure</span>
        </div>
      </div>
    </div>
  );
}
