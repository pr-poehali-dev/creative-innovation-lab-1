import { useEffect, useRef, useState, useCallback } from "react";

const CANVAS_W = 600;
const CANVAS_H = 200;
const GROUND_Y = 155;
const GRAVITY = 0.6;
const JUMP_FORCE = -13;
const GAME_SPEED_INIT = 4;

type Sprite = { x: number; y: number; w: number; h: number };

function drawPixelDude(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, isDead: boolean) {
  const skin = "#f5c5a3";
  const hair = "#3b2a1a";
  const shirt = "#22c55e";
  const shorts = "#1e3a5f";
  const shoe = "#333";

  const bob = isDead ? 0 : Math.sin(frame * 0.4) * 2;

  // Тело (рубашка)
  ctx.fillStyle = shirt;
  ctx.fillRect(x + 6, y + 14 + bob, 18, 14);

  // Голова
  ctx.fillStyle = skin;
  ctx.fillRect(x + 7, y + 2 + bob, 16, 12);

  // Волосы
  ctx.fillStyle = hair;
  ctx.fillRect(x + 7, y + 2 + bob, 16, 4);
  ctx.fillRect(x + 7, y + 6 + bob, 3, 3);

  // Глаза
  ctx.fillStyle = isDead ? "#ef4444" : "#1e293b";
  ctx.fillRect(x + 11, y + 7 + bob, 2, 2);
  ctx.fillRect(x + 17, y + 7 + bob, 2, 2);

  if (isDead) {
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(x + 10, y + 11 + bob, 10, 2);
  }

  // Мышцы — руки
  ctx.fillStyle = skin;
  const armSwing = Math.sin(frame * 0.4) * 4;
  ctx.fillRect(x + 2, y + 15 + bob + armSwing, 5, 8);
  ctx.fillRect(x + 23, y + 15 + bob - armSwing, 5, 8);

  // Шорты
  ctx.fillStyle = shorts;
  ctx.fillRect(x + 6, y + 28 + bob, 18, 8);

  // Ноги
  ctx.fillStyle = skin;
  const legSwing = Math.sin(frame * 0.4) * 5;
  ctx.fillRect(x + 7, y + 36 + bob + legSwing, 6, 10);
  ctx.fillRect(x + 17, y + 36 + bob - legSwing, 6, 10);

  // Обувь
  ctx.fillStyle = shoe;
  ctx.fillRect(x + 6, y + 44 + bob + legSwing, 8, 4);
  ctx.fillRect(x + 16, y + 44 + bob - legSwing, 8, 4);
}

function drawProtein(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  const t = Math.sin(frame * 0.08) * 3;
  // Банка
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(x + 4, y + 4 + t, 22, 26);
  // Крышка
  ctx.fillStyle = "#16a34a";
  ctx.fillRect(x + 2, y + 2 + t, 26, 6);
  // Блик
  ctx.fillStyle = "#4ade80";
  ctx.fillRect(x + 7, y + 10 + t, 5, 12);
  // Текст "P"
  ctx.fillStyle = "#fff";
  ctx.font = "bold 12px monospace";
  ctx.fillText("P", x + 12, y + 22 + t);
}

function drawObstacle(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Гантеля
  ctx.fillStyle = "#374151";
  ctx.fillRect(x + 12, y + 8, 6, 22);
  ctx.fillStyle = "#1f2937";
  ctx.fillRect(x + 4, y + 6, 10, 10);
  ctx.fillRect(x + 4, y + 22, 10, 10);
  ctx.fillRect(x + 16, y + 6, 10, 10);
  ctx.fillRect(x + 16, y + 22, 10, 10);
  ctx.fillStyle = "#6b7280";
  ctx.fillRect(x + 5, y + 7, 8, 8);
  ctx.fillRect(x + 17, y + 7, 8, 8);
}

function drawGround(ctx: CanvasRenderingContext2D, offset: number) {
  ctx.fillStyle = "#374151";
  ctx.fillRect(0, GROUND_Y + 45, CANVAS_W, 4);
  ctx.fillStyle = "#4b5563";
  for (let i = 0; i < 20; i++) {
    const tx = ((i * 70 - offset) % (CANVAS_W + 70) + CANVAS_W + 70) % (CANVAS_W + 70) - 70;
    ctx.fillRect(tx, GROUND_Y + 47, 40, 2);
  }
}

function drawBg(ctx: CanvasRenderingContext2D, offset: number) {
  // Тёмный фон
  ctx.fillStyle = "#111827";
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Звёзды
  ctx.fillStyle = "#ffffff22";
  const stars = [10, 60, 120, 200, 280, 350, 430, 510, 570];
  const starsY = [20, 40, 15, 35, 25, 10, 45, 30, 18];
  stars.forEach((sx, i) => {
    const tx = ((sx - offset * 0.1) % CANVAS_W + CANVAS_W) % CANVAS_W;
    ctx.fillRect(tx, starsY[i], 2, 2);
  });

  // Горы на фоне
  ctx.fillStyle = "#1f2937";
  const mts = [0, 80, 160, 260, 360, 460, 540];
  mts.forEach((mx) => {
    const tx = ((mx - offset * 0.3) % (CANVAS_W + 100) + CANVAS_W + 100) % (CANVAS_W + 100) - 100;
    ctx.beginPath();
    ctx.moveTo(tx, GROUND_Y + 45);
    ctx.lineTo(tx + 50, GROUND_Y - 20);
    ctx.lineTo(tx + 100, GROUND_Y + 45);
    ctx.fill();
  });
}

