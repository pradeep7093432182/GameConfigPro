import { GameConfig } from '../types';

export const generateINI = (config: GameConfig): string => {
  return `[Core]
GameMode=${config.gameMode}
Presets=${config.selectedPresets.join(',')}
ExecutionMode=ULTRA_AGGRESSIVE_V4
EngineVersion=${config.system.engineVersion}

[Graphics]
Resolution=${config.graphics.resolution}
FPSLimit=${config.graphics.fpsLimit}
AntiAliasing=${config.graphics.antiAliasing ? 1 : 0}
ShadowQuality=${config.graphics.shadowQuality}
TextureQuality=${config.graphics.textureQuality}
RenderQuality=${config.graphics.renderQuality}
FramePacing=${config.graphics.framePacing ? 1 : 0}
ZeroLagMode=${config.graphics.zeroLagMode ? 1 : 0}
SuperSmooth=${config.graphics.superSmooth ? 1 : 0}
FPSStability=${config.graphics.fpsStability ? 1 : 0}
HDRMode=${config.graphics.hdrMode}
ColorGrade=${config.graphics.colorGrade}
LODDistance=${config.graphics.lodDistance}
AnisotropicFiltering=${config.graphics.anisotropicFiltering}
MSAA=${config.graphics.msaa}
DynamicResolution=${config.graphics.dynamicResolution ? 1 : 0}

[AimingSystem]
AimAssistStrength=${config.aiming.aimAssist}
GlueAssist=${config.aiming.glueAssist}
MagicAim=${config.aiming.magicAim ? 1 : 0}
AimCorrection=${config.aiming.aimCorrection}
PredictPath=${config.aiming.predictPath ? 1 : 0}
PredictBulletTrack=${config.aiming.predictBulletTrack ? 1 : 0}
AimSnap=${config.aiming.aimSnap ? 1 : 0}
AutoTrack=${config.aiming.autoTrack ? 1 : 0}
RecoilCompensation=${config.aiming.recoilCompensation}
SpreadControl=${config.aiming.spreadControl}
AimStabilization=${config.aiming.aimStabilization}
BulletDropCompensation=${config.aiming.bulletDropCompensation ? 1 : 0}
MagicBullet=${config.aiming.magicBullet ? 1 : 0}
HitPriority=${config.aiming.hitPriority}
AutoHeadshot=${config.aiming.autoHeadshot ? 1 : 0}
PriorityLevel=${config.aiming.priorityLevel}
CriticalHit=${config.aiming.criticalHit ? 1 : 0}
DamageMultiplier=${config.aiming.damageMultiplier}
AimAutoPull=${config.aiming.aimAutoPull ? 1 : 0}
AutoScope=${config.aiming.autoScope ? 1 : 0}
EnemyLock=${config.aiming.enemyLock ? 1 : 0}
LockAim=${config.aiming.lockAim ? 1 : 0}
LockTarget=${config.aiming.lockTarget ? 1 : 0}
BulletLock=${config.aiming.bulletLock ? 1 : 0}
HipFireBoost=${config.aiming.hipFireBoost ? 1 : 0}
RangeExtender=${config.aiming.rangeExtender ? 1 : 0}
HealthStealOpt=${config.aiming.healthStealOpt ? 1 : 0}
MagneticPull=${config.aiming.magneticPull}
AimPullStrength=${config.aiming.aimPullStrength}
LockStrength=${config.aiming.lockStrength}
Stickiness=${config.aiming.stickiness}
BulletVelocity=${config.aiming.bulletVelocity}
HeadshotRadius=${config.aiming.headshotRadius}
AimSmoothness=${config.aiming.aimSmoothness}
TriggerBot=${config.aiming.triggerBot ? 1 : 0}
AutoFire=${config.aiming.autoFire ? 1 : 0}
NoFlinch=${config.aiming.noFlinch ? 1 : 0}
CurvingBullets=${config.aiming.curvingBullets ? 1 : 0}
BulletMagnetism=${config.aiming.bulletMagnetism}
RecoilPattern=${config.aiming.recoilPattern}
AutoAim=${config.aiming.autoAim ? 1 : 0}

[Weapons]
${Object.entries(config.weapons).map(([name, stats]) => `${name}_Recoil=${stats.recoil}\n${name}_Spread=${stats.spread}\n${name}_Damage=${stats.damage}`).join('\n')}

[Tactics]
DropShot=${config.tactics.dropShot ? 1 : 0}
JumpShot=${config.tactics.jumpShot ? 1 : 0}
SlideCancel=${config.tactics.slideCancel ? 1 : 0}
QuickScope=${config.tactics.quickScope ? 1 : 0}
AutoLean=${config.tactics.autoLean ? 1 : 0}
FastReload=${config.tactics.fastReload ? 1 : 0}
CrouchSpam=${config.tactics.crouchSpam ? 1 : 0}
ZigZagMove=${config.tactics.zigZagMove ? 1 : 0}

[Network]
PingFix=${config.network.pingFix ? 1 : 0}
PacketPriority=${config.network.packetPriority}
LatencyOptimization=${config.network.latencyOptimization ? 1 : 0}
JitterCompensation=${config.network.jitterCompensation ? 1 : 0}
DNSOptimization=${config.network.dnsOptimization ? 1 : 0}
TcpNoDelay=${config.network.tcpNoDelay ? 1 : 0}
BypassThrottle=${config.network.bypassThrottle ? 1 : 0}
DataCompression=${config.network.dataCompression ? 1 : 0}

[Performance]
VSync=${config.performance.vSync ? 1 : 0}
Bloom=${config.performance.bloom ? 1 : 0}
MotionBlur=${config.performance.motionBlur ? 1 : 0}
RenderDistance=${config.performance.renderDistance}
CPUPriority=${config.performance.cpuPriority}
GPUClock=${config.performance.gpuClock}
RAMCleanup=${config.performance.ramCleanup ? 1 : 0}
ThermalControl=${config.performance.thermalControl ? 1 : 0}
LagFix=${config.performance.lagFix ? 1 : 0}
DamageReduction=${config.performance.damageReduction ? 1 : 0}
AdvantageMode=${config.performance.advantageMode ? 1 : 0}
CpuFrequencyLock=${config.performance.cpuFrequencyLock ? 1 : 0}
GpuFrequencyLock=${config.performance.gpuFrequencyLock ? 1 : 0}
ThermalBypass=${config.performance.thermalBypass ? 1 : 0}
UltraLowLatency=${config.performance.ultraLowLatency ? 1 : 0}
TouchSamplingRate=${config.performance.touchSamplingRate}
GpuRenderingMode=${config.performance.gpuRenderingMode}
OomKillerTuning=${config.performance.oomKillerTuning ? 1 : 0}
KernelGovernor=${config.performance.kernelGovernor}
GpuOversampling=${config.performance.gpuOversampling ? 1 : 0}
ShaderCache=${config.performance.shaderCache ? 1 : 0}
HeapSizeOptimization=${config.performance.heapSizeOptimization ? 1 : 0}
ZramControl=${config.performance.zramControl ? 1 : 0}
Fstrim=${config.performance.fstrim ? 1 : 0}
IoScheduler=${config.performance.ioScheduler}
LowMemoryKiller=${config.performance.lowMemoryKiller}

[System]
SpoofDevice=${config.system.spoofDevice}
SpoofManufacturer=${config.system.spoofManufacturer}
SpoofGpu=${config.system.spoofGpu}
UnlockMaxFps=${config.system.unlockMaxFps ? 1 : 0}
`;
};

