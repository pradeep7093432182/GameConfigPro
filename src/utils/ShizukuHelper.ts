/**
 * ShizukuHelper Singleton
 * Handles communication with Shizuku shell for system-level optimizations.
 */
class ShizukuHelper {
  private static instance: ShizukuHelper;
  private isAuthorized: boolean = false;
  private _logs: string[] = [];
  private onLogListeners: ((log: string) => void)[] = [];

  private constructor() {
    this.checkPermission();
  }

  public static getInstance(): ShizukuHelper {
    if (!ShizukuHelper.instance) {
      ShizukuHelper.instance = new ShizukuHelper();
    }
    return ShizukuHelper.instance;
  }

  private addLog(msg: string) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${msg}`;
    this._logs.push(logEntry);
    this.onLogListeners.forEach(listener => listener(logEntry));
    console.log(logEntry);
  }

  public onLog(listener: (log: string) => void) {
    this.onLogListeners.push(listener);
  }

  public async checkPermission(): Promise<boolean> {
    this.addLog("Checking Shizuku permission...");
    // In a real Android environment with a bridge, this would call native code.
    // For the web version, we simulate the check or interface with a known bridge.
    if ((window as any).android?.isShizukuAvailable()) {
      this.isAuthorized = (window as any).android.isShizukuAuthorized();
      this.addLog(this.isAuthorized ? "Shizuku Authorized." : "Shizuku Service detected but not authorized.");
      return this.isAuthorized;
    }
    
    // Fallback simulation for development/PWA
    this.addLog("Shizuku Native Bridge not detected. Using Virtual Bridge mode.");
    return true; 
  }

  public async execCommand(command: string): Promise<{ success: boolean; output: string }> {
    this.addLog(`EXEC: ${command}`);
    
    if ((window as any).android?.execShell) {
      try {
        const result = await (window as any).android.execShell(command);
        this.addLog(`SUCCESS: ${command}`);
        return { success: true, output: result };
      } catch (e: any) {
        this.addLog(`ERROR: ${e.message}`);
        return { success: false, output: e.message };
      }
    }

    // Simulation
    await new Promise(resolve => setTimeout(resolve, 500));
    this.addLog(`SIMULATED SUCCESS: ${command}`);
    return { success: true, output: "Command executed successfully (Simulated)" };
  }

  public async writeFile(path: string, content: string): Promise<boolean> {
    this.addLog(`WRITING FILE: ${path}`);
    const escapedContent = content.replace(/'/g, "'\\''");
    const cmd = `echo '${escapedContent}' > "${path}"`;
    const result = await this.execCommand(cmd);
    return result.success;
  }

  public async applyOptimizations(opts: { touchSensitivity: boolean; gpuForce: boolean; animationScale: number }) {
    if (opts.touchSensitivity) {
      await this.execCommand("settings put system high_touch_sensitivity_enabled 1");
    }
    if (opts.gpuForce) {
      await this.execCommand("settings put global force_gpu_rendering 1");
    }
    await this.execCommand(`settings put global window_animation_scale ${opts.animationScale}`);
    await this.execCommand(`settings put global transition_animation_scale ${opts.animationScale}`);
    await this.execCommand(`settings put global animator_duration_scale ${opts.animationScale}`);
  }

  public async getHardwareStats(): Promise<any> {
    // In real app, call dumpsys
    // const fps = await this.execCommand("dumpsys gfxinfo | grep -A 12 'Total frames rendered'");
    const temp = await this.execCommand("cat /sys/class/thermal/thermal_zone0/temp");
    const model = await this.execCommand("getprop ro.product.model");
    
    return {
      temp: parseInt(temp.output) / 1000 || 38,
      model: model.output.trim() || "Unknown Device"
    };
  }
}

export default ShizukuHelper.getInstance();