export default function PixelGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    y: GROUND_Y,
    vy: 0,
    onGround: true,
    frame: 0,
    bgOffset: 0,
    speed: GAME_SPEED_INIT,
    score: 0,
    proteins: [] as Sprite[],
    obstacles: [] as Sprite[],
    proteinTimer: 80,
    obstacleTimer: 120,
    isDead: false,
    started: false,
  });
  const animRef = useRef<number>(0);
  const [score, setScore] = useState(0);
  const [isDead, setIsDead] = useState(false);
  const [started, setStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (s.isDead) {
      // Рестарт
      s.y = GROUND_Y;
      s.vy = 0;
      s.onGround = true;
      s.frame = 0;
      s.bgOffset = 0;
      s.speed = GAME_SPEED_INIT;
      s.score = 0;
      s.proteins = [];
      s.obstacles = [];
      s.proteinTimer = 80;
      s.obstacleTimer = 120;
      s.isDead = false;
      s.started = true;
      setScore(0);
      setIsDead(false);
      return;
    }
    if (!s.started) {
      s.started = true;
      setStarted(true);
    }
    if (s.onGround) {
      s.vy = JUMP_FORCE;
      s.onGround = false;
    }
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [jump]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const tick = () => {
      const s = stateRef.current;
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      drawBg(ctx, s.bgOffset);
      drawGround(ctx, s.bgOffset);

      if (s.started && !s.isDead) {
        s.bgOffset += s.speed * 0.7;
        s.frame++;
        s.speed = GAME_SPEED_INIT + s.score * 0.003;

        // Физика прыжка
        s.vy += GRAVITY;
        s.y += s.vy;
        if (s.y >= GROUND_Y) {
          s.y = GROUND_Y;
          s.vy = 0;
          s.onGround = true;
        }

        // Спавн протеина
        s.proteinTimer--;
        if (s.proteinTimer <= 0) {
          s.proteins.push({ x: CANVAS_W, y: GROUND_Y - 10, w: 30, h: 34 });
          s.proteinTimer = 90 + Math.random() * 60;
        }

        // Спавн препятствий
        s.obstacleTimer--;
        if (s.obstacleTimer <= 0) {
          s.obstacles.push({ x: CANVAS_W, y: GROUND_Y + 8, w: 30, h: 37 });
          s.obstacleTimer = 100 + Math.random() * 80;
        }

        // Двигаем объекты
        s.proteins = s.proteins.filter((p) => p.x > -50);
        s.obstacles = s.obstacles.filter((o) => o.x > -50);
        s.proteins.forEach((p) => (p.x -= s.speed));
        s.obstacles.forEach((o) => (o.x -= s.speed));

        // Столкновения с протеином
        const dude = { x: 20, y: s.y, w: 30, h: 48 };
        s.proteins = s.proteins.filter((p) => {
          const hit =
            dude.x + 8 < p.x + p.w &&
            dude.x + dude.w - 8 > p.x + 4 &&
            dude.y + 8 < p.y + p.h &&
            dude.y + dude.h > p.y + 4;
          if (hit) s.score += 10;
          return !hit;
        });

        // Столкновения с препятствиями
        for (const o of s.obstacles) {
          const hit =
            dude.x + 10 < o.x + o.w - 4 &&
            dude.x + dude.w - 10 > o.x + 4 &&
            dude.y + 10 < o.y + o.h &&
            dude.y + dude.h > o.y + 4;
          if (hit) {
            s.isDead = true;
            setIsDead(true);
            setHighScore((prev) => Math.max(prev, s.score));
            break;
          }
        }

        s.score++;
        setScore(Math.floor(s.score / 5));
      }

      // Рисуем объекты
      s.proteins.forEach((p) => drawProtein(ctx, p.x, p.y, s.frame));
      s.obstacles.forEach((o) => drawObstacle(ctx, o.x, o.y));

      drawPixelDude(ctx, 20, s.y, s.frame, s.isDead);

      // Хинт
      if (!s.started) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px monospace";
        ctx.textAlign = "center";
        ctx.fillText("Нажми ПРОБЕЛ или тапни для старта!", CANVAS_W / 2, CANVAS_H / 2 - 10);
        ctx.font = "11px monospace";
        ctx.fillStyle = "#9ca3af";
        ctx.fillText("Собирай протеин 🟢  Прыгай через гантели ⚫", CANVAS_W / 2, CANVAS_H / 2 + 14);
        ctx.textAlign = "left";
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="bg-neutral-950 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h3 className="uppercase text-xs tracking-widest text-neutral-500 mb-2">Мини-игра</h3>
            <p className="text-2xl lg:text-3xl font-bold text-white">Качок за протеином</p>
          </div>
          <div className="flex gap-6 text-sm font-mono">
            <div className="text-neutral-400">
              Счёт: <span className="text-green-400 font-bold text-lg">{score}</span>
            </div>
            <div className="text-neutral-400">
              Рекорд: <span className="text-yellow-400 font-bold text-lg">{highScore > 0 ? Math.floor(highScore / 5) : "—"}</span>
            </div>
          </div>
        </div>

        <div
          className="relative cursor-pointer select-none border border-neutral-800 overflow-hidden"
          onClick={jump}
          style={{ touchAction: "none" }}
          onTouchStart={(e) => { e.preventDefault(); jump(); }}
        >
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            className="w-full"
            style={{ imageRendering: "pixelated", display: "block" }}
          />
          {isDead && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="text-center">
                <p className="text-red-400 font-bold text-xl font-mono mb-1">GAME OVER</p>
                <p className="text-white font-mono text-sm mb-3">Счёт: {score}</p>
                <p className="text-green-400 font-mono text-xs animate-pulse">Нажми для перезапуска</p>
              </div>
            </div>
          )}
        </div>

        <p className="text-neutral-600 text-xs mt-3 font-mono text-center">
          ПРОБЕЛ / ↑ / тап — прыжок
        </p>
      </div>
    </div>
  );
}
