export interface GameConfig {
  gameMode: 'BGMI' | 'CODM' | 'GLOBAL' | 'FREEFIRE';
  selectedPresets: string[]; // Changed to array for multi-select
  selectedParameters: string[];
  graphics: {
    resolution: string;
    fpsLimit: number;
    antiAliasing: boolean;
    shadowQuality: 'Low' | 'Medium' | 'High' | 'Ultra' | 'Potato';
    textureQuality: 'Low' | 'Medium' | 'High' | 'Ultra' | 'Potato';
    renderQuality: string;
    framePacing: boolean;
    zeroLagMode: boolean;
    superSmooth: boolean;
    fpsStability: boolean;
    hdrMode: 'None' | 'HDR' | 'HDR10' | 'DolbyVision';
    colorGrade: 'Classic' | 'Vivid' | 'Soft' | 'Movie';
    lodDistance: number;
    anisotropicFiltering: number;
    msaa: number;
    dynamicResolution: boolean;
  };
  aiming: {
    aimAssist: number;
    glueAssist: number;
    magicAim: boolean;
    aimCorrection: number;
    predictPath: boolean;
    predictBulletTrack: boolean;
    aimSnap: boolean;
    autoTrack: boolean;
    recoilCompensation: number;
    spreadControl: number;
    aimStabilization: number;
    bulletDropCompensation: boolean;
    magicBullet: boolean;
    // New Aggressive Parameters
    hitPriority: number;
    autoHeadshot: boolean;
    priorityLevel: number;
    criticalHit: boolean;
    damageMultiplier: number;
    aimAutoPull: boolean;
    autoScope: boolean;
    enemyLock: boolean;
    lockAim: boolean;
    lockTarget: boolean;
    bulletLock: boolean;
    hipFireBoost: boolean;
    rangeExtender: boolean;
    healthStealOpt: boolean;
    // Granular Advanced Parameters
    magneticPull: number;
    aimPullStrength: number;
    lockStrength: number;
    stickiness: number;
    // New Advanced Aiming
    bulletVelocity: number;
    headshotRadius: number;
    aimSmoothness: number;
    triggerBot: boolean;
    autoFire: boolean;
    aimFov: number;
    aimBone: 'Head' | 'Chest' | 'Pelvis';
    silentAim: boolean;
    noSpread: boolean;
    instantHit: boolean;
    bulletTeleport: boolean;
    wallHack: boolean;
    espLine: boolean;
    espBox: boolean;
    espDistance: boolean;
    espHealth: boolean;
    // Ultra Advanced
    noFlinch: boolean;
    curvingBullets: boolean;
    bulletMagnetism: number;
    recoilPattern: 'Static' | 'Dynamic' | 'None';
    autoAim: boolean;
  };
  weapons: {
    [weaponName: string]: {
      recoil: number;
      spread: number;
      damage: number;
      range: number;
      stability: number;
    };
  };
  tactics: {
    dropShot: boolean;
    jumpShot: boolean;
    slideCancel: boolean;
    quickScope: boolean;
    autoLean: boolean;
    fastReload: boolean;
    crouchSpam: boolean;
    zigZagMove: boolean;
  };
  network: {
    pingFix: boolean;
    packetPriority: 'Normal' | 'High' | 'Extreme';
    latencyOptimization: boolean;
    jitterCompensation: boolean;
    dnsOptimization: boolean;
    tcpNoDelay: boolean;
    bypassThrottle: boolean;
    dataCompression: boolean;
  };
  performance: {
    vSync: boolean;
    bloom: boolean;
    motionBlur: boolean;
    renderDistance: number;
    cpuPriority: 'Normal' | 'High' | 'Realtime';
    gpuClock: 'Normal' | 'Max';
    ramCleanup: boolean;
    thermalControl: boolean;
    lagFix: boolean;
    damageReduction: boolean;
    advantageMode: boolean;
    // Advanced Performance
    cpuFrequencyLock: boolean;
    gpuFrequencyLock: boolean;
    thermalBypass: boolean;
    ultraLowLatency: boolean;
    // New Advanced Performance
    touchSamplingRate: number;
    gpuRenderingMode: 'OpenGL' | 'Vulkan' | 'Skia';
    oomKillerTuning: boolean;
    kernelGovernor: 'Performance' | 'Interactive' | 'Schedutil';
    gpuOversampling: boolean;
    shaderCache: boolean;
    heapSizeOptimization: boolean;
    zramControl: boolean;
    fstrim: boolean;
    ioScheduler: 'mq-deadline' | 'kyber' | 'bfq';
    lowMemoryKiller: 'Aggressive' | 'Normal';
  };
  system: {
    deviceName: string;
    osVersion: string;
    engineVersion: string;
    targetPath: string;
    permissions: string[];
    fileTypes: string[];
    spoofDevice: string;
    spoofManufacturer: string;
    spoofGpu: string;
    unlockMaxFps: boolean;
  };
}

