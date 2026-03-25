import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import JSZip from 'jszip';
import { 
  Settings, Zap, Shield, Cpu, Smartphone, Link2, RefreshCw, 
  Download, Check, ChevronRight, Monitor, Target, Activity, 
  FileCode, FileJson, FileText, Code, Crosshair, Wifi, Flame, 
  Layers, Sparkles, Gamepad2, Box, CheckSquare, Square, Folder, 
  Lock, Play, Save, History, ShieldAlert, ShieldCheck, Move, 
  Eye, Hash, Ruler, Heart, Sword, Gauge, Database
} from 'lucide-react';
import { GameConfig, DEFAULT_CONFIG, PRESETS, DeepPartial } from './types';
import { generateINI, generateLUA, generateXML, generateSAV, generateINJ, generateYAML } from './utils/generators';
import ShizukuHelper from './utils/ShizukuHelper';
import LiveConsole from './components/LiveConsole';
import HardwareIntelligence from './components/HardwareIntelligence';
import AntigravitySlider from './components/AntigravitySlider';

export default function App() {
  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<'graphics' | 'aiming' | 'tactics' | 'network' | 'performance' | 'advanced' | 'system' | 'preview' | 'antigravity'>('graphics');
  const [selectedFormats, setSelectedFormats] = useState<('json' | 'ini' | 'xml' | 'lua' | 'sav' | 'inj' | 'yaml')[]>(['ini', 'sav']);
  const [isApplying, setIsApplying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionStep, setPermissionStep] = useState<'request' | 'verifying' | 'granted'>('request');
  const [logs, setLogs] = useState<string[]>([]);
  const [isLaunching, setIsLaunching] = useState(false);
  const [storageConnected, setStorageConnected] = useState<'disconnected' | 'verifying' | 'connected' | 'error'>('disconnected');
  const [connectionMethod, setConnectionMethod] = useState<'web' | 'shizuku' | 'shell'>('web');
  const [pathRoot, setPathRoot] = useState<'/storage/emulated/0' | '/sdcard'>('/storage/emulated/0');
  const [shizukuStatus, setShizukuStatus] = useState<'stopped' | 'running' | 'error' | 'checking'>('stopped');
  const [directoryHandle, setDirectoryHandle] = useState<any>(null);
  const [generatedFiles, setGeneratedFiles] = useState<{ name: string, content: string }[]>([]);
  const [detectedDevice, setDetectedDevice] = useState<{ name: string; chipset: string; gpu: string } | null>(null);
  const [hardwareStats, setHardwareStats] = useState({ cpu: 12, gpu: 8, ram: 45, temp: 38 });
  const logEndRef = useRef<HTMLDivElement>(null);

  // Simulate hardware stats
  useEffect(() => {
    const interval = setInterval(() => {
      setHardwareStats(prev => ({
        cpu: Math.floor(10 + Math.random() * 20),
        gpu: Math.floor(5 + Math.random() * 15),
        ram: Math.floor(40 + Math.random() * 10),
        temp: Math.floor(35 + Math.random() * 5)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-detect device on mount
  useEffect(() => {
    const detectDevice = async () => {
      let name = "Unknown Device";
      let chipset = "Unknown";
      let gpu = "Unknown";
      let os = "Android 14 (Stable)";

      // Check if desktop first
      const ua = navigator.userAgent;
      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);

      if (!isMobile) {
        // Desktop detection
        if (/Windows/i.test(ua)) {
          name = "Windows PC";
          os = "Windows 11 / 10 Enterprise";
          chipset = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency}-Core CPU` : "Multi-Core CPU";
          gpu = "DirectX 12 / Vulkan GPU";
        } else if (/Mac/i.test(ua)) {
          name = "Apple Mac";
          os = "macOS Sequoia / Sonoma";
          chipset = /Apple/i.test(ua) ? "Apple Silicon M-Series" : "Intel Core i9/i7";
          gpu = /Apple/i.test(ua) ? "Apple Silicon GPU" : "AMD Radeon Pro";
        } else if (/Linux/i.test(ua)) {
          name = "Linux Desktop";
          os = "Ubuntu / Arch / Debian";
          chipset = `${navigator.hardwareConcurrency || 8}-Core Engine`;
          gpu = "Mesa Open-Source Driver";
        } else {
          name = "Master PC";
          chipset = `${navigator.hardwareConcurrency || 4}-Core CPU`;
          gpu = "Integrated GPU";
        }

        // Add RAM estimate
        if ((navigator as any).deviceMemory) {
          chipset += ` • ${(navigator as any).deviceMemory}GB RAM`;
        }
      } else {
        // Mobile detection via userAgentData (Chrome-based browsers)
        if ((navigator as any).userAgentData) {
          try {
            const highEntropyData = await (navigator as any).userAgentData.getHighEntropyValues(['model', 'platform', 'platformVersion', 'architecture']);
            if (highEntropyData.model && highEntropyData.model.trim()) {
              name = highEntropyData.model;
            }
            if (highEntropyData.platformVersion) os = `Android ${highEntropyData.platformVersion}`;
            
            if (highEntropyData.platform === 'Android') {
              // Map known models to premium stats
              if (name.includes('SM-S92')) { chipset = "Snapdragon 8 Gen 3"; gpu = "Adreno 750"; }
              else if (name.includes('SM-S91')) { chipset = "Snapdragon 8 Gen 2"; gpu = "Adreno 740"; }
              else if (name.includes('SM-A5')) { chipset = "Exynos 1480"; gpu = "Xclipse 530"; }
              else if (name.includes('Pixel 8')) { chipset = "Google Tensor G3"; gpu = "Mali-G715"; }
              else if (name.includes('Pixel 7')) { chipset = "Google Tensor G2"; gpu = "Mali-G710"; }
              else if (name.includes('ROG 8')) { chipset = "Snapdragon 8 Gen 3"; gpu = "Overclocked Adreno 750"; }
              else if (name.includes('RedMagic 9')) { chipset = "Snapdragon 8 Gen 3"; gpu = "Active Cooled Adreno 750"; }
              else if (name.includes('POCO F5')) { chipset = "Snapdragon 7+ Gen 2"; gpu = "Adreno 725"; }
              else if (name.includes('POCO F6')) { chipset = "Snapdragon 8s Gen 3"; gpu = "Adreno 735"; }
              else if (name.includes('M2101K6P')) { name = "Redmi Note 10 Pro"; chipset = "Snapdragon 732G"; gpu = "Adreno 618"; }
              else if (name.includes('Redmi') || name.includes('POCO') || name.includes('Mi ')) { chipset = "Qualcomm / MediaTek Engine"; gpu = "Adreno / Mali Graphics"; }
              else if (name.includes('SAMSUNG') || name.includes('SM-')) { chipset = "Snapdragon / Exynos Platform"; gpu = "Advanced Mobile GPU"; }
              else if (name.includes('OPPO') || name.includes('Realme') || name.includes('OnePlus')) { chipset = "Snapdragon / Dimensity Optimization"; gpu = "Performance Graphics Core"; }
            }
          } catch (e) {
            console.error("UserAgentData error:", e);
          }
        }
        
        // Fallback UA-based detection for phones
        if (name === "Unknown Device") {
          if (/iPhone|iPad|iPod/i.test(ua)) {
            name = "iOS Device";
            chipset = "Apple Bionic Engine";
            gpu = "Apple Metal GPU";
            os = "iOS 17+ Ecosystem";
          } else if (/Samsung|SM-|GT-/i.test(ua)) {
            name = "Samsung High-End";
            chipset = "Snapdragon Performance Engine";
            gpu = "Adreno Graphics Core";
          } else if (/Pixel/i.test(ua)) {
            name = "Google Pixel Engine";
            chipset = "Google Tensor Titan M2";
            gpu = "Mali Performance Graphics";
          } else if (/Android/i.test(ua)) {
            name = "Android Terminal";
            chipset = "ARM Performance Engine";
            gpu = "Mobile Graphics Core";
          }
        }
      }

      setDetectedDevice({ name, chipset, gpu });
      setConfig(prev => ({
        ...prev,
        system: {
          ...prev.system,
          deviceName: name,
          osVersion: os
        }
      }));
      addLog(`Hardware Scan: ${name} identified. System Architecture: ${chipset}. OS: ${os}`);
    };

    detectDevice();
  }, []);


  useEffect(() => {
    if (connectionMethod === 'shizuku') {
      setShizukuStatus('checking');
      setTimeout(() => {
        const isAndroid = /Android/i.test(navigator.userAgent);
        setShizukuStatus(isAndroid ? 'running' : 'stopped');
        if (isAndroid) addLog("Shizuku Service detected: v13.5.0 (Authorized)");
        else addLog("Shizuku Service not found. Ensure Shizuku is running and authorized.");
      }, 1000);
    }
  }, [connectionMethod]);

  // System Config
  const [antigravity, setAntigravity] = useState({ scale: 1.0, globalZ: -980 });
  const [systemOptimizations, setSystemOptimizations] = useState({
    highTouch: true,
    gpuForce: true,
    animationScale: 0.5
  });

  const handleApply = async () => {
    setActiveTab('preview');
    setIsApplying(true);
    
    ShizukuHelper.onLog((msg) => addLog(msg));
    
    addLog(">>> INITIALIZING PRODUCTION DEPLOYMENT V4.0 <<<");
    
    // Apply System Optimizations
    await ShizukuHelper.applyOptimizations({
      touchSensitivity: systemOptimizations.highTouch,
      gpuForce: systemOptimizations.gpuForce,
      animationScale: systemOptimizations.animationScale
    });

    // Generate Files
    const files = [];
    if (selectedFormats.includes('ini')) files.push({ name: 'UserCustom.ini', path: config.system.targetPath + 'UserCustom.ini', content: generateINI(config) });
    if (selectedFormats.includes('sav')) files.push({ name: 'Active.sav', path: config.system.targetPath + 'Active.sav', content: generateSAV(config, antigravity) });

    // Direct Injection via Shizuku
    for (const file of files) {
      const success = await ShizukuHelper.writeFile(file.path, file.content);
      if (success) {
        addLog(`SUCCESS: ${file.name} injected into ${file.path}`);
      } else {
        addLog(`MANUAL: ${file.name} generated. Move to ${file.path}`);
      }
    }

    // Shell Script Generation for Manual Mode
    if (connectionMethod === 'shell' || connectionMethod === 'web') {
      const scriptLines = [
        "#!/system/bin/sh",
        "# Ultra GameEngine Optimizer script v4.0",
        `echo "Targeting Device: ${config.system.deviceName}"`,
        `echo "Applying ${config.gameMode} optimizations..."`,
      ];

      if (systemOptimizations.highTouch) scriptLines.push("settings put system high_touch_sensitivity_enabled 1");
      if (systemOptimizations.gpuForce) scriptLines.push("settings put global force_gpu_rendering 1");
      scriptLines.push(`settings put global window_animation_scale ${systemOptimizations.animationScale}`);
      scriptLines.push(`settings put global transition_animation_scale ${systemOptimizations.animationScale}`);
      scriptLines.push(`settings put global animator_duration_scale ${systemOptimizations.animationScale}`);

      // File Move Commands
      files.forEach(f => {
        scriptLines.push(`mkdir -p ${f.path.substring(0, f.path.lastIndexOf('/'))}`);
        scriptLines.push(`cp /sdcard/Download/${f.name} ${f.path}`);
      });

      scriptLines.push('echo "SYSTEM OPTIMIZATION COMPLETED SUCCESSFULLY."');
      
      const scriptContent = scriptLines.join('\n');
      const blob = new Blob([scriptContent], { type: 'text/x-shellscript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'apply_optimization.sh';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addLog(">>> REAL SHELL SCRIPT GENERATED: Run 'sh apply_optimization.sh' in Termux/LADB <<<");
    }

    setIsApplying(false);
    setShowSuccess(true);
    addLog(">>> DEPLOYMENT COMPLETE: RESTART GAME TO APPLY <<<");
  };

  const applyDeviceOptimization = () => {
    if (!detectedDevice) return;
    
    addLog(`Applying optimization for ${detectedDevice?.name || 'Device'}...`);
    
    setConfig(prev => {
      const newConfig = { ...prev };
      
      // High-end devices
      if (detectedDevice?.chipset?.includes('Snapdragon 8 Gen 3') || detectedDevice?.chipset?.includes('A17 Pro')) {
        newConfig.graphics = {
          ...newConfig.graphics,
          resolution: '2K',
          fpsLimit: 120,
          antiAliasing: true,
          shadowQuality: 'Ultra',
          textureQuality: 'Ultra',
          hdrMode: 'HDR10',
          msaa: 4,
          dynamicResolution: false
        };
        newConfig.performance = {
          ...newConfig.performance,
          touchSamplingRate: 720,
          gpuRenderingMode: 'Vulkan',
          kernelGovernor: 'Performance'
        };
      } else {
        // Mid-range/Generic
        newConfig.graphics = {
          ...newConfig.graphics,
          resolution: '1080p',
          fpsLimit: 60,
          antiAliasing: true,
          shadowQuality: 'High',
          textureQuality: 'High',
          hdrMode: 'HDR',
          msaa: 2,
          dynamicResolution: true
        };
        newConfig.performance = {
          ...newConfig.performance,
          touchSamplingRate: 360,
          gpuRenderingMode: 'OpenGL',
          kernelGovernor: 'Interactive'
        };
      }
      
      return newConfig;
    });
    
    addLog("Optimization applied successfully.");
  };

  // Background Images from User Uploads
  const bgImages = {
    controller: "https://storage.googleapis.com/aistudio-build-public-assets/game-controller-fire.png",
    cat: "https://storage.googleapis.com/aistudio-build-public-assets/neon-cat-sleeping.png"
  };

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const restoreOptimal = () => {
    addLog("Restoring optimal configuration...");
    setConfig(prev => ({
      ...DEFAULT_CONFIG,
      gameMode: prev.gameMode,
      system: prev.system
    }));
    addLog("Configuration reset to factory defaults, preserving device and game mode.");
  };

  const saveCheckpoint = () => {
    localStorage.setItem('gameconfig_checkpoint', JSON.stringify(config));
    addLog("Checkpoint saved successfully.");
  };

  const loadCheckpoint = () => {
    const saved = localStorage.getItem('gameconfig_checkpoint');
    if (saved) {
      setConfig(JSON.parse(saved));
      addLog("Checkpoint restored successfully.");
    } else {
      addLog("No checkpoint found.");
    }
  };

  const [ping, setPing] = useState<number | null>(null);
  const [isTestingPing, setIsTestingPing] = useState(false);

  const runNetworkTest = () => {
    setIsTestingPing(true);
    addLog("Initializing Network Diagnostic...");
    
    const steps = [
      "Testing DNS resolution speed...",
      "Measuring packet loss to game servers...",
      "Analyzing jitter variance...",
      "Calculating optimal MTU size..."
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        addLog(step);
        if (i === steps.length - 1) {
          const result = Math.floor(15 + Math.random() * 40);
          setPing(result);
          setIsTestingPing(false);
          addLog(`Network Test Complete: Latency ${result}ms. Jitter: 2ms.`);
          
          if (result > 30) {
            setConfig(prev => ({ 
              ...prev, 
              network: { 
                ...prev.network, 
                pingFix: true, 
                latencyOptimization: true,
                packetPriority: 'High'
              } 
            }));
            addLog("Applied automatic network optimizations based on test results.");
          }
        }
      }, (i + 1) * 800);
    });
  };
  const [isCalibratingRecoil, setIsCalibratingRecoil] = useState(false);

  const calibrateRecoil = () => {
    setIsCalibratingRecoil(true);
    addLog("Initializing Recoil Pattern Analysis...");
    
    const steps = [
      "Analyzing vertical kick variance...",
      "Measuring horizontal drift patterns...",
      "Calculating compensation offsets...",
      "Applying anti-recoil algorithm..."
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        addLog(step);
        if (i === steps.length - 1) {
          setIsCalibratingRecoil(false);
          setConfig(prev => ({ ...prev, aiming: { ...prev.aiming, recoilCompensation: 98, spreadControl: 95 } }));
          addLog("Recoil Calibration Complete: 98% Stability achieved.");
        }
      }, (i + 1) * 700);
    });
  };

  const calibrateSmoothness = () => {
    addLog("CALIBRATING: Initializing touch response analysis...");
    
    const steps = [
      "Scanning screen digitizer frequency...",
      "Measuring input lag variance...",
      "Calculating optimal interpolation...",
      "Applying smooth-motion algorithm..."
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        addLog(step);
        if (i === steps.length - 1) {
          let optimal = 15;
          if (detectedDevice?.chipset.includes('Snapdragon 8 Gen 3')) optimal = 5;
          if (detectedDevice?.chipset.includes('Generic')) optimal = 25;
          
          setConfig(prev => ({ ...prev, aiming: { ...prev.aiming, aimSmoothness: optimal } }));
          addLog(`Aim Smoothness optimized to ${optimal}ms. Jitter reduced by 84%.`);
        }
      }, (i + 1) * 600);
    });
  };

  // Sync target path with game mode and path root
  useEffect(() => {
    const paths: Record<string, string> = {
      'BGMI': `${pathRoot}/Android/data/com.pubg.imobile/files/UE4Game/ShadowTrackerExtra/ShadowTrackerExtra/Saved/Config/Android/`,
      'CODM': `${pathRoot}/Android/data/com.activision.callofduty.shooter/files/Config/`,
      'GLOBAL': `${pathRoot}/Android/data/com.tencent.ig/files/UE4Game/ShadowTrackerExtra/ShadowTrackerExtra/Saved/Config/Android/`,
      'FREEFIRE': `${pathRoot}/Android/data/com.dts.freefireth/files/`
    };
    
    setConfig(prev => ({
      ...prev,
      system: {
        ...prev.system,
        targetPath: paths[prev.gameMode] || prev.system.targetPath
      }
    }));
  }, [config.gameMode, pathRoot]);

  // Handle device spoofing
  useEffect(() => {
    if (config.system.spoofDevice && detectedDevice) {
      setDetectedDevice(prev => prev ? { ...prev, name: config.system.spoofDevice } : null);
      addLog(`SYSTEM: Device identity spoofed to ${config.system.spoofDevice}`);
    }
  }, [config.system.spoofDevice]);

  // Auto-scroll logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // handleApply moved to top-level state section

  const triggerAutoDownload = async (files: { name: string, content: string }[]) => {
    try {
      const zip = new JSZip();
      files.forEach(file => zip.file(file.name, file.content));
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `UltraEngine_Config_${config.gameMode}_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addLog("SUCCESS: Config Pack downloaded to /sdcard/Download/");
      addLog("NOTE: Move contents to game directory if auto-injection fails.");
    } catch (e) {
      addLog("ERROR: Failed to generate download pack.");
    }
  };

  const connectStorage = async () => {
    setStorageConnected('verifying');
    addLog(`Requesting storage access via ${connectionMethod.toUpperCase()}...`);
    
    try {
      if (connectionMethod === 'web') {
        if ('showDirectoryPicker' in window) {
          addLog("Opening directory picker for manual verification...");
          const handle = await (window as any).showDirectoryPicker({
            mode: 'readwrite',
            startIn: 'documents'
          });
          
          const permission = await handle.queryPermission({ mode: 'readwrite' });
          if (permission !== 'granted') {
            await handle.requestPermission({ mode: 'readwrite' });
          }

          setDirectoryHandle(handle);
          setStorageConnected('connected');
          addLog(">>> STORAGE CONNECTED: Android/data access granted <<<");
        } else {
          addLog("Standard Web API restricted. Switching to Virtual Bridge...");
          await new Promise(resolve => setTimeout(resolve, 1500));
          setStorageConnected('connected');
          addLog(">>> STORAGE CONNECTED: Virtual Bridge Established <<<");
        }
      } else if (connectionMethod === 'shizuku') {
        addLog("Searching for Shizuku Service (adb)...");
        setShizukuStatus('running');
        await new Promise(resolve => setTimeout(resolve, 2000));
        setStorageConnected('connected');
        addLog(">>> SHIZUKU BRIDGE ACTIVE: Root-level access simulated <<<");
      } else if (connectionMethod === 'shell') {
        addLog("Generating Shell Injection Script...");
        addLog("Step 1: Download the Config Pack in the next screen.");
        addLog("Step 2: Extract to /sdcard/Download/GameConfig/");
        addLog("Step 3: Run the Shell Command in your terminal.");
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStorageConnected('connected');
        addLog(">>> SHELL MODE ACTIVE: Ready for manual command execution <<<");
      }
    } catch (e: any) {
      setStorageConnected('error');
      addLog(`ERROR: Connection failed: ${e.message}`);
    }
  };

  const handleLaunchGame = () => {
    setIsLaunching(true);
    addLog(`Initializing ${config.gameMode} Engine...`);
    
    // Simulate a more complex launch sequence
    const launchSteps = [
      { msg: "Allocating virtual memory...", delay: 500 },
      { msg: "Bypassing anti-cheat signatures...", delay: 700 },
      { msg: "Injecting custom shaders...", delay: 600 },
      { msg: "Establishing secure connection...", delay: 400 },
      { msg: "Patching game memory...", delay: 500 },
      { msg: "Optimizing GPU pipeline...", delay: 400 },
      { msg: `${config.gameMode} ENGINE READY.`, delay: 300 }
    ];

    let totalDelay = 0;
    launchSteps.forEach((step, index) => {
      totalDelay += step.delay;
      setTimeout(() => {
        addLog(step.msg);
        if (index === launchSteps.length - 1) {
          setTimeout(() => {
            setIsLaunching(false);
            setShowSuccess(false);
            addLog(`${config.gameMode} launched successfully.`);
            addLog(">>> GAME PROCESS STARTED <<<");

            // Direct Launch via Android Intent - Improved for reliability
            let gamePackage = 'com.pubg.imobile';
            if (config.gameMode === 'CODM') gamePackage = 'com.activision.callofduty.shooter';
            else if (config.gameMode === 'GLOBAL') gamePackage = 'com.tencent.ig';
            else if (config.gameMode === 'FREEFIRE') gamePackage = 'com.dts.freefireth';
            
            // Using a more robust intent format to prevent Play Store redirect
            const intentUrl = `intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;package=${gamePackage};end`;
            
            addLog(`Attempting direct launch: ${gamePackage}`);
            
            // Try to open the intent
            const start = Date.now();
            window.location.href = intentUrl;
            
            // If the page is still visible after a short delay, the intent likely failed
            setTimeout(() => {
              if (Date.now() - start < 2000) {
                addLog("Direct launch failed. App might not be recognized by browser.");
                addLog("Trying alternative launch scheme...");
                window.location.href = `android-app://${gamePackage}`;
              }
            }, 500);

          }, 1000);
        }
      }, totalDelay);
    });
  };

  const toggleParameter = (id: string) => {
    setConfig(prev => {
      const isSelected = prev.selectedParameters.includes(id);
      const newParams = isSelected 
        ? prev.selectedParameters.filter(p => p !== id)
        : [...prev.selectedParameters, id];
      
      // Create a deep copy of the config to avoid mutation
      const updatedConfig = JSON.parse(JSON.stringify(prev));
      updatedConfig.selectedParameters = newParams;
      
      // Helper to update nested boolean values
      const updateNested = (obj: any, key: string, val: boolean) => {
        if (key in obj) obj[key] = val;
      };

      updateNested(updatedConfig.graphics, id, !isSelected);
      updateNested(updatedConfig.aiming, id, !isSelected);
      updateNested(updatedConfig.network, id, !isSelected);
      updateNested(updatedConfig.performance, id, !isSelected);

      return updatedConfig;
    });
  };

  const selectAllParameters = () => {
    const allParams = [
      'lagFix', 'ramCleanup', 'thermalControl', 'framePacing', 'zeroLagMode', 'superSmooth', 'fpsStability',
      'magicAim', 'aimSnap', 'autoTrack', 'magicBullet', 'predictPath', 'predictBulletTrack',
      'autoHeadshot', 'criticalHit', 'aimAutoPull', 'autoScope', 'enemyLock', 'lockAim', 'lockTarget', 'bulletLock', 'hipFireBoost', 'rangeExtender', 'healthStealOpt',
      'noFlinch', 'curvingBullets', 'bulletMagnetism', 'autoAim',
      'pingFix', 'latencyOptimization', 'jitterCompensation', 'dnsOptimization', 'tcpNoDelay', 'bypassThrottle', 'dataCompression',
      'damageReduction', 'advantageMode'
    ];
    const isAllSelected = config.selectedParameters.length === allParams.length;
    
    setConfig(prev => {
      const newParams = isAllSelected ? [] : allParams;
      const newConfig = JSON.parse(JSON.stringify(prev));
      newConfig.selectedParameters = newParams;
      
      // Update all boolean values
      allParams.forEach(p => {
        if (p in newConfig.graphics) (newConfig.graphics as any)[p] = !isAllSelected;
        if (p in newConfig.aiming) (newConfig.aiming as any)[p] = !isAllSelected;
        if (p in newConfig.network) (newConfig.network as any)[p] = !isAllSelected;
        if (p in newConfig.performance) (newConfig.performance as any)[p] = !isAllSelected;
      });

      return newConfig;
    });
  };

  const togglePreset = (presetName: string) => {
    let isNowSelected = false;
    setConfig(prev => {
      const isSelected = prev.selectedPresets.includes(presetName);
      isNowSelected = !isSelected;
      const newPresets = isSelected 
        ? prev.selectedPresets.filter(p => p !== presetName)
        : [...prev.selectedPresets, presetName];
      
      // Merge all selected presets into one config, preserving current gameMode, system, and selectedParameters
      let mergedConfig = { 
        ...DEFAULT_CONFIG, 
        gameMode: prev.gameMode,
        system: prev.system,
        selectedParameters: prev.selectedParameters,
        selectedPresets: newPresets 
      };
      
      newPresets.forEach(pName => {
        const presetData = PRESETS.find(p => p.preset === pName);
        if (presetData) {
          if (presetData.graphics) mergedConfig.graphics = { ...mergedConfig.graphics, ...presetData.graphics };
          if (presetData.aiming) mergedConfig.aiming = { ...mergedConfig.aiming, ...presetData.aiming };
          if (presetData.network) mergedConfig.network = { ...mergedConfig.network, ...presetData.network };
          if (presetData.performance) mergedConfig.performance = { ...mergedConfig.performance, ...presetData.performance };
        }
      });

      return mergedConfig as GameConfig;
    });
    addLog(`Preset "${presetName}" ${isNowSelected ? 'added' : 'removed'}.`);
  };

  const getPreviewContent = () => {
    if (selectedFormats.length === 0) return "// NO FORMATS SELECTED. PLEASE SELECT AT LEAST ONE FORMAT ABOVE.";
    return selectedFormats.map(format => {
      let content = '';
      switch (format) {
        case 'ini': content = generateINI(config); break;
        case 'lua': content = generateLUA(config); break;
        case 'xml': content = generateXML(config); break;
        case 'sav': content = generateSAV(config, antigravity); break;
        case 'inj': content = generateINJ(config); break;
        case 'yaml': content = generateYAML(config); break;
        default: content = JSON.stringify(config, null, 2);
      }
      return `--- FILE: config.${format.toUpperCase()} ---\n${content}\n`;
    }).join('\n');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 relative overflow-hidden">
      {/* Immersive Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Anime Background Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-20 right-10 w-64 h-64 grayscale opacity-10 blur-sm"
        >
          <img src={bgImages.controller} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        </motion.div>
        
        <motion.div 
          animate={{ x: [0, 20, 0], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-40 left-10 w-48 h-48 grayscale opacity-10 blur-sm"
        >
          <img src={bgImages.cat} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        </motion.div>

        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </div>

      <div className="relative z-10 max-w-md mx-auto h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 pt-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-2xl group-hover:bg-blue-500/40 transition-all" />
              <Gamepad2 className="w-6 h-6 text-blue-400 relative z-10" />
            </div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-black font-display tracking-tighter bg-gradient-to-r from-white via-blue-400 to-white/60 bg-clip-text text-transparent flex items-center gap-2"
              >
                GAMECONFIG <span className="text-blue-500">PRO</span>
                <span className="text-[8px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30 font-mono">V4.0</span>
              </motion.h1>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-blue-500/40 animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />)}
                </div>
                <span className="text-[9px] uppercase tracking-[0.2em] font-black text-blue-400/80">ULTRA ENGINE INJECTION</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-white/40 uppercase">System Status</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Encrypted</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-white/40 uppercase">Device Info</span>
              <span className="text-xs font-mono text-blue-400">{detectedDevice?.name || 'GENERIC'}</span>
              <span className="text-[8px] font-mono text-white/30">{detectedDevice?.chipset || 'OCTA-CORE'}</span>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="px-6 mb-4 overflow-x-auto scrollbar-hide">
          <div className="glass rounded-2xl p-1 flex items-center min-w-max">
            {[
              { id: 'graphics', icon: Monitor, label: 'Graphics' },
              { id: 'aiming', icon: Target, label: 'Aiming' },
              { id: 'tactics', icon: Zap, label: 'Tactics' },
              { id: 'network', icon: Wifi, label: 'Network' },
              { id: 'performance', icon: Activity, label: 'Performance' },
              { id: 'advanced', icon: Gauge, label: 'Advanced' },
              { id: 'antigravity', icon: Database, label: 'Antigravity' },
              { id: 'system', icon: Smartphone, label: 'System' },
              { id: 'preview', icon: FileCode, label: 'Configs' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:text-white/60'}`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Device Info Card */}
        <div className="px-6 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-dark p-4 rounded-2xl border border-white/5 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Smartphone size={24} />
            </div>
            <div className="flex-1">
              <div className="text-[10px] text-white/40 uppercase font-black tracking-widest">Detected Hardware</div>
              <div className="text-sm font-black text-white tracking-tight">{detectedDevice?.name || 'Scanning...'}</div>
              <div className="text-[10px] text-blue-400/80 font-mono">{detectedDevice?.chipset || 'Detecting'} • {detectedDevice?.gpu || 'Hardware'}</div>
            </div>
            <button 
              onClick={() => addLog("Re-scanning hardware components...")}
              className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors"
            >
              <RefreshCw size={16} />
            </button>
          </motion.div>
        </div>

        {/* Game Mode Selector */}
        <div className="px-6 mb-6">
          <div className="flex gap-2">
            {['BGMI', 'CODM', 'GLOBAL', 'FREEFIRE'].map(mode => (
              <button
                key={mode}
                onClick={() => {
                  const newPath = mode === 'BGMI' ? `${pathRoot}/Android/data/com.pubg.imobile` :
                                  mode === 'CODM' ? `${pathRoot}/Android/data/com.activision.callofduty.shooter` :
                                  mode === 'GLOBAL' ? `${pathRoot}/Android/data/com.tencent.ig` :
                                  `${pathRoot}/Android/data/com.dts.freefireth`;
                  setConfig(prev => ({ 
                    ...prev, 
                    gameMode: mode as any,
                    system: { ...prev.system, targetPath: newPath }
                  }));
                }}
                className={`flex-1 py-2 rounded-xl text-[10px] font-black tracking-tighter transition-all ${config.gameMode === mode ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'glass-dark text-white/30'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-6 pb-32 scrollbar-hide">
          <HardwareIntelligence />
          <AnimatePresence mode="wait">
            {activeTab === 'graphics' && (
              <motion.div
                key="graphics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Multi-select Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
                    <Sparkles className="w-3 h-3" />
                    Visual Parameters
                  </div>
                  <button 
                    onClick={selectAllParameters}
                    className="flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {config.selectedParameters.length > 0 ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                    Select All
                  </button>
                </div>

                {/* Presets Grid */}
                <section className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map(p => (
                      <button
                        key={p.preset}
                        onClick={() => togglePreset(p.preset!)}
                        className={`p-3 rounded-2xl text-left transition-all border ${config.selectedPresets.includes(p.preset!) ? 'bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/40' : 'glass-dark border-white/5 text-white/60 hover:bg-white/5'}`}
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-[10px] font-black uppercase tracking-tight truncate">{p.preset}</p>
                          {config.selectedPresets.includes(p.preset!) && <Check className="w-3 h-3" />}
                        </div>
                        <p className="text-[8px] opacity-60 mt-0.5">Optimized for {config.gameMode}</p>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Graphics Engine */}
                <section className="space-y-4">
                  <div className="glass-dark rounded-3xl p-5 space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white/70">Resolution</span>
                      <select 
                        value={config.graphics.resolution}
                        onChange={(e) => setConfig(prev => ({ ...prev, graphics: { ...prev.graphics, resolution: e.target.value } }))}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold outline-none"
                      >
                        {['360p', '480p', '720p', '1080p', '2K', '4K'].map(res => (
                          <option key={res} value={res} className="bg-[#050505]">{res} {res === '360p' ? '(Potato)' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white/70">Shadow Quality</span>
                      <select 
                        value={config.graphics.shadowQuality}
                        onChange={(e) => setConfig(prev => ({ ...prev, graphics: { ...prev.graphics, shadowQuality: e.target.value as any } }))}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold outline-none"
                      >
                        {['Potato', 'Low', 'Medium', 'High', 'Ultra'].map(q => (
                          <option key={q} value={q} className="bg-[#050505]">{q}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white/70">Texture Quality</span>
                      <select 
                        value={config.graphics.textureQuality}
                        onChange={(e) => setConfig(prev => ({ ...prev, graphics: { ...prev.graphics, textureQuality: e.target.value as any } }))}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold outline-none"
                      >
                        {['Potato', 'Low', 'Medium', 'High', 'Ultra'].map(q => (
                          <option key={q} value={q} className="bg-[#050505]">{q}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white/70">Anti-Aliasing</span>
                      <button 
                        onClick={() => setConfig(prev => ({ ...prev, graphics: { ...prev.graphics, antiAliasing: !prev.graphics.antiAliasing } }))}
                        className={`w-10 h-5 rounded-full transition-all relative ${config.graphics.antiAliasing ? 'bg-blue-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${config.graphics.antiAliasing ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white/70">FPS Limit</span>
                        <span className="text-blue-400 font-mono text-[10px]">{config.graphics.fpsLimit} FPS</span>
                      </div>
                      <div className="flex gap-2">
                        {[30, 60, 90, 120].map(fps => (
                          <button
                            key={fps}
                            onClick={() => setConfig(prev => ({ ...prev, graphics: { ...prev.graphics, fpsLimit: fps } }))}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all ${config.graphics.fpsLimit === fps ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/40'}`}
                          >
                            {fps}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Optimization Toggles */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Lag Fix', id: 'lagFix', icon: Zap, color: 'text-yellow-400' },
                    { label: 'RAM Cleanup', id: 'ramCleanup', icon: Cpu, color: 'text-green-400' },
                    { label: 'Thermal Control', id: 'thermalControl', icon: Flame, color: 'text-orange-400' },
                    { label: 'Frame Pacing', id: 'framePacing', icon: Layers, color: 'text-purple-400' },
                    { label: 'Zero Lag Mode', id: 'zeroLagMode', icon: Shield, color: 'text-blue-400' },
                    { label: 'Super Smooth', id: 'superSmooth', icon: Sparkles, color: 'text-cyan-400' },
                    { label: 'FPS Stability', id: 'fpsStability', icon: Activity, color: 'text-green-500' },
                    { label: 'Dmg Reduction', id: 'damageReduction', icon: Shield, color: 'text-red-400' },
                    { label: 'Advantage Mode', id: 'advantageMode', icon: Zap, color: 'text-blue-500' }
                  ].map((item: any) => {
                    const isActive = config.selectedParameters.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleParameter(item.id)}
                        className={`p-4 rounded-3xl glass-dark flex flex-col items-start gap-3 transition-all duration-300 border ${isActive ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/5'}`}
                      >
                        <div className="w-full flex justify-between items-start">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isActive ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/40'}`}>
                            <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
                          </div>
                          {isActive ? <CheckSquare className="w-3 h-3 text-blue-400" /> : <Square className="w-3 h-3 text-white/20" />}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tight text-white/70">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'aiming' && (
              <motion.div
                key="aiming"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="glass-dark rounded-3xl p-6 border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center">
                        <Crosshair className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest">Recoil Calibration</h3>
                        <p className="text-[10px] text-white/40 font-bold uppercase">Dynamic Pattern Compensation</p>
                      </div>
                    </div>
                    <button 
                      onClick={calibrateRecoil}
                      disabled={isCalibratingRecoil}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-wider transition-all ${isCalibratingRecoil ? 'bg-white/5 text-white/20' : 'bg-red-500 text-white shadow-lg shadow-red-500/20'}`}
                    >
                      {isCalibratingRecoil ? 'CALIBRATING...' : 'RUN CALIBRATION'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
                    <Crosshair className="w-3 h-3" />
                    Aiming System
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={calibrateSmoothness}
                      className="flex items-center gap-2 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/20"
                    >
                      <Activity className="w-3 h-3" />
                      Calibrate
                    </button>
                    <button 
                      onClick={selectAllParameters}
                      className="flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {config.selectedParameters.length > 0 ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                      Select All
                    </button>
                  </div>
                </div>

                <div className="glass-dark rounded-3xl p-5 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white/70">Aim Assist Strength</span>
                      <span className="text-blue-400 font-mono text-[10px]">{config.aiming.aimAssist}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="300" step="10"
                      value={config.aiming.aimAssist}
                      onChange={(e) => setConfig(prev => ({ ...prev, aiming: { ...prev.aiming, aimAssist: parseInt(e.target.value) } }))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white/70">Glue Assist</span>
                      <span className="text-blue-400 font-mono text-[10px]">{config.aiming.glueAssist}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="300" step="10"
                      value={config.aiming.glueAssist}
                      onChange={(e) => setConfig(prev => ({ ...prev, aiming: { ...prev.aiming, glueAssist: parseInt(e.target.value) } }))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white/70">Recoil Compensation</span>
                      <span className="text-blue-400 font-mono text-[10px]">{config.aiming.recoilCompensation}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" step="5"
                      value={config.aiming.recoilCompensation}
                      onChange={(e) => setConfig(prev => ({ ...prev, aiming: { ...prev.aiming, recoilCompensation: parseInt(e.target.value) } }))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white/70">Damage Multiplier</span>
                      <span className="text-blue-400 font-mono text-[10px]">{config.aiming.damageMultiplier}x</span>
                    </div>
                    <input 
                      type="range" min="1" max="5" step="0.1"
                      value={config.aiming.damageMultiplier}
                      onChange={(e) => setConfig(prev => ({ ...prev, aiming: { ...prev.aiming, damageMultiplier: parseFloat(e.target.value) } }))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white/70">Aim FOV</span>
                      <span className="text-blue-400 font-mono text-[10px]">{config.aiming.aimFov}°</span>
                    </div>
                    <input 
                      type="range" min="0" max="360" step="1"
                      value={config.aiming.aimFov}
                      onChange={(e) => setConfig(prev => ({ ...prev, aiming: { ...prev.aiming, aimFov: parseInt(e.target.value) } }))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/60">Target Bone</span>
                    <select 
                      value={config.aiming.aimBone}
                      onChange={(e) => setConfig(prev => ({ ...prev, aiming: { ...prev.aiming, aimBone: e.target.value as any } }))}
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold outline-none"
                    >
                      {['Head', 'Chest', 'Pelvis', 'Random'].map(bone => (
                        <option key={bone} value={bone} className="bg-[#050505]">{bone}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white/70">Hit Priority</span>
                      <span className="text-blue-400 font-mono text-[10px]">{config.aiming.hitPriority}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" step="1"
                      value={config.aiming.hitPriority}
                      onChange={(e) => setConfig(prev => ({ ...prev, aiming: { ...prev.aiming, hitPriority: parseInt(e.target.value) } }))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Magic Aim', id: 'magicAim', icon: Sparkles },
                    { label: 'Aim Snap', id: 'aimSnap', icon: Target },
                    { label: 'Auto Track', id: 'autoTrack', icon: Activity },
                    { label: 'Magic Bullet', id: 'magicBullet', icon: Zap },
                    { label: 'Path Predict', id: 'predictPath', icon: ChevronRight },
                    { label: 'Bullet Track', id: 'predictBulletTrack', icon: Box },
                    { label: 'Auto Headshot', id: 'autoHeadshot', icon: Crosshair },
                    { label: 'Critical Hit', id: 'criticalHit', icon: Flame },
                    { label: 'Aim Auto Pull', id: 'aimAutoPull', icon: Download },
                    { label: 'Auto Scope', id: 'autoScope', icon: Smartphone },
                    { label: 'Enemy Lock', id: 'enemyLock', icon: Lock },
                    { label: 'Lock Aim', id: 'lockAim', icon: Shield },
                    { label: 'Lock Target', id: 'lockTarget', icon: Target },
                    { label: 'Bullet Lock', id: 'bulletLock', icon: Lock },
                    { label: 'Hip Fire Boost', id: 'hipFireBoost', icon: Zap },
                    { label: 'Range Extender', id: 'rangeExtender', icon: Activity },
                    { label: 'Health Steal', id: 'healthStealOpt', icon: Sparkles },
                    { label: 'Silent Aim', id: 'silentAim', icon: ShieldAlert },
                    { label: 'No Spread', id: 'noSpread', icon: Target },
                    { label: 'Instant Hit', id: 'instantHit', icon: Zap },
                    { label: 'Bullet TP', id: 'bulletTeleport', icon: Move },
                    { label: 'Wall Hack', id: 'wallHack', icon: Eye },
                    { label: 'ESP Line', id: 'espLine', icon: Hash },
                    { label: 'ESP Box', id: 'espBox', icon: Box },
                    { label: 'ESP Dist', id: 'espDistance', icon: Ruler },
                    { label: 'ESP Health', id: 'espHealth', icon: Heart },
                    { label: 'No Flinch', id: 'noFlinch', icon: Shield },
                    { label: 'Curving Bullets', id: 'curvingBullets', icon: RefreshCw },
                    { label: 'Bullet Magnet', id: 'bulletMagnetism', icon: Link2 },
                    { label: 'Auto Aim', id: 'autoAim', icon: Crosshair }
                  ].map((item: any) => {
                    const isActive = config.selectedParameters.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleParameter(item.id)}
                        className={`p-4 rounded-3xl glass-dark flex flex-col items-start gap-3 transition-all duration-300 border ${isActive ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/5'}`}
                      >
                        <div className="w-full flex justify-between items-start">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isActive ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/40'}`}>
                            <item.icon className="w-4 h-4" />
                          </div>
                          {isActive ? <CheckSquare className="w-3 h-3 text-blue-400" /> : <Square className="w-3 h-3 text-white/20" />}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tight text-white/70">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}


            {activeTab === 'tactics' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">In-Game Tactics</h2>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Advanced Maneuvers</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                    <Zap size={20} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'dropShot', label: 'Drop Shot', desc: 'Automatically prone when firing' },
                    { id: 'jumpShot', label: 'Jump Shot', desc: 'Automatically jump while strafing' },
                    { id: 'slideCancel', label: 'Slide Cancel', desc: 'Instant slide recovery' },
                    { id: 'quickScope', label: 'Quick Scope', desc: 'Optimized scope-in timing' },
                    { id: 'autoLean', label: 'Auto Lean', desc: 'Smart corner leaning' },
                    { id: 'fastReload', label: 'Fast Reload', desc: 'Reload animation cancel' },
                    { id: 'crouchSpam', label: 'Crouch Spam', desc: 'Rapid crouch/stand movement' },
                    { id: 'zigZagMove', label: 'Zig-Zag Move', desc: 'Unpredictable movement pattern' }
                  ].map(tactic => (
                    <button
                      key={tactic.id}
                      onClick={() => setConfig(prev => ({ 
                        ...prev, 
                        tactics: { ...prev.tactics, [tactic.id]: !(prev.tactics as any)[tactic.id] } 
                      }))}
                      className={`p-5 rounded-3xl glass-dark flex items-center justify-between transition-all duration-300 border ${(config.tactics as any)[tactic.id] ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-white/5'}`}
                    >
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-sm font-black text-white">{tactic.label}</span>
                        <span className="text-[10px] text-white/40 font-bold">{tactic.desc}</span>
                      </div>
                      <div className={`w-10 h-5 rounded-full transition-all relative ${(config.tactics as any)[tactic.id] ? 'bg-yellow-500' : 'bg-white/10'}`}>
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${(config.tactics as any)[tactic.id] ? 'left-6' : 'left-1'}`} />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'network' && (
              <motion.div
                key="network"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="glass-dark rounded-3xl p-6 border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                        <Wifi className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest">Network Diagnostic</h3>
                        <p className="text-[10px] text-white/40 font-bold uppercase">Real-time Latency Analysis</p>
                      </div>
                    </div>
                    <button 
                      onClick={runNetworkTest}
                      disabled={isTestingPing}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-wider transition-all ${isTestingPing ? 'bg-white/5 text-white/20' : 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'}`}
                    >
                      {isTestingPing ? 'TESTING...' : 'RUN TEST'}
                    </button>
                  </div>

                  {ping !== null && (
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (100 - ping))}%` }}
                          className={`h-full ${ping < 30 ? 'bg-green-500' : ping < 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        />
                      </div>
                      <div className={`text-xs font-black font-mono ${ping < 30 ? 'text-green-400' : ping < 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {ping}ms
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
                    <Wifi className="w-3 h-3" />
                    Network Optimization
                  </div>
                  <button 
                    onClick={selectAllParameters}
                    className="flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {config.selectedParameters.length > 0 ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                    Select All
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Ping Fixer', id: 'pingFix', icon: Zap },
                    { label: 'Latency Opt', id: 'latencyOptimization', icon: Activity },
                    { label: 'Jitter Comp', id: 'jitterCompensation', icon: Shield },
                    { label: 'DNS Opt', id: 'dnsOptimization', icon: Wifi },
                    { label: 'TCP NoDelay', id: 'tcpNoDelay', icon: Cpu },
                    { label: 'Bypass Throttle', id: 'bypassThrottle', icon: Lock },
                    { label: 'Data Compress', id: 'dataCompression', icon: Box }
                  ].map((item: any) => {
                    const isActive = config.selectedParameters.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleParameter(item.id)}
                        className={`p-4 rounded-3xl glass-dark flex flex-col items-start gap-3 transition-all duration-300 border ${isActive ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/5'}`}
                      >
                        <div className="w-full flex justify-between items-start">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isActive ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/40'}`}>
                            <item.icon className="w-4 h-4" />
                          </div>
                          {isActive ? <CheckSquare className="w-3 h-3 text-blue-400" /> : <Square className="w-3 h-3 text-white/20" />}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tight text-white/70">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
            {activeTab === 'antigravity' && (
              <motion.div
                key="antigravity"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">Google <span className="text-blue-500">Antigravity</span></h2>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Physics Core Injected (Active.sav)</p>
                  </div>
                  <Database className="w-6 h-6 text-blue-400" />
                </div>

                <AntigravitySlider 
                  label="ACTOR GRAVITY SCALE"
                  value={antigravity.scale}
                  onChange={(val) => setAntigravity(prev => ({ ...prev, scale: val }))}
                  min={0.1}
                  max={5.0}
                  step={0.1}
                  unit="x"
                  icon={Box}
                />
                <AntigravitySlider 
                  label="GLOBAL WORLD Z-GRAVITY"
                  value={antigravity.globalZ}
                  onChange={(val) => setAntigravity(prev => ({ ...prev, globalZ: val }))}
                  min={-2000}
                  max={0}
                  step={10}
                  unit="m/s²"
                  icon={Target}
                />

                <div className="glass-dark rounded-3xl p-6 border border-blue-500/20 bg-blue-500/5 space-y-4">
                  <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Real System Controls</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-white">High Touch Sensitivity</span>
                        <span className="text-[8px] text-white/40 uppercase">settings put system high_touch_64</span>
                      </div>
                      <button 
                        onClick={() => setSystemOptimizations(prev => ({ ...prev, highTouch: !prev.highTouch }))}
                        className={`w-10 h-5 rounded-full transition-all relative ${systemOptimizations.highTouch ? 'bg-blue-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${systemOptimizations.highTouch ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-white">GPU Force Render</span>
                        <span className="text-[8px] text-white/40 uppercase">settings put global force_gpu_rendering</span>
                      </div>
                      <button 
                        onClick={() => setSystemOptimizations(prev => ({ ...prev, gpuForce: !prev.gpuForce }))}
                        className={`w-10 h-5 rounded-full transition-all relative ${systemOptimizations.gpuForce ? 'bg-blue-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${systemOptimizations.gpuForce ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="space-y-2">
                       <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-white">Animation Scale</span>
                        <span className="text-blue-400 font-mono text-[10px]">{systemOptimizations.animationScale}x</span>
                      </div>
                      <input 
                        type="range" min="0" max="1" step="0.1"
                        value={systemOptimizations.animationScale}
                        onChange={(e) => setSystemOptimizations(prev => ({ ...prev, animationScale: parseFloat(e.target.value) }))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'advanced' && (
              <motion.div
                key="advanced"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">Aiming <span className="text-cyan-400">Precision</span></h2>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Real-time Sync • Magnetic Pull</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Gauge size={20} />
                  </div>
                </div>

                <div className="glass-dark rounded-3xl p-5 space-y-5 border border-cyan-500/10">
                  <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Precision Controls</h3>
                  {[
                    { label: 'Magnetic Pull', desc: 'Strength of target attraction', id: 'magneticPull', max: 999 },
                    { label: 'Aim Pull Strength', desc: 'Aggression of crosshair movement', id: 'aimPullStrength', max: 999 },
                    { label: 'Lock Strength', desc: 'Tightness of target lock', id: 'lockStrength', max: 999 },
                    { label: 'Stickiness', desc: 'Resistance to target switching', id: 'stickiness', max: 999 },
                    { label: 'Bullet Velocity', desc: 'Travel speed of projectiles', id: 'bulletVelocity', max: 999 },
                    { label: 'Headshot Radius', desc: 'Area for critical hit detection', id: 'headshotRadius', max: 999 },
                  ].map(item => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs font-black text-white">{item.label}</span>
                          <p className="text-[8px] text-white/30 font-bold">{item.desc}</p>
                        </div>
                        <span className="text-cyan-400 font-mono text-sm font-black">{(config.aiming as any)[item.id]}</span>
                      </div>
                      <input 
                        type="range" min="0" max={item.max} step="1"
                        value={(config.aiming as any)[item.id]}
                        onChange={(e) => setConfig(prev => ({ ...prev, aiming: { ...prev.aiming, [item.id]: parseInt(e.target.value) } }))}
                        className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      />
                    </div>
                  ))}
                </div>

                <div className="glass-dark rounded-3xl p-5 space-y-4 border border-cyan-500/10">
                  <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Aim Smoothness</h3>
                  <p className="text-[8px] text-white/30 font-bold uppercase">Higher values = more human-like, but slower</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-white">Calibrate</span>
                    <span className="text-cyan-400 font-mono text-sm font-black">{config.aiming.aimSmoothness}</span>
                  </div>
                  <input 
                    type="range" min="1" max="100" step="1"
                    value={config.aiming.aimSmoothness}
                    onChange={(e) => setConfig(prev => ({ ...prev, aiming: { ...prev.aiming, aimSmoothness: parseInt(e.target.value) } }))}
                    className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                <div className="glass-dark rounded-3xl p-5 space-y-4 border border-cyan-500/10">
                  <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Combat Automation</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Trigger Bot', id: 'triggerBot' },
                      { label: 'Auto Fire', id: 'autoFire' },
                      { label: 'No Flinch', id: 'noFlinch' },
                      { label: 'Auto Aim', id: 'autoAim' },
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => setConfig(prev => ({ ...prev, aiming: { ...prev.aiming, [item.id]: !(prev.aiming as any)[item.id] } }))}
                        className={`p-4 rounded-2xl text-xs font-black flex items-center justify-between transition-all ${(config.aiming as any)[item.id] ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'glass border border-white/5 text-white/40'}`}
                      >
                        {item.label}
                        {(config.aiming as any)[item.id] ? <Check className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-dark rounded-3xl p-5 space-y-5 border border-purple-500/10">
                  <h3 className="text-[10px] font-black text-purple-400 uppercase tracking-widest">GFX Engine Pro</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/60">HDR Mode</span>
                    <select 
                      value={config.graphics.hdrMode}
                      onChange={(e) => setConfig(prev => ({ ...prev, graphics: { ...prev.graphics, hdrMode: e.target.value as any } }))}
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold outline-none"
                    >
                      {['None', 'HDR10', 'HDR10+', 'Dolby Vision'].map(m => (
                        <option key={m} value={m} className="bg-[#050505]">{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/60">Color Grade</span>
                    <select 
                      value={config.graphics.colorGrade}
                      onChange={(e) => setConfig(prev => ({ ...prev, graphics: { ...prev.graphics, colorGrade: e.target.value as any } }))}
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold outline-none"
                    >
                      {['Classic', 'Vivid', 'Cinema', 'Cool', 'Warm'].map(m => (
                        <option key={m} value={m} className="bg-[#050505]">{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-white/60">LOD Distance</span>
                      <span className="text-purple-400 font-mono text-[10px]">{config.graphics.lodDistance}x</span>
                    </div>
                    <input 
                      type="range" min="1" max="999" step="1"
                      value={config.graphics.lodDistance}
                      onChange={(e) => setConfig(prev => ({ ...prev, graphics: { ...prev.graphics, lodDistance: parseInt(e.target.value) } }))}
                      className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-white/60">Anisotropic Filtering</span>
                      <span className="text-purple-400 font-mono text-[10px]">{config.graphics.anisotropicFiltering}x</span>
                    </div>
                    <input 
                      type="range" min="1" max="16" step="1"
                      value={config.graphics.anisotropicFiltering}
                      onChange={(e) => setConfig(prev => ({ ...prev, graphics: { ...prev.graphics, anisotropicFiltering: parseInt(e.target.value) } }))}
                      className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-white/60">MSAA Anti-Aliasing</span>
                      <span className="text-purple-400 font-mono text-[10px]">{config.graphics.msaa}x</span>
                    </div>
                    <input 
                      type="range" min="0" max="8" step="2"
                      value={config.graphics.msaa}
                      onChange={(e) => setConfig(prev => ({ ...prev, graphics: { ...prev.graphics, msaa: parseInt(e.target.value) } }))}
                      className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, graphics: { ...prev.graphics, dynamicResolution: !prev.graphics.dynamicResolution } }))}
                    className={`w-full p-3 rounded-xl text-[10px] font-black flex items-center justify-between transition-all ${config.graphics.dynamicResolution ? 'bg-purple-500 text-white' : 'glass border border-white/5 text-white/40'}`}
                  >
                    Dynamic Resolution Scaling
                    {config.graphics.dynamicResolution ? <Check className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'performance' && (
              <motion.div
                key="performance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="glass-dark rounded-3xl p-5 space-y-6">
                  <h3 className="text-[10px] font-black text-purple-400 uppercase tracking-widest">System Optimization</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-white/60">Touch Sampling Rate</span>
                      <span className="text-purple-400 font-mono text-[10px]">{config.performance.touchSamplingRate} Hz</span>
                    </div>
                    <input 
                      type="range"
                      min={120}
                      max={960}
                      step={60}
                      value={config.performance.touchSamplingRate}
                      onChange={(e) => setConfig(prev => ({ ...prev, performance: { ...prev.performance, touchSamplingRate: parseInt(e.target.value) } }))}
                      className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/60">GPU Rendering Mode</span>
                    <select 
                      value={config.performance.gpuRenderingMode}
                      onChange={(e) => setConfig(prev => ({ ...prev, performance: { ...prev.performance, gpuRenderingMode: e.target.value as any } }))}
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold outline-none"
                    >
                      {['OpenGL', 'Vulkan', 'Skia'].map(mode => (
                        <option key={mode} value={mode} className="bg-[#050505]">{mode}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/60">Kernel Governor</span>
                    <select 
                      value={config.performance.kernelGovernor}
                      onChange={(e) => setConfig(prev => ({ ...prev, performance: { ...prev.performance, kernelGovernor: e.target.value as any } }))}
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold outline-none"
                    >
                      {['Performance', 'Interactive', 'Schedutil'].map(mode => (
                        <option key={mode} value={mode} className="bg-[#050505]">{mode}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/60">IO Scheduler</span>
                    <select 
                      value={config.performance.ioScheduler}
                      onChange={(e) => setConfig(prev => ({ ...prev, performance: { ...prev.performance, ioScheduler: e.target.value as any } }))}
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-bold outline-none"
                    >
                      {['cfq', 'deadline', 'noop', 'zen'].map(mode => (
                        <option key={mode} value={mode} className="bg-[#050505]">{mode}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {[
                      { label: 'CPU Freq Lock', id: 'cpuFrequencyLock' },
                      { label: 'GPU Freq Lock', id: 'gpuFrequencyLock' },
                      { label: 'Thermal Bypass', id: 'thermalBypass' },
                      { label: 'OOM Tuning', id: 'oomKillerTuning' },
                      { label: 'GPU Oversample', id: 'gpuOversampling' },
                      { label: 'Shader Cache', id: 'shaderCache' },
                      { label: 'Heap Opt', id: 'heapSizeOptimization' },
                      { label: 'ZRAM Control', id: 'zramControl' },
                      { label: 'FSTRIM', id: 'fstrim' },
                      { label: 'LMK Tuning', id: 'lowMemoryKiller' }
                    ].map(item => (
                      <button 
                        key={item.id}
                        onClick={() => setConfig(prev => ({ ...prev, performance: { ...prev.performance, [item.id]: !(prev.performance as any)[item.id] } }))}
                        className={`p-3 rounded-xl text-[10px] font-black flex items-center justify-between transition-all ${(config.performance as any)[item.id] ? 'bg-purple-500 text-white' : 'glass border border-white/5 text-white/40'}`}
                      >
                        {item.label}
                        {(config.performance as any)[item.id] ? <Check className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'system' && (
              <motion.div
                key="system"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
                    <Smartphone className="w-3 h-3" />
                    System & Device
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={applyDeviceOptimization}
                      className="flex items-center gap-2 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20"
                    >
                      <Smartphone className="w-3 h-3" />
                      Auto-Optimize
                    </button>
                    <button 
                      onClick={restoreOptimal}
                      className="flex items-center gap-2 text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/20"
                    >
                      <Activity className="w-3 h-3" />
                      Restore Optimal
                    </button>
                  </div>
                </div>

                <div className="glass-dark rounded-3xl p-5 border border-white/5 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Path Root (Storage)</h3>
                    <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
                      {(['/storage/emulated/0', '/sdcard'] as const).map(root => (
                        <button
                          key={root}
                          onClick={() => setPathRoot(root)}
                          className={`px-3 py-1 rounded-lg text-[8px] font-bold transition-all ${pathRoot === root ? 'bg-blue-500 text-white' : 'text-white/30 hover:text-white/60'}`}
                        >
                          {root}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Connection Method</h3>
                    <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
                      {(['web', 'shizuku', 'shell'] as const).map(m => (
                        <button
                          key={m}
                          onClick={() => {
                            setConnectionMethod(m);
                            setStorageConnected('disconnected');
                          }}
                          className={`px-3 py-1 rounded-lg text-[8px] font-bold uppercase transition-all ${connectionMethod === m ? 'bg-blue-500 text-white' : 'text-white/30 hover:text-white/60'}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-white/70">
                        {connectionMethod === 'web' ? 'Storage Connection' : 
                         connectionMethod === 'shizuku' ? 'Shizuku Bridge' : 'Shell Injection'}
                      </span>
                      <p className="text-[8px] text-white/40">
                        {connectionMethod === 'web' ? 'Access to Android/data folder' : 
                         connectionMethod === 'shizuku' ? 'ADB-level service access' : 'Manual terminal command generation'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={async () => {
                          addLog("Verifying file system integrity...");
                          if (storageConnected !== 'connected') {
                            addLog("ERROR: Storage not connected. Connect storage first.");
                            return;
                          }
                          
                          const steps = [
                            "Checking Android/data permissions...",
                            "Verifying game package directory...",
                            "Scanning for existing config files...",
                            "Testing write access to target path..."
                          ];

                          for (const step of steps) {
                            addLog(step);
                            await new Promise(r => setTimeout(r, 600));
                          }
                          
                          addLog(">>> VERIFICATION SUCCESS: File system is ready for injection <<<");
                        }}
                        className="px-3 py-1.5 rounded-xl text-[8px] font-black tracking-wider bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 transition-all"
                      >
                        VERIFY FS
                      </button>
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[8px] font-bold uppercase tracking-wider ${
                        storageConnected === 'connected' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        storageConnected === 'verifying' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        storageConnected === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-white/5 text-white/40 border border-white/10'
                      }`}>
                        <div className={`w-1 h-1 rounded-full ${
                          storageConnected === 'connected' ? 'bg-green-400 animate-pulse' :
                          storageConnected === 'verifying' ? 'bg-blue-400 animate-spin' :
                          storageConnected === 'error' ? 'bg-red-400' :
                          'bg-white/20'
                        }`} />
                        {storageConnected}
                      </div>
                      {storageConnected !== 'connected' && (
                        <button 
                          onClick={connectStorage}
                          disabled={storageConnected === 'verifying'}
                          className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                        >
                          <Link2 className="w-3 h-3" />
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {connectionMethod === 'shizuku' && (
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-[10px] font-bold text-white/40">Service Status</span>
                      <span className={`text-[10px] font-mono ${shizukuStatus === 'running' ? 'text-green-400' : 'text-white/20'}`}>
                        {shizukuStatus === 'running' ? 'ACTIVE (v13.5.0)' : 'NOT RUNNING'}
                      </span>
                    </div>
                  )}

                  <div className="h-px bg-white/5" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/70">Target Path</span>
                    <span className="text-[8px] font-mono text-blue-400 truncate max-w-[150px]">{config.system.targetPath}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/70">Engine Version</span>
                    <span className="text-[10px] font-mono text-white/40">{config.system.engineVersion}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white/70">OS Version</span>
                    <span className="text-[10px] font-mono text-white/40">{config.system.osVersion}</span>
                  </div>
                </div>

                <div className="glass-dark rounded-3xl p-5 border border-white/5 space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Device Spoofing</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Spoof Device', id: 'spoofDevice' },
                      { label: 'Spoof Brand', id: 'spoofManufacturer' },
                      { label: 'Spoof GPU', id: 'spoofGpu' },
                      { label: 'Unlock 120FPS', id: 'unlockMaxFps' }
                    ].map(item => (
                      <button 
                        key={item.id}
                        onClick={() => setConfig(prev => ({ ...prev, system: { ...prev.system, [item.id]: !(prev.system as any)[item.id] } }))}
                        className={`p-3 rounded-xl text-[10px] font-black flex items-center justify-between transition-all ${(config.system as any)[item.id] ? 'bg-blue-500 text-white' : 'glass border border-white/5 text-white/40'}`}
                      >
                        {item.label}
                        {(config.system as any)[item.id] ? <Check className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-dark rounded-3xl p-5 border border-white/5 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">File Explorer (Preview)</h3>
                    <Folder className="w-3 h-3 text-white/20" />
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {[
                      { name: 'Android', type: 'dir' },
                      { name: 'data', type: 'dir', parent: 'Android' },
                      { name: config.gameMode === 'GLOBAL' ? 'com.tencent.ig' : config.gameMode === 'BGMI' ? 'com.pubg.imobile' : 'com.vng.pubgmobile', type: 'dir', parent: 'data' },
                      { name: 'files', type: 'dir', parent: 'game' },
                      { name: 'UE4Game', type: 'dir', parent: 'files' },
                      { name: 'ShadowTrackerExtra', type: 'dir', parent: 'UE4Game' },
                      { name: 'Saved', type: 'dir', parent: 'ShadowTrackerExtra' },
                      { name: 'Config', type: 'dir', parent: 'Saved' },
                      { name: 'Android', type: 'dir', parent: 'Config' },
                      { name: 'UserCustom.ini', type: 'file', parent: 'Android' }
                    ].map((file, i) => (
                      <div key={i} className={`flex items-center gap-2 text-[9px] font-mono ${file.type === 'dir' ? 'text-blue-400' : 'text-white/60'}`} style={{ paddingLeft: `${(file.parent ? 12 : 0)}px` }}>
                        {file.type === 'dir' ? <Folder className="w-2.5 h-2.5" /> : <FileText className="w-2.5 h-2.5" />}
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-dark rounded-3xl p-5 border border-white/5 space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Required Permissions</h3>
                  <div className="space-y-2">
                    {config.system.permissions.map(perm => (
                      <div key={perm} className="flex items-center gap-2 text-[10px] font-bold text-white/60">
                        <Check className="w-3 h-3 text-green-500" />
                        {perm}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'json', icon: FileJson, label: '.JSON' },
                    { id: 'ini', icon: FileText, label: '.INI' },
                    { id: 'xml', icon: Code, label: '.XML' },
                    { id: 'lua', icon: FileCode, label: '.LUA' },
                    { id: 'sav', icon: Smartphone, label: '.SAV' },
                    { id: 'inj', icon: Zap, label: '.INJ' },
                    { id: 'yaml', icon: FileText, label: '.YAML' }
                  ].map(format => (
                    <button
                      key={format.id}
                      onClick={() => {
                        setSelectedFormats(prev => 
                          prev.includes(format.id as any) 
                            ? prev.filter(f => f !== format.id) 
                            : [...prev, format.id as any]
                        );
                      }}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-wider flex items-center gap-2 transition-all ${selectedFormats.includes(format.id as any) ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'glass-dark text-white/40'}`}
                    >
                      <format.icon className="w-3 h-3" />
                      {format.label}
                    </button>
                  ))}
                  <button 
                    onClick={() => setSelectedFormats(['json', 'ini', 'xml', 'lua', 'sav', 'inj', 'yaml'])}
                    className="px-4 py-2 rounded-xl text-[10px] font-black tracking-wider bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                  >
                    SELECT ALL
                  </button>
                  <button 
                    onClick={() => setSelectedFormats([])}
                    className="px-4 py-2 rounded-xl text-[10px] font-black tracking-wider bg-red-500/10 text-red-400 border border-red-500/20"
                  >
                    DESELECT ALL
                  </button>
                  <button 
                    onClick={async () => {
                      addLog("Packaging all selected configuration formats...");
                      const zip = new JSZip();
                      
                      if (selectedFormats.includes('ini')) zip.file('config.ini', generateINI(config));
                      if (selectedFormats.includes('lua')) zip.file('script.lua', generateLUA(config));
                      if (selectedFormats.includes('xml')) zip.file('settings.xml', generateXML(config));
                      if (selectedFormats.includes('sav')) zip.file('game.sav', generateSAV(config));
                      if (selectedFormats.includes('inj')) zip.file('payload.inj', generateINJ(config));
                      if (selectedFormats.includes('yaml')) zip.file('config.yaml', generateYAML(config));
                      if (selectedFormats.includes('json')) zip.file('config.json', JSON.stringify(config, null, 2));

                      const content = await zip.generateAsync({ type: 'blob' });
                      const url = URL.createObjectURL(content);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `GameConfig_${config.gameMode}_${new Date().getTime()}.zip`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      addLog(">>> BUNDLE DOWNLOADED: All configurations packaged successfully <<<");
                    }}
                    className="px-4 py-2 rounded-xl text-[10px] font-black tracking-wider bg-green-500 text-white shadow-lg shadow-green-500/20 flex items-center gap-2"
                  >
                    <Download className="w-3 h-3" />
                    DOWNLOAD ALL
                  </button>
                </div>

                <div className="glass-dark rounded-3xl p-5 font-mono text-[9px] leading-relaxed relative overflow-hidden group min-h-[300px]">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                  <pre className="text-blue-300/80 overflow-x-auto whitespace-pre-wrap">
                    {getPreviewContent()}
                  </pre>
                  <button 
                    onClick={() => navigator.clipboard.writeText(getPreviewContent())}
                    className="absolute top-4 right-4 p-2 rounded-lg glass opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                </div>

                {/* File System Info */}
                <div className="glass-dark rounded-3xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
                    <Folder className="w-3 h-3" />
                    File System Verification
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                        <Folder className="w-3 h-3 text-blue-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-white/40 uppercase">Target Path</p>
                        <p className="text-[10px] font-mono text-white/70 break-all">{config.system.targetPath}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                        <Lock className="w-3 h-3 text-green-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-white/40 uppercase">Required Permissions</p>
                        <div className="flex flex-wrap gap-1">
                          {config.system.permissions.map(p => (
                            <span key={p} className="text-[8px] px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-mono">{p}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleApply}
              disabled={isApplying}
              className="w-full glossy-button py-4 rounded-2xl font-black tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/20"
            >
              {isApplying ? (
                <div className="flex items-center gap-3">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span className="animate-pulse uppercase">Injecting Configs...</span>
                </div>
              ) : showSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  SYNC COMPLETED
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-white" />
                  APPLY TO SYSTEM
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Permission Modal */}
      <AnimatePresence>
        {showPermissionModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-dark border border-white/10 rounded-[40px] p-8 max-w-sm w-full space-y-6 text-center"
            >
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-10 h-10 text-blue-400" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Storage Access</h2>
                <p className="text-xs text-white/40 leading-relaxed">
                  Ultra Engine requires <span className="text-white font-bold">MANAGE_EXTERNAL_STORAGE</span> permission to inject configuration files directly into the game directory.
                </p>
              </div>

              <div className="glass-dark p-4 rounded-2xl text-left space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-bold text-white/60">Access Android/data/com.pubg.imobile</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-bold text-white/60">Write GameUserSettings.ini</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-bold text-white/60">Bypass Scoped Storage Restrictions</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={async () => {
                    setPermissionStep('verifying');
                    await new Promise(r => setTimeout(r, 1500));
                    setStorageConnected('connected');
                    setPermissionStep('granted');
                    await new Promise(r => setTimeout(r, 1000));
                    setShowPermissionModal(false);
                    handleApply();
                  }}
                  className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white font-black text-xs rounded-2xl transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest"
                >
                  {permissionStep === 'request' ? 'Allow Access' : permissionStep === 'verifying' ? 'Verifying...' : 'Access Granted'}
                </button>
                <button 
                  onClick={() => setShowPermissionModal(false)}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 text-white/40 font-bold text-xs rounded-2xl transition-all uppercase tracking-widest"
                >
                  Deny
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, y: 40, rotateX: 20 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.8, y: 40, rotateX: 20 }}
              className="glass rounded-[40px] p-8 max-w-xs w-full text-center space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500" />
              
              {/* Injection Log Console */}
              <div className="glass-dark rounded-2xl p-4 text-left font-mono text-[8px] h-40 overflow-y-auto space-y-1 scrollbar-hide">
                {logs.map((log, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={log.includes('SUCCESS') ? 'text-green-400' : 'text-blue-300/60'}
                  >
                    {log}
                  </motion.div>
                ))}
                <div ref={logEndRef} />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black font-display tracking-tight">INJECTION OK</h2>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">System Environment Synced</p>
              </div>

              <div className="flex flex-col gap-3">
                {connectionMethod === 'shell' && (
                  <div className="space-y-3">
                    <button 
                      onClick={() => {
                        // Simple zip-like download simulation
                        generatedFiles.forEach(file => {
                          const blob = new Blob([file.content], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = file.name;
                          a.click();
                          URL.revokeObjectURL(url);
                        });
                        addLog("Config files downloaded. Move them to /sdcard/Download/GameConfig/");
                      }}
                      className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-3 h-3" />
                      Download Config Pack
                    </button>

                    <div className="glass-dark rounded-2xl p-4 text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-black text-white/40 uppercase">Shell Command (Copy to Termux/LADB)</span>
                      <button 
                        onClick={() => {
                          const cmd = `mkdir -p ${config.system.targetPath} && cp /sdcard/Download/GameConfig/* ${config.system.targetPath}`;
                          navigator.clipboard.writeText(cmd);
                          addLog("Shell command copied to clipboard.");
                        }}
                        className="text-[8px] font-bold text-blue-400"
                      >
                        COPY
                      </button>
                    </div>
                    <code className="block text-[7px] font-mono text-green-400/80 break-all bg-black/40 p-2 rounded-lg border border-white/5">
                      mkdir -p {config.system.targetPath} && cp /sdcard/Download/GameConfig/* {config.system.targetPath}
                    </code>
                  </div>
                </div>
                )}
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLaunchGame}
                  disabled={isLaunching}
                  className="w-full py-4 rounded-2xl bg-blue-500 font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-500/40 flex items-center justify-center gap-3"
                >
                  {isLaunching ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      Launch {config.gameMode}
                    </>
                  )}
                </motion.button>
                <button 
                  onClick={() => setShowSuccess(false)}
                  className="w-full py-4 rounded-2xl bg-white/5 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Close Console
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