export const generateLUA = (config: GameConfig): string => {
  return `Config = {
    core = {
        game_mode = "${config.gameMode}",
        presets = { "${config.selectedPresets.join('", "')}" },
        engine = "ULTRA_ENGINE_V4"
    },
    graphics = {
        resolution = "${config.graphics.resolution}",
        fps_limit = ${config.graphics.fpsLimit},
        aa_enabled = ${config.graphics.antiAliasing},
        shadows = "${config.graphics.shadowQuality}",
        textures = "${config.graphics.textureQuality}",
        zero_lag = ${config.graphics.zeroLagMode},
        super_smooth = ${config.graphics.superSmooth},
        hdr_mode = "${config.graphics.hdrMode}",
        color_grade = "${config.graphics.colorGrade}",
        lod_dist = ${config.graphics.lodDistance},
        af_level = ${config.graphics.anisotropicFiltering},
        msaa = ${config.graphics.msaa},
        dynamic_res = ${config.graphics.dynamicResolution}
    },
    aiming = {
        assist = ${config.aiming.aimAssist},
        glue = ${config.aiming.glueAssist},
        magic = ${config.aiming.magicAim},
        snap = ${config.aiming.aimSnap},
        magic_bullet = ${config.aiming.magicBullet},
        recoil = ${config.aiming.recoilCompensation},
        headshot = ${config.aiming.autoHeadshot},
        damage_mult = ${config.aiming.damageMultiplier},
        enemy_lock = ${config.aiming.enemyLock},
        aim_fov = ${config.aiming.aimFov},
        aim_bone = "${config.aiming.aimBone}",
        silent_aim = ${config.aiming.silentAim},
        no_spread = ${config.aiming.noSpread},
        instant_hit = ${config.aiming.instantHit},
        bullet_tp = ${config.aiming.bulletTeleport},
        wall_hack = ${config.aiming.wallHack},
        esp = {
            line = ${config.aiming.espLine},
            box = ${config.aiming.espBox},
            dist = ${config.aiming.espDistance},
            health = ${config.aiming.espHealth}
        }
    },
    network = {
        ping_fix = ${config.network.pingFix},
        priority = "${config.network.packetPriority}",
        no_delay = ${config.network.tcpNoDelay},
        bypass = ${config.network.bypassThrottle}
    },
    performance = {
        cpu = "${config.performance.cpuPriority}",
        gpu = "${config.performance.gpuClock}",
        lag_fix = ${config.performance.lagFix},
        dmg_reduction = ${config.performance.damageReduction},
        cpu_freq_lock = ${config.performance.cpuFrequencyLock},
        gpu_freq_lock = ${config.performance.gpuFrequencyLock},
        thermal_bypass = ${config.performance.thermalBypass},
        gpu_oversampling = ${config.performance.gpuOversampling},
        shader_cache = ${config.performance.shaderCache},
        heap_opt = ${config.performance.heapSizeOptimization},
        zram = ${config.performance.zramControl},
        fstrim = ${config.performance.fstrim},
        io_scheduler = "${config.performance.ioScheduler}",
        lmk = "${config.performance.lowMemoryKiller}"
    },
    system = {
        spoof_device = "${config.system.spoofDevice}",
        spoof_brand = "${config.system.spoofManufacturer}",
        spoof_gpu = "${config.system.spoofGpu}",
        unlock_fps = ${config.system.unlockMaxFps}
    },
    advanced = {
        magnetic_pull = ${config.aiming.magneticPull},
        aim_pull = ${config.aiming.aimPullStrength},
        lock_strength = ${config.aiming.lockStrength},
        stickiness = ${config.aiming.stickiness},
        bullet_velocity = ${config.aiming.bulletVelocity},
        headshot_radius = ${config.aiming.headshotRadius},
        trigger_bot = ${config.aiming.triggerBot},
        touch_sampling = ${config.performance.touchSamplingRate},
        gpu_mode = "${config.performance.gpuRenderingMode}",
        governor = "${config.performance.kernelGovernor}"
    },
    weapons = {
        ${Object.entries(config.weapons).map(([name, stats]) => `["${name}"] = { recoil = ${stats.recoil}, spread = ${stats.spread}, damage = ${stats.damage} }`).join(',\n        ')}
    },
    tactics = {
        drop_shot = ${config.tactics.dropShot},
        jump_shot = ${config.tactics.jumpShot},
        slide_cancel = ${config.tactics.slideCancel},
        quick_scope = ${config.tactics.quickScope},
        auto_lean = ${config.tactics.autoLean},
        fast_reload = ${config.tactics.fastReload}
    }
}
return Config`;
};

