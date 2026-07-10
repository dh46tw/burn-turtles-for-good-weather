// 焚燒引擎：把繪好的紙張影像由下往上燒盡。
// 手法：預算一張「雜訊燃燒順序圖」，燃燒時依門檻把紙一塊塊不規則消除（像真的燒紙），
// 破口前緣發紅餘燼、火焰竄升、灰燼飄散。與框架解耦，僅依賴 DOM。

interface Flame {
  x: number;
  y: number;
  vy: number;
  vx: number;
  life: number; // 1 → 0
  size: number;
}

interface Ash {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

export class FireEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private img: HTMLImageElement;

  private dpr = 1;
  private w = 0;
  private h = 0;
  // 紙張在畫布中的繪製區域
  private px = 0;
  private py = 0;
  private pw = 0;
  private ph = 0;

  private raf = 0;
  private startT = 0;
  private burnMs: number;
  private tailMs = 900;
  private finished = false;
  private onDone: (() => void) | null = null;

  private flames: Flame[] = [];
  private ashes: Ash[] = [];

  // 低解析度的燃燒遮罩
  private mw = 0;
  private mh = 0;
  private order: Float32Array = new Float32Array(0); // 每格燃燒順序 0~1（越小越早燒）
  private maskCanvas!: HTMLCanvasElement;
  private maskCtx!: CanvasRenderingContext2D;
  private maskData!: ImageData;
  private emberCanvas!: HTMLCanvasElement;
  private emberCtx!: CanvasRenderingContext2D;
  private emberData!: ImageData;

  private readonly emberBand = 0.07; // 前緣餘燼寬度（以順序值計）

  constructor(canvas: HTMLCanvasElement, img: HTMLImageElement, opts?: { reducedMotion?: boolean }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.img = img;
    this.burnMs = opts?.reducedMotion ? 1400 : 3800;
    this.setup();
  }

  private setup(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = rect.width;
    this.h = rect.height;
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const imgAspect = this.img.width / this.img.height || 0.75;
    const topPad = this.h * 0.12;
    const availH = this.h - topPad;
    let ph = availH;
    let pw = ph * imgAspect;
    if (pw > this.w * 0.94) {
      pw = this.w * 0.94;
      ph = pw / imgAspect;
    }
    this.pw = pw;
    this.ph = ph;
    this.px = (this.w - pw) / 2;
    this.py = topPad + (availH - ph) / 2;

    this.buildBurnMap();
  }

  // 建立雜訊燃燒順序圖：底部先燒、加雜訊讓邊緣不規則
  private buildBurnMap(): void {
    this.mw = 120;
    this.mh = 160;
    const { mw, mh } = this;
    this.order = new Float32Array(mw * mh);

    // 兩個八度的 value noise
    const noiseAt = this.makeNoise(mw, mh, 9, 12);
    const noiseFine = this.makeNoise(mw, mh, 22, 30);

    let min = Infinity;
    let max = -Infinity;
    for (let y = 0; y < mh; y++) {
      const yy = y / (mh - 1); // 0 上 → 1 下
      for (let x = 0; x < mw; x++) {
        const i = y * mw + x;
        const n = (noiseAt[i] + noiseFine[i] * 0.5) / 1.5;
        // (1 - yy) 讓底部順序值最小（最早燒）
        const o = (1 - yy) * 0.72 + n * 0.55;
        this.order[i] = o;
        if (o < min) min = o;
        if (o > max) max = o;
      }
    }
    // 正規化到 0~1
    const span = max - min || 1;
    for (let i = 0; i < this.order.length; i++) {
      this.order[i] = (this.order[i] - min) / span;
    }

    this.maskCanvas = document.createElement('canvas');
    this.maskCanvas.width = mw;
    this.maskCanvas.height = mh;
    this.maskCtx = this.maskCanvas.getContext('2d')!;
    this.maskData = this.maskCtx.createImageData(mw, mh);

    this.emberCanvas = document.createElement('canvas');
    this.emberCanvas.width = mw;
    this.emberCanvas.height = mh;
    this.emberCtx = this.emberCanvas.getContext('2d')!;
    this.emberData = this.emberCtx.createImageData(mw, mh);
  }

  // 產生 value noise（隨機格點 + 雙線性內插），回傳 0~1
  private makeNoise(mw: number, mh: number, gw: number, gh: number): Float32Array {
    const grid = new Float32Array((gw + 1) * (gh + 1));
    for (let i = 0; i < grid.length; i++) grid[i] = Math.random();
    const out = new Float32Array(mw * mh);
    for (let y = 0; y < mh; y++) {
      const gy = (y / (mh - 1)) * gh;
      const y0 = Math.floor(gy);
      const fy = gy - y0;
      for (let x = 0; x < mw; x++) {
        const gx = (x / (mw - 1)) * gw;
        const x0 = Math.floor(gx);
        const fx = gx - x0;
        const a = grid[y0 * (gw + 1) + x0];
        const b = grid[y0 * (gw + 1) + x0 + 1];
        const c = grid[(y0 + 1) * (gw + 1) + x0];
        const d = grid[(y0 + 1) * (gw + 1) + x0 + 1];
        const top = a + (b - a) * fx;
        const bot = c + (d - c) * fx;
        out[y * mw + x] = top + (bot - top) * fy;
      }
    }
    return out;
  }