export const DEFAULT_CONFIG: GameConfig = {
  gameMode: 'BGMI',
  selectedPresets: ['Default'],
  selectedParameters: [],
  graphics: {
    resolution: '1080p',
    fpsLimit: 60,
    antiAliasing: true,
    shadowQuality: 'High',
    textureQuality: 'High',
    renderQuality: 'High',
    framePacing: true,
    zeroLagMode: false,
    superSmooth: false,
    fpsStability: true,
    hdrMode: 'None',
    colorGrade: 'Classic',
    lodDistance: 100,
    anisotropicFiltering: 2,
    msaa: 0,
    dynamicResolution: false,
  },
  aiming: {
    aimAssist: 100,
    glueAssist: 50,
    magicAim: false,
    aimCorrection: 30,
    predictPath: true,
    predictBulletTrack: false,
    aimSnap: false,
    autoTrack: false,
    recoilCompensation: 50,
    spreadControl: 40,
    aimStabilization: 60,
    bulletDropCompensation: true,
    magicBullet: false,
    hitPriority: 50,
    autoHeadshot: false,
    priorityLevel: 1,
    criticalHit: false,
    damageMultiplier: 1.0,
    aimAutoPull: false,
    autoScope: false,
    enemyLock: false,
    lockAim: false,
    lockTarget: false,
    bulletLock: false,
    hipFireBoost: false,
    rangeExtender: false,
    healthStealOpt: false,
    magneticPull: 100,
    aimPullStrength: 100,
    lockStrength: 100,
    stickiness: 100,
    bulletVelocity: 100,
    headshotRadius: 50,
    aimSmoothness: 10,
    triggerBot: false,
    autoFire: false,
    aimFov: 10,
    aimBone: 'Head',
    silentAim: false,
    noSpread: false,
    instantHit: false,
    bulletTeleport: false,
    wallHack: false,
    espLine: false,
    espBox: false,
    espDistance: false,
    espHealth: false,
    noFlinch: true,
    curvingBullets: false,
    bulletMagnetism: 100,
    recoilPattern: 'None',
    autoAim: true,
  },
  weapons: {
    'M416': { recoil: 0, spread: 0, damage: 100, range: 100, stability: 100 },
    'AKM': { recoil: 0, spread: 0, damage: 100, range: 100, stability: 100 },
    'Beryl M762': { recoil: 0, spread: 0, damage: 100, range: 100, stability: 100 },
    'SCAR-L': { recoil: 0, spread: 0, damage: 100, range: 100, stability: 100 },
    'DP-28': { recoil: 0, spread: 0, damage: 100, range: 100, stability: 100 },
    'AWM': { recoil: 0, spread: 0, damage: 100, range: 100, stability: 100 },
    'Kar98K': { recoil: 0, spread: 0, damage: 100, range: 100, stability: 100 },
    'M24': { recoil: 0, spread: 0, damage: 100, range: 100, stability: 100 },
    'M13': { recoil: 0, spread: 0, damage: 100, range: 100, stability: 100 },
    'Kilo 141': { recoil: 0, spread: 0, damage: 100, range: 100, stability: 100 },
    'DL Q33': { recoil: 0, spread: 0, damage: 100, range: 100, stability: 100 },
    'Locus': { recoil: 0, spread: 0, damage: 100, range: 100, stability: 100 },
    'Holger 26': { recoil: 0, spread: 0, damage: 100, range: 100, stability: 100 },
    'CBR4': { recoil: 0, spread: 0, damage: 100, range: 100, stability: 100 },
    'Switchblade X9': { recoil: 0, spread: 0, damage: 100, range: 100, stability: 100 },
    'Krig 6': { recoil: 0, spread: 0, damage: 100, range: 100, stability: 100 },
  },
  tactics: {
    dropShot: true,
    jumpShot: true,
    slideCancel: true,
    quickScope: true,
    autoLean: true,
    fastReload: true,
    crouchSpam: false,
    zigZagMove: false,
  },
  network: {
    pingFix: true,
    packetPriority: 'High',
    latencyOptimization: true,
    jitterCompensation: true,
    dnsOptimization: true,
    tcpNoDelay: true,
    bypassThrottle: true,
    dataCompression: false,
  },
  performance: {
    vSync: false,
    bloom: true,
    motionBlur: false,
    renderDistance: 500,
    cpuPriority: 'High',
    gpuClock: 'Normal',
    ramCleanup: true,
    thermalControl: false,
    lagFix: true,
    damageReduction: false,
    advantageMode: false,
    cpuFrequencyLock: false,
    gpuFrequencyLock: false,
    thermalBypass: false,
    ultraLowLatency: true,
    touchSamplingRate: 300,
    gpuRenderingMode: 'Vulkan',
    oomKillerTuning: true,
    kernelGovernor: 'Performance',
    gpuOversampling: false,
    shaderCache: true,
    heapSizeOptimization: true,
    zramControl: true,
    fstrim: true,
    ioScheduler: 'mq-deadline',
    lowMemoryKiller: 'Normal',
  },
  system: {
    deviceName: 'M2101K6P',
    osVersion: 'Android 13',
    engineVersion: 'v4.27.2-Custom',
    targetPath: '/storage/emulated/0/Android/data/com.pubg.imobile/files/UE4Game/ShadowTrackerExtra/ShadowTrackerExtra/Saved/Config/Android/',
    permissions: ['READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE', 'MANAGE_EXTERNAL_STORAGE'],
    fileTypes: ['ini', 'sav', 'xml', 'lua', 'inj', 'json'],
    spoofDevice: 'ROG Phone 8 Pro',
    spoofManufacturer: 'ASUS',
    spoofGpu: 'Adreno 750',
    unlockMaxFps: true,
  },
};

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export const PRESETS: (DeepPartial<GameConfig> & { preset: string })[] = [
  { 
    preset: 'Ultra Aggressive', 
    aiming: { 
      aimAssist: 200, 
      glueAssist: 200, 
      magicAim: true, 
      aimSnap: true, 
      magicBullet: true, 
      recoilCompensation: 100,
      autoHeadshot: true,
      hitPriority: 100,
      damageMultiplier: 2.5,
      enemyLock: true,
      bulletLock: true,
      magneticPull: 300,
      aimPullStrength: 300,
      lockStrength: 300,
      stickiness: 300,
      bulletVelocity: 500,
      headshotRadius: 200,
      aimSmoothness: 0,
      triggerBot: true,
      autoFire: true,
    }, 
    performance: { 
      cpuPriority: 'Realtime', 
      gpuClock: 'Max', 
      lagFix: true,
      advantageMode: true,
      cpuFrequencyLock: true,
      gpuFrequencyLock: true,
      thermalBypass: true,
      ultraLowLatency: true,
      touchSamplingRate: 600,
      gpuRenderingMode: 'Vulkan',
      oomKillerTuning: true,
      kernelGovernor: 'Performance',
    },
    graphics: {
      resolution: '2K',
      fpsLimit: 120,
      antiAliasing: true,
      shadowQuality: 'Ultra',
      textureQuality: 'Ultra',
      renderQuality: 'High',
      framePacing: true,
      zeroLagMode: true,
      superSmooth: true,
      fpsStability: true,
      hdrMode: 'HDR10',
      colorGrade: 'Vivid',
      lodDistance: 300,
      anisotropicFiltering: 8,
      msaa: 4,
      dynamicResolution: false
    }
  },
  { 
    preset: 'Pro Tournament', 
    aiming: { 
      aimAssist: 140, 
      glueAssist: 90, 
      aimCorrection: 60, 
      recoilCompensation: 85,
      aimAutoPull: true,
      priorityLevel: 5
    }, 
    graphics: { 
      fpsLimit: 90, 
      shadowQuality: 'Low',
      superSmooth: true,
      msaa: 2,
      lodDistance: 150,
      anisotropicFiltering: 4
    } 
  },
  { 
    preset: 'Magic Aim V2', 
    aiming: { 
      magicAim: true, 
      aimSnap: true, 
      autoTrack: true, 
      predictPath: true,
      lockTarget: true,
      autoScope: true
    } 
  },
  { 
    preset: 'Bullet God', 
    aiming: { 
      predictBulletTrack: true, 
      bulletDropCompensation: true, 
      magicBullet: true,
      bulletLock: true,
      rangeExtender: true,
      criticalHit: true,
      bulletVelocity: 1000,
      headshotRadius: 300
    } 
  },
  { 
    preset: 'Immortal Mode', 
    performance: { 
      damageReduction: true,
      thermalControl: true,
      ramCleanup: true
    },
    aiming: {
      healthStealOpt: true
    }
  },
  { 
    preset: 'Network Beast', 
    network: { 
      packetPriority: 'Extreme', 
      latencyOptimization: true, 
      pingFix: true, 
      tcpNoDelay: true,
      bypassThrottle: true
    } 
  },
  { 
    preset: 'Zero Recoil Max', 
    aiming: { 
      recoilCompensation: 100, 
      spreadControl: 100, 
      aimStabilization: 100,
      hipFireBoost: true
    } 
  },
  { 
    preset: 'Potato Extreme', 
    graphics: { 
      resolution: '360p', 
      shadowQuality: 'Potato', 
      textureQuality: 'Potato',
      zeroLagMode: true
    }, 
    performance: { 
      lagFix: true, 
      ramCleanup: true 
    } 
  }
];