export const generateXML = (config: GameConfig): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<GameOptimization version="4.0.0" device="${config.system.deviceName}" engine="${config.gameMode}_2026">
    <AimingSystem>
        <AimAssist strength="${config.aiming.aimAssist}" glue="${config.aiming.glueAssist}" magic="${config.aiming.magicAim}" />
        <Advanced snap="${config.aiming.aimSnap}" track="${config.aiming.autoTrack}" magicBullet="${config.aiming.magicBullet}" headshot="${config.aiming.autoHeadshot}" noFlinch="${config.aiming.noFlinch}" curving="${config.aiming.curvingBullets}" />
        <Recoil value="${config.aiming.recoilCompensation}" spread="${config.aiming.spreadControl}" pattern="${config.aiming.recoilPattern}" />
        <Aggressive hitPriority="${config.aiming.hitPriority}" damageMult="${config.aiming.damageMultiplier}" enemyLock="${config.aiming.enemyLock}" bulletMagnetism="${config.aiming.bulletMagnetism}" />
    </AimingSystem>
    <WeaponProfiles>
        ${Object.entries(config.weapons).map(([name, stats]) => `<Weapon name="${name}" recoil="${stats.recoil}" spread="${stats.spread}" damage="${stats.damage}" />`).join('\n        ')}
    </WeaponProfiles>
    <Tactics dropShot="${config.tactics.dropShot}" jumpShot="${config.tactics.jumpShot}" slideCancel="${config.tactics.slideCancel}" />
    <NetworkOptimization priority="${config.network.packetPriority}">
        <PingFix enabled="${config.network.pingFix}" />
        <Latency opt="${config.network.latencyOptimization}" bypass="${config.network.bypassThrottle}" />
    </NetworkOptimization>
    <Performance cpu="${config.performance.cpuPriority}" gpu="${config.performance.gpuClock}" lagFix="${config.performance.lagFix}" dmgReduct="${config.performance.damageReduction}">
        <Graphics res="${config.graphics.resolution}" fps="${config.graphics.fpsLimit}" shadow="${config.graphics.shadowQuality}" zeroLag="${config.graphics.zeroLagMode}" hdr="${config.graphics.hdrMode}" color="${config.graphics.colorGrade}" lod="${config.graphics.lodDistance}" af="${config.graphics.anisotropicFiltering}" msaa="${config.graphics.msaa}" dynamicRes="${config.graphics.dynamicResolution}" />
        <Advanced magneticPull="${config.aiming.magneticPull}" aimPull="${config.aiming.aimPullStrength}" lockStrength="${config.aiming.lockStrength}" bulletVelocity="${config.aiming.bulletVelocity}" touchSampling="${config.performance.touchSamplingRate}" />
    </Performance>