  start(onDone: () => void): void {
    this.onDone = onDone;
    this.startT = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  stop(): void {
    cancelAnimationFrame(this.raf);
  }

  private frame = (now: number): void => {
    const elapsed = now - this.startT;
    const p = Math.min(1, elapsed / this.burnMs);
    const g = this.ctx;
    const { mw, mh } = this;

    g.clearRect(0, 0, this.w, this.h);

    // 門檻略為超衝，確保 p=1 時完全燒盡
    const T = p * (1 + this.emberBand);

    // 依燃燒順序填遮罩（已燒→擦除）與餘燼（前緣→發紅）
    const mask = this.maskData.data;
    const ember = this.emberData.data;
    const emberPts: number[] = [];
    for (let i = 0; i < this.order.length; i++) {
      const o = this.order[i];
      const j = i * 4;
      if (o < T) {
        mask[j + 3] = 255; // 已燒：全擦除
      } else {
        mask[j + 3] = 0;
      }
      // 前緣餘燼帶
      if (o >= T && o < T + this.emberBand) {
        const t = 1 - (o - T) / this.emberBand; // 越靠門檻越亮
        ember[j] = 255;
        ember[j + 1] = 150 + Math.round(80 * t);
        ember[j + 2] = 40;
        ember[j + 3] = Math.round(200 * t);
        if (Math.random() < 0.02) emberPts.push(i);
      } else {
        ember[j + 3] = 0;
      }
    }
    this.maskCtx.putImageData(this.maskData, 0, 0);
    this.emberCtx.putImageData(this.emberData, 0, 0);

    // 1) 畫出紙張
    g.drawImage(this.img, this.px, this.py, this.pw, this.ph);

    // 2) 用遮罩擦除已燒區（平滑縮放讓破口邊緣柔和不規則）
    // 擦除範圍四邊外擴 M，把遮罩放大時邊緣內插造成的淡邊推到紙張外，避免殘留細線
    const M = 6;
    g.save();
    g.globalCompositeOperation = 'destination-out';
    g.imageSmoothingEnabled = true;
    g.drawImage(this.maskCanvas, this.px - M, this.py - M, this.pw + M * 2, this.ph + M * 2);
    g.restore();

    // 3) 前緣餘燼（加色）
    if (p < 1) {
      g.save();
      g.globalCompositeOperation = 'lighter';
      g.imageSmoothingEnabled = true;
      g.drawImage(this.emberCanvas, this.px, this.py, this.pw, this.ph);
      g.restore();

      // 4) 由真實前緣冒出火焰與灰燼
      const sx = this.pw / mw;
      const sy = this.ph / mh;
      for (let k = 0; k < emberPts.length; k++) {
        const i = emberPts[k];
        const cx = this.px + (i % mw) * sx;
        const cy = this.py + Math.floor(i / mw) * sy;
        if (Math.random() < 0.5) {
          this.flames.push({
            x: cx,
            y: cy,
            vy: -(0.6 + Math.random() * 1.6),
            vx: (Math.random() - 0.5) * 0.6,
            life: 0.6 + Math.random() * 0.4,
            size: this.ph * (0.02 + Math.random() * 0.03),
          });
        } else {
          this.ashes.push({
            x: cx,
            y: cy,
            vx: (Math.random() - 0.5) * 0.6,
            vy: -(0.3 + Math.random() * 0.7),
            life: 1,
            size: this.ph * (0.006 + Math.random() * 0.01),
          });
        }
      }
    }

    // 5) 火焰粒子（加色混合）
    g.save();
    g.globalCompositeOperation = 'lighter';
    for (let i = this.flames.length - 1; i >= 0; i--) {
      const f = this.flames[i];
      f.x += f.vx;
      f.y += f.vy;
      f.vy *= 0.98;
      f.life -= 0.03;
      if (f.life <= 0) {
        this.flames.splice(i, 1);
        continue;
      }
      const r = f.size * (0.6 + f.life);
      const grd = g.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
      const a = f.life;
      grd.addColorStop(0, `rgba(255,240,180,${a})`);
      grd.addColorStop(0.4, `rgba(255,160,50,${a * 0.8})`);
      grd.addColorStop(1, 'rgba(226,84,47,0)');
      g.fillStyle = grd;
      g.beginPath();
      g.arc(f.x, f.y, r, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();

    // 6) 灰燼（深色飄散）
    for (let i = this.ashes.length - 1; i >= 0; i--) {
      const s = this.ashes[i];
      s.x += s.vx + Math.sin(s.y * 0.05) * 0.3;
      s.y += s.vy;
      s.vy *= 0.995;
      s.life -= 0.006;
      if (s.life <= 0 || s.y < -10) {
        this.ashes.splice(i, 1);
        continue;
      }
      g.fillStyle = `rgba(60,45,35,${Math.min(0.8, s.life)})`;
      g.beginPath();
      g.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      g.fill();
    }

    // 7) 結束判定
    if (p >= 1 && elapsed > this.burnMs + this.tailMs) {
      if (!this.finished) {
        this.finished = true;
        g.clearRect(0, 0, this.w, this.h);
        this.onDone?.();
      }
      return;
    }
    this.raf = requestAnimationFrame(this.frame);
  };
}