</GameOptimization>`;
};

export const generateSAV = (config: GameConfig, antigravity?: { scale: number, globalZ: number }): string => {
  const data = {
    ...config,
    antigravity: antigravity || { scale: 1.0, globalZ: -980 }
  };
  const buffer = btoa(JSON.stringify(data));
  return `SAV_ULTRA_V4\nHEADER_OFFSET:0x44\nGRAVITY_PATCH:ENABLED\n${buffer}\nEND_OF_SAVE`;
};

export const generateYAML = (config: GameConfig): string => {
  return `core:
  game_mode: ${config.gameMode}
  presets: [${config.selectedPresets.join(', ')}]
graphics:
  resolution: ${config.graphics.resolution}
  fps_limit: ${config.graphics.fpsLimit}
  zero_lag: ${config.graphics.zeroLagMode}
  hdr_mode: ${config.graphics.hdrMode}
  color_grade: ${config.graphics.colorGrade}
  lod_distance: ${config.graphics.lodDistance}
  anisotropic_filtering: ${config.graphics.anisotropicFiltering}
  msaa: ${config.graphics.msaa}
  dynamic_resolution: ${config.graphics.dynamicResolution}
aiming:
  assist: ${config.aiming.aimAssist}
  magnetic_pull: ${config.aiming.magneticPull}
  aim_pull: ${config.aiming.aimPullStrength}
  lock_strength: ${config.aiming.lockStrength}
  stickiness: ${config.aiming.stickiness}
  bullet_velocity: ${config.aiming.bulletVelocity}
  headshot_radius: ${config.aiming.headshotRadius}
  no_flinch: ${config.aiming.noFlinch}
  curving_bullets: ${config.aiming.curvingBullets}
  bullet_magnetism: ${config.aiming.bulletMagnetism}
  auto_aim: ${config.aiming.autoAim}
performance:
  cpu_priority: ${config.performance.cpuPriority}
  thermal_bypass: ${config.performance.thermalBypass}
  ultra_low_latency: ${config.performance.ultraLowLatency}
  touch_sampling: ${config.performance.touchSamplingRate}
  gpu_mode: ${config.performance.gpuRenderingMode}
  governor: ${config.performance.kernelGovernor}
weapons:
${Object.entries(config.weapons).map(([name, stats]) => `  ${name}: { recoil: ${stats.recoil}, spread: ${stats.spread}, damage: ${stats.damage} }`).join('\n')}
tactics:
  drop_shot: ${config.tactics.dropShot}
  jump_shot: ${config.tactics.jumpShot}
  slide_cancel: ${config.tactics.slideCancel}
  quick_scope: ${config.tactics.quickScope}
  auto_lean: ${config.tactics.autoLean}
  fast_reload: ${config.tactics.fastReload}
`;
};

export const generateINJ = (config: GameConfig): string => {
  return `// ULTRA INJECTION SCRIPT V4
// TARGET: ${config.gameMode}
// DEVICE: ${config.system.deviceName}

#define AIM_ASSIST ${config.aiming.aimAssist}
#define MAGIC_AIM ${config.aiming.magicAim ? 1 : 0}
#define AUTO_HEADSHOT ${config.aiming.autoHeadshot ? 1 : 0}
#define DAMAGE_MULT ${config.aiming.damageMultiplier}
#define ENEMY_LOCK ${config.aiming.enemyLock ? 1 : 0}
#define BULLET_LOCK ${config.aiming.bulletLock ? 1 : 0}
#define MAGNETIC_PULL ${config.aiming.magneticPull}
#define AIM_PULL_STRENGTH ${config.aiming.aimPullStrength}
#define LOCK_STRENGTH ${config.aiming.lockStrength}
#define BULLET_VELOCITY ${config.aiming.bulletVelocity}
#define TOUCH_SAMPLING ${config.performance.touchSamplingRate}
#define ZERO_LAG ${config.graphics.zeroLagMode ? 1 : 0}
#define BYPASS_THROTTLE ${config.network.bypassThrottle ? 1 : 0}
#define NO_FLINCH ${config.aiming.noFlinch ? 1 : 0}
#define CURVING_BULLETS ${config.aiming.curvingBullets ? 1 : 0}
#define AUTO_AIM ${config.aiming.autoAim ? 1 : 0}

void Inject() {
    SetAimProperty(AIM_ASSIST);
    if (MAGIC_AIM) EnableMagicAim();
    if (AUTO_HEADSHOT) EnableAutoHeadshot();
    SetDamageMultiplier(DAMAGE_MULT);
    if (ENEMY_LOCK) LockOnEnemy();
    if (BULLET_LOCK) EnableBulletLock();
    if (NO_FLINCH) DisableFlinch();
    if (CURVING_BULLETS) EnableBulletTracking();
    if (AUTO_AIM) EnableAutoAim();
    
    // Weapon Specific Optimization
    ${Object.entries(config.weapons).map(([name, stats]) => `ApplyWeaponPatch("${name}", ${stats.recoil}, ${stats.spread}, ${stats.damage});`).join('\n    ')}
    
    // Tactical Maneuvers
    if (${config.tactics.dropShot}) EnableDropShot();
    if (${config.tactics.jumpShot}) EnableJumpShot();
    if (${config.tactics.slideCancel}) EnableSlideCancel();
    
    OptimizeNetwork();
    ApplyPerformancePatches();
}
`;
};
