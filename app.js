(() => {
  const cfg = window.INVITE_CONFIG;
  if (!cfg) return;

  const STORAGE_KEY = "grad_invite_wishes_v1";
  const HI_KEY = "grad_survival_hi_v1";
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const intro = $("#intro");
  const env = $("#env");
  const peel = $("#peel");
  const tearArea = $("#tearArea");
  const soundBtn = $("#soundBtn");
  const bgm = $("#bgm");
  const fxCanvas = $("#fx");

  let audioCtx = null;
  let synthTimer = null;
  let isMusicOn = false;

  /* =========================================================
     1. HYDRATE CONTENT & ?to= PERSONALIZATION
     ========================================================= */
  const params = new URLSearchParams(window.location.search);
  const rawTo = (params.get("to") || "").trim().slice(0, 60);

  const toEnvelope = rawTo || cfg.defaults.toEnvelope;
  const toCard = rawTo || cfg.defaults.toCard;
  const toRsvp = rawTo || cfg.defaults.toRsvp;
  const toClosing = rawTo || cfg.defaults.toClosing;

  $$(".to-name").forEach((el) => {
    if (el.closest(".addr")) el.textContent = toEnvelope;
    else if (el.closest(".ket")) el.textContent = toClosing;
    else el.textContent = toRsvp;
  });

  $$(".to-guest").forEach((el) => {
    el.textContent = toCard;
  });

  document.title = `Thiệp Mời Tốt Nghiệp · ${cfg.graduate.shortName}`;

  if (cfg.media.meadowBg) {
    document.documentElement.style.setProperty(
      "--meadow-url",
      `url("${cfg.media.meadowBg}")`
    );
  }

  $("#hudAvatar").src = cfg.media.avatar;
  $("#hudTag").textContent = cfg.graduate.tag;
  $("#hudLv").textContent = cfg.graduate.level;
  $("#hudXp").textContent = cfg.graduate.xpText;
  $("#introMascot").src = cfg.media.mascotsTrio;

  $("#letterYear").textContent = cfg.graduate.year;
  $("#letterPhoto").src = cfg.media.letterPortrait;
  $("#letterName").textContent = cfg.graduate.fullName;
  $("#letterSub").textContent = cfg.graduate.school;
  $("#postmarkDate").textContent = cfg.graduate.postmarkDate;
  $("#postmarkYear").textContent = cfg.graduate.year;
  $("#stampYear").textContent = cfg.graduate.year;

  $("#cardName").textContent = cfg.graduate.fullName;
  $("#cardRole").textContent = cfg.graduate.role;
  $("#cardTime").textContent = cfg.event.timeLabel;
  $("#cardMonth").textContent = cfg.event.monthLabel;
  $("#cardDay").textContent = cfg.event.dayLabel;
  $("#cardYear").textContent = cfg.event.yearLabel;
  $("#cardPlace").textContent = cfg.event.placeName;
  $("#cardPlaceSub").textContent = cfg.event.placeSub;
  $("#cardAddr").textContent = cfg.event.address;
  $("#dirLink").href = cfg.event.mapsUrl;

  $("#tallBgImg").src = cfg.media.tallBg;
  $("#tallPortraitImg").src = cfg.media.tallPortrait;
  $("#archBgImg").src = cfg.media.archBg;
  $("#archPortraitImg").src = cfg.media.archPortrait;

  const thanksBody = $("#thanksBody");
  cfg.thanksParagraphs.forEach((p) => {
    const el = document.createElement("p");
    el.textContent = p;
    thanksBody.appendChild(el);
  });
  $("#thanksSign").textContent = `— ${cfg.graduate.firstName} —`;

  $("#closingImg").src = cfg.media.closingPortrait;
  $("#closingMascot").src = cfg.media.mascotsTrio;
  $("#closingQuote").textContent = cfg.closingQuote;
  $("#closingMeta").textContent = `${cfg.graduate.shortName.toUpperCase()} · ${cfg.graduate.postmarkDate}.${cfg.graduate.year} · ${cfg.event.timeLabel.split("·")[0].trim()}`;

  /* =========================================================
     SHARED AXIE CHIBI CHARACTER DRAW HELPER (for Game + Cutscenes)
     ========================================================= */
  function drawAxieHero(ctx, x, y, w, h, opts = {}) {
    const { duck = false, blink = false, phase = 0, dead = false, joy = false } = opts;
    ctx.save();
    ctx.translate(x, y);

    const outline = "#381d0e";
    const bodyColor = "#fff3d6";
    const cheekColor = "#ff8fa3";
    const stoleColor = "#236b38";
    const capColor = "#24292e";

    // Shadow on ground if near
    if (opts.shadowScale) {
      ctx.fillStyle = "rgba(32, 74, 38, 0.25)";
      ctx.beginPath();
      ctx.ellipse(w / 2, h + 3, (w * 0.45) * opts.shadowScale, 4 * opts.shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    const bob = duck ? 0 : Math.sin(phase * 0.35) * 2;
    const drawH = duck ? h * 0.68 : h;
    const drawY = duck ? h - drawH : bob;

    // Little feet
    ctx.fillStyle = "#f4b96a";
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2.4;
    const footOff = duck ? 0 : Math.sin(phase * 0.45) * 4;
    ctx.beginPath();
    ctx.ellipse(w * 0.33 + footOff, h - 2, 5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(w * 0.67 - footOff, h - 2, 5, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Plump Axie body
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(w / 2, drawY + drawH * 0.56, w * 0.46, drawH * 0.43, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Cute ears / puffs
    ctx.fillStyle = "#bfe8c9";
    ctx.beginPath();
    ctx.ellipse(w * 0.2, drawY + drawH * 0.26, 6, 7, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(w * 0.8, drawY + drawH * 0.26, 6, 7, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Green graduation stole / ribbon on chest
    ctx.fillStyle = stoleColor;
    ctx.beginPath();
    ctx.roundRect(w * 0.34, drawY + drawH * 0.68, w * 0.32, drawH * 0.22, 4);
    ctx.fill();
    ctx.stroke();

    // Eyes & expression
    ctx.fillStyle = outline;
    if (dead) {
      ctx.lineWidth = 2.2;
      // X eyes
      [w * 0.36, w * 0.64].forEach((ex) => {
        const ey = drawY + drawH * 0.46;
        ctx.beginPath();
        ctx.moveTo(ex - 3, ey - 3);
        ctx.lineTo(ex + 3, ey + 3);
        ctx.moveTo(ex + 3, ey - 3);
        ctx.lineTo(ex - 3, ey + 3);
        ctx.stroke();
      });
    } else if (joy) {
      ctx.lineWidth = 2.2;
      [w * 0.36, w * 0.64].forEach((ex) => {
        const ey = drawY + drawH * 0.46;
        ctx.beginPath();
        ctx.arc(ex, ey + 1, 3.2, Math.PI, 0);
        ctx.stroke();
      });
    } else if (blink) {
      ctx.lineWidth = 2;
      [w * 0.36, w * 0.64].forEach((ex) => {
        const ey = drawY + drawH * 0.46;
        ctx.beginPath();
        ctx.moveTo(ex - 3, ey);
        ctx.lineTo(ex + 3, ey);
        ctx.stroke();
      });
    } else {
      [w * 0.36, w * 0.64].forEach((ex) => {
        const ey = drawY + drawH * 0.45;
        ctx.beginPath();
        ctx.arc(ex, ey, 3.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(ex + 1, ey - 1, 1.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = outline;
      });
    }

    // Rosy cheeks
    ctx.fillStyle = cheekColor;
    ctx.beginPath();
    ctx.ellipse(w * 0.24, drawY + drawH * 0.54, 4, 2.5, 0, 0, Math.PI * 2);
    ctx.ellipse(w * 0.76, drawY + drawH * 0.54, 4, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w * 0.5, drawY + drawH * 0.53, 3.5, 0.15, Math.PI - 0.15);
    ctx.stroke();

    // Mortarboard graduation cap
    const capY = drawY + 2;
    ctx.fillStyle = capColor;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(w * 0.28, capY + 2, w * 0.44, 7, 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(w * 0.5, capY - 6);
    ctx.lineTo(w * 0.86, capY + 2);
    ctx.lineTo(w * 0.5, capY + 9);
    ctx.lineTo(w * 0.14, capY + 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Gold tassel
    ctx.strokeStyle = "#f6b828";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(w * 0.78, capY + 2);
    ctx.lineTo(w * 0.82 + Math.sin(phase * 0.25) * 2, capY + 13);
    ctx.stroke();

    ctx.restore();
  }

  /* =========================================================
     2. PLAYABLE AXIE SURVIVAL MINI-GAME (#gameCanvas)
     ========================================================= */
  const gCanvas = $("#gameCanvas");
  const gCtx = gCanvas.getContext("2d");
  const gStartScreen = $("#gStartScreen");
  const gOverScreen = $("#gOverScreen");
  const gWinScreen = $("#gWinScreen");
  const gStageBadge = $("#gStageBadge");
  const gXpFill = $("#gXpFill");
  const gXpText = $("#gXpText");
  const gScoreEl = $("#gScore");
  const gHiEl = $("#gHi");
  const btnDuck = $("#btnDuck");
  const btnJump = $("#btnJump");
  const btnSfx = $("#btnSfx");
  const btnPause = $("#btnPause");

  let sfxOn = true;
  let hiScore = Number(localStorage.getItem(HI_KEY) || "0");
  gHiEl.textContent = String(hiScore).padStart(3, "0");

  function playSfx(type) {
    if (!sfxOn) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const now = audioCtx.currentTime;

    const tone = (freq, endFreq, dur, wave = "triangle", vol = 0.08, delay = 0) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, now + delay);
      if (endFreq !== freq) {
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + delay + dur);
      }
      gain.gain.setValueAtTime(vol, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + dur + 0.02);
    };

    if (type === "jump") tone(330, 590, 0.13, "triangle", 0.09);
    else if (type === "coin") {
      tone(660, 660, 0.07, "sine", 0.08, 0);
      tone(990, 990, 0.12, "sine", 0.08, 0.06);
    } else if (type === "level") {
      [523, 659, 784, 1046].forEach((f, i) => tone(f, f, 0.12, "triangle", 0.08, i * 0.07));
    } else if (type === "bonk") {
      tone(240, 95, 0.25, "sawtooth", 0.09);
    } else if (type === "win") {
      [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, f, 0.18, "triangle", 0.1, i * 0.09));
    }
  }

  btnSfx.addEventListener("click", () => {
    sfxOn = !sfxOn;
    btnSfx.setAttribute("aria-pressed", sfxOn ? "true" : "false");
  });

  const GAME_W = 420;
  const GAME_H = 236;
  const GROUND_Y = 192;

  const game = {
    state: "idle", // idle | playing | paused | over | win
    progress: 0, // 0..100
    score: 0,
    stageIdx: 0,
    tick: 0,
    spawnTimer: 50,
    bannerTimer: 0,
    bannerTitle: "",
    bannerSub: "",
    hero: { x: 48, y: GROUND_Y - 40, w: 38, h: 40, vy: 0, grounded: true, duck: false, holdJump: false },
    obstacles: [],
    pickups: [],
    popups: [],
    clouds: [
      { x: 40, y: 34, s: 1 },
      { x: 185, y: 24, s: 0.8 },
      { x: 330, y: 46, s: 1.1 },
    ],
  };

  function getStage(prog) {
    let idx = 0;
    cfg.gameStages.forEach((st, i) => {
      if (prog >= st.minScore) idx = i;
    });
    return idx;
  }

  function resetGame() {
    game.state = "playing";
    game.progress = 0;
    game.score = 0;
    game.stageIdx = 0;
    game.tick = 0;
    game.spawnTimer = 42;
    game.obstacles = [];
    game.pickups = [];
    game.popups = [];
    game.hero = { x: 48, y: GROUND_Y - 40, w: 38, h: 40, vy: 0, grounded: true, duck: false, holdJump: false };

    const st0 = cfg.gameStages[0];
    game.bannerTitle = st0.bannerTitle;
    game.bannerSub = st0.bannerSub;
    game.bannerTimer = 115;

    gStartScreen.hidden = true;
    gOverScreen.hidden = true;
    gWinScreen.hidden = true;
    btnPause.textContent = "II";
    updateGameHud();
  }

  function updateGameHud() {
    const st = cfg.gameStages[game.stageIdx];
    gStageBadge.textContent = st.badge;
    const pct = Math.min(100, Math.floor(game.progress));
    gXpFill.style.width = `${pct}%`;
    gXpText.textContent = `${pct}%`;
    gScoreEl.textContent = String(game.score).padStart(3, "0");
    gHiEl.textContent = String(hiScore).padStart(3, "0");
  }

  function jumpStart() {
    if (game.state === "idle" || game.state === "over" || game.state === "win") {
      resetGame();
      return;
    }
    if (game.state !== "playing") return;
    game.hero.holdJump = true;
    if (game.hero.grounded) {
      game.hero.vy = -8.8;
      game.hero.grounded = false;
      game.hero.duck = false;
      playSfx("jump");
    }
  }

  function jumpEnd() {
    game.hero.holdJump = false;
    if (game.hero.vy < -3.6) game.hero.vy = -3.6;
  }

  function duckSet(on) {
    if (game.state !== "playing") return;
    game.hero.duck = on;
    if (on && !game.hero.grounded) game.hero.vy += 2.6;
  }

  function spawnObstacle() {
    const st = cfg.gameStages[game.stageIdx];
    const tpl = st.obstacles[Math.floor(Math.random() * st.obstacles.length)];
    const isAir = tpl.kind === "air";
    const w = Math.max(54, tpl.label.length * 6.5 + 16);
    const h = 30;
    // Air obstacles fly at head height so ducking clears them cleanly!
    const y = isAir ? GROUND_Y - 56 : GROUND_Y - h;

    game.obstacles.push({
      x: GAME_W + 20,
      y,
      w,
      h,
      label: tpl.label,
      icon: tpl.icon,
      color: tpl.color,
      fail: tpl.fail,
      isAir,
      passed: false,
    });

    // Occasionally spawn a collectible coffee/tea mana orb
    if (Math.random() < 0.48) {
      const items = [
        { icon: "☕", text: "+5 ĐRL", pts: 5 },
        { icon: "🍵", text: "+5 ĐRL", pts: 5 },
        { icon: "⚡", text: "+8 ĐRL", pts: 8 },
      ];
      const pick = items[Math.floor(Math.random() * items.length)];
      game.pickups.push({
        x: GAME_W + 100 + Math.random() * 45,
        y: isAir ? GROUND_Y - 26 : GROUND_Y - 76,
        r: 13,
        ...pick,
      });
    }
  }

  function triggerGameOver(obs) {
    game.state = "over";
    playSfx("bonk");
    const isNew = game.score > hiScore;
    if (isNew) {
      hiScore = game.score;
      localStorage.setItem(HI_KEY, String(hiScore));
    }
    updateGameHud();

    $("#goNewRec").hidden = !isNew || game.score === 0;
    $("#goMsg").textContent = obs.fail;
    $("#goDrl").textContent = String(game.score);
    $("#goHi").textContent = String(hiScore);
    $("#goLvl").textContent = cfg.gameStages[game.stageIdx].badge;
    gOverScreen.hidden = false;
  }

  function triggerWin() {
    game.state = "win";
    game.progress = 100;
    game.score += 25;
    if (game.score > hiScore) {
      hiScore = game.score;
      localStorage.setItem(HI_KEY, String(hiScore));
    }
    updateGameHud();
    playSfx("win");
    launchConfetti(110);
    $("#winDrl").textContent = String(game.score);
    gWinScreen.hidden = false;
  }

  function stepGame() {
    if (game.state === "playing") {
      game.tick++;
      // ~38 seconds at 60fps to reach 100%
      game.progress = Math.min(100, game.progress + 0.044);

      const nextStage = getStage(game.progress);
      if (nextStage !== game.stageIdx) {
        game.stageIdx = nextStage;
        const st = cfg.gameStages[nextStage];
        game.bannerTitle = st.bannerTitle;
        game.bannerSub = st.bannerSub;
        game.bannerTimer = 120;
        game.score += 10;
        playSfx("level");
      }

      if (game.progress >= 100) {
        triggerWin();
        return;
      }

      const st = cfg.gameStages[game.stageIdx];
      const spd = st.speed;

      // Hero gravity & jump hold
      const grav = game.hero.holdJump && game.hero.vy < 0 ? 0.36 : 0.62;
      game.hero.vy += grav;
      game.hero.y += game.hero.vy;
      const groundTop = GROUND_Y - game.hero.h;
      if (game.hero.y >= groundTop) {
        game.hero.y = groundTop;
        game.hero.vy = 0;
        game.hero.grounded = true;
      }

      // Clouds
      game.clouds.forEach((c) => {
        c.x -= spd * 0.16 * c.s;
        if (c.x < -70) c.x = GAME_W + 40;
      });

      // Spawn obstacles
      game.spawnTimer--;
      if (game.spawnTimer <= 0) {
        spawnObstacle();
        game.spawnTimer = Math.max(54, 92 - game.stageIdx * 9 + Math.floor(Math.random() * 28));
      }

      // Hero hitbox (forgiving)
      const hDuckOff = game.hero.duck ? 15 : 0;
      const hx = game.hero.x + 8;
      const hy = game.hero.y + 6 + hDuckOff;
      const hw = game.hero.w - 16;
      const hh = game.hero.h - 10 - hDuckOff;

      // Update obstacles
      for (let i = game.obstacles.length - 1; i >= 0; i--) {
        const o = game.obstacles[i];
        o.x -= spd;

        if (!o.passed && o.x + o.w < game.hero.x) {
          o.passed = true;
          game.score += 2;
          game.popups.push({ x: game.hero.x + 18, y: game.hero.y - 6, text: "+2", alpha: 1 });
        }

        // Collision
        if (hx < o.x + o.w - 4 && hx + hw > o.x + 4 && hy < o.y + o.h - 4 && hy + hh > o.y + 4) {
          triggerGameOver(o);
          return;
        }

        if (o.x + o.w < -20) game.obstacles.splice(i, 1);
      }

      // Pickups
      for (let i = game.pickups.length - 1; i >= 0; i--) {
        const p = game.pickups[i];
        p.x -= spd;
        const dx = hx + hw / 2 - p.x;
        const dy = hy + hh / 2 - p.y;
        if (Math.hypot(dx, dy) < p.r + 16) {
          game.score += p.pts;
          game.popups.push({ x: p.x, y: p.y - 8, text: p.text, alpha: 1 });
          playSfx("coin");
          game.pickups.splice(i, 1);
          continue;
        }
        if (p.x < -30) game.pickups.splice(i, 1);
      }

      // Floating popups
      for (let i = game.popups.length - 1; i >= 0; i--) {
        const pop = game.popups[i];
        pop.y -= 0.7;
        pop.alpha -= 0.025;
        if (pop.alpha <= 0) game.popups.splice(i, 1);
      }

      if (game.bannerTimer > 0) game.bannerTimer--;
      if (game.tick % 4 === 0) updateGameHud();
    } else if (game.state === "idle") {
      game.tick++;
    }
  }

  function drawGame() {
    const st = cfg.gameStages[game.stageIdx];
    const ctx = gCtx;

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    sky.addColorStop(0, st.skyTop);
    sky.addColorStop(1, st.skyBot);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, GAME_W, GAME_H);

    // Clouds
    ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
    game.clouds.forEach((c) => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 14 * c.s, 0, Math.PI * 2);
      ctx.arc(c.x + 14 * c.s, c.y - 4 * c.s, 17 * c.s, 0, Math.PI * 2);
      ctx.arc(c.x + 28 * c.s, c.y, 13 * c.s, 0, Math.PI * 2);
      ctx.fill();
    });

    // Parallax rolling hills
    const hillShift = (game.tick * st.speed * 0.25) % 210;
    ctx.fillStyle = st.hillColor;
    for (let x = -210; x < GAME_W + 210; x += 210) {
      ctx.beginPath();
      ctx.arc(x - hillShift + 105, GROUND_Y + 12, 115, Math.PI, 0);
      ctx.fill();
    }

    // Wooden fence posts in background
    const fenceShift = (game.tick * st.speed * 0.5) % 44;
    ctx.fillStyle = "#b4693b";
    ctx.strokeStyle = "#381d0e";
    ctx.lineWidth = 1.6;
    ctx.fillRect(0, GROUND_Y - 20, GAME_W, 5);
    for (let fx = -44; fx < GAME_W + 44; fx += 44) {
      ctx.fillRect(fx - fenceShift, GROUND_Y - 28, 7, 28);
      ctx.strokeRect(fx - fenceShift, GROUND_Y - 28, 7, 28);
    }

    // Grass strip & dirt road
    ctx.fillStyle = st.groundColor;
    ctx.fillRect(0, GROUND_Y, GAME_W, GAME_H - GROUND_Y);
    ctx.fillStyle = st.grassColor;
    ctx.fillRect(0, GROUND_Y, GAME_W, 11);
    ctx.strokeStyle = "#381d0e";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(GAME_W, GROUND_Y);
    ctx.stroke();

    // Pickups
    game.pickups.forEach((p) => {
      const bob = Math.sin(game.tick * 0.12 + p.x * 0.05) * 3;
      ctx.fillStyle = "#fff6dc";
      ctx.strokeStyle = "#381d0e";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y + bob, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.font = "14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.icon, p.x, p.y + bob + 1);
    });

    // Obstacles (Course Bosses)
    game.obstacles.forEach((o) => {
      const oy = o.isAir ? o.y + Math.sin(game.tick * 0.15 + o.x * 0.05) * 3 : o.y;
      ctx.fillStyle = o.color;
      ctx.strokeStyle = "#381d0e";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(o.x, oy, o.w, o.h, 9);
      ctx.fill();
      ctx.stroke();

      // Inner highlight
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.fillRect(o.x + 4, oy + 3, o.w - 8, 5);

      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px 'Baloo 2', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${o.icon} ${o.label}`, o.x + o.w / 2, oy + o.h / 2 + 1);
    });

    // Hero
    const groundDist = Math.max(0.35, 1 - (GROUND_Y - game.hero.h - game.hero.y) / 90);
    drawAxieHero(ctx, game.hero.x, game.hero.y, game.hero.w, game.hero.h, {
      duck: game.hero.duck,
      phase: game.tick,
      dead: game.state === "over",
      joy: game.state === "win",
      shadowScale: game.hero.grounded ? 1 : groundDist,
    });

    // Popups
    game.popups.forEach((pop) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, pop.alpha);
      ctx.font = "800 13px 'Baloo 2', sans-serif";
      ctx.strokeStyle = "#381d0e";
      ctx.lineWidth = 3;
      ctx.textAlign = "center";
      ctx.strokeText(pop.text, pop.x, pop.y);
      ctx.fillStyle = "#ffd45e";
      ctx.fillText(pop.text, pop.x, pop.y);
      ctx.restore();
    });

    // Stage Banner inside canvas
    if (game.bannerTimer > 0) {
      const alpha = Math.min(1, game.bannerTimer / 20);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "rgba(56, 29, 14, 0.85)";
      ctx.strokeStyle = "#f6b828";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(44, 18, GAME_W - 88, 46, 12);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = "center";
      ctx.fillStyle = "#f6b828";
      ctx.font = "800 15px 'Baloo 2', sans-serif";
      ctx.fillText(game.bannerTitle, GAME_W / 2, 35);
      ctx.fillStyle = "#fff6dc";
      ctx.font = "600 11px 'Be Vietnam Pro', sans-serif";
      ctx.fillText(game.bannerSub, GAME_W / 2, 53);
      ctx.restore();
    }
  }

  function gameLoop() {
    stepGame();
    drawGame();
    requestAnimationFrame(gameLoop);
  }
  requestAnimationFrame(gameLoop);

  // Game button bindings
  $("#btnStartGame").addEventListener("click", resetGame);
  $("#btnRetry").addEventListener("click", resetGame);
  $("#btnPlayAgain").addEventListener("click", resetGame);

  btnPause.addEventListener("click", () => {
    if (game.state === "playing") {
      game.state = "paused";
      btnPause.textContent = "▶";
    } else if (game.state === "paused") {
      game.state = "playing";
      btnPause.textContent = "II";
    }
  });

  btnJump.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    btnJump.classList.add("pressed");
    jumpStart();
  });
  window.addEventListener("pointerup", () => {
    btnJump.classList.remove("pressed");
    btnDuck.classList.remove("pressed");
    jumpEnd();
    duckSet(false);
  });

  btnDuck.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    btnDuck.classList.add("pressed");
    duckSet(true);
  });

  window.addEventListener("keydown", (e) => {
    const activeTag = document.activeElement && document.activeElement.tagName;
    if (activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT") return;
    if (game.state !== "playing" && game.state !== "paused") return;

    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
      e.preventDefault();
      if (!e.repeat) jumpStart();
    } else if (e.code === "ArrowDown" || e.code === "KeyS") {
      e.preventDefault();
      duckSet(true);
    } else if (e.code === "KeyP") {
      btnPause.click();
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") jumpEnd();
    else if (e.code === "ArrowDown" || e.code === "KeyS") duckSet(false);
  });

  /* =========================================================
     3. ALBUM & ANIMATED CHALLENGE CUTSCENE REELS
     ========================================================= */
  const challengeClips = [];

  function drawChallengeScene(clip) {
    const { ctx, w, h, scene, t } = clip;
    ctx.clearRect(0, 0, w, h);

    // Sky + sunbeams
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    if (scene === "year1") {
      sky.addColorStop(0, "#7edff2");
      sky.addColorStop(1, "#daf8e5");
    } else if (scene === "year23") {
      sky.addColorStop(0, "#6dc5f0");
      sky.addColorStop(1, "#fff1c7");
    } else {
      sky.addColorStop(0, "#ff9e74");
      sky.addColorStop(1, "#fff3d1");
    }
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    const gy = h * 0.78;
    // Hill
    ctx.fillStyle = scene === "year4" ? "#56ab52" : "#68cc64";
    ctx.beginPath();
    ctx.arc(w * 0.5, gy + 36, w * 0.72, Math.PI, 0);
    ctx.fill();

    // Ground
    ctx.fillStyle = "#8c5732";
    ctx.fillRect(0, gy, w, h - gy);
    ctx.fillStyle = "#48b04b";
    ctx.fillRect(0, gy, w, 7);

    const cycle = (t % 180) / 180; // 0..1 loop

    if (scene === "year1") {
      // Hero leaping over Vật lý ĐC, Đại số & Giải tích 1
      const obsX = w * (1.15 - cycle * 1.45);
      const dist = Math.abs(obsX - w * 0.25);
      const jump = dist < 44 ? Math.sin(((44 - dist) / 44) * Math.PI) * 44 : 0;

      // Obstacle badge
      ctx.fillStyle = "#e84245";
      ctx.strokeStyle = "#381d0e";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(obsX - 38, gy - 26, 76, 26, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px 'Baloo 2', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(cycle < 0.5 ? "∫ Giải tích 1" : "⚛ Vật lý ĐC", obsX, gy - 10);

      drawAxieHero(ctx, w * 0.25 - 17, gy - 36 - jump, 34, 36, { phase: t, joy: jump > 22 });

      if (obsX < w * 0.18) {
        ctx.fillStyle = "#ffd45e";
        ctx.strokeStyle = "#381d0e";
        ctx.lineWidth = 2.5;
        ctx.font = "800 12px 'Baloo 2', sans-serif";
        ctx.strokeText("PASSED! +100 EXP", w * 0.62, h * 0.34);
        ctx.fillText("PASSED! +100 EXP", w * 0.62, h * 0.34);
      }
    } else if (scene === "year23") {
      // Flying Giải tích 3 + Deadline, hero ducks & grabs Trà đá
      const obsX = w * (1.1 - cycle * 1.4);
      const ducking = Math.abs(obsX - w * 0.26) < 40;

      ctx.fillStyle = "#8b5cf6";
      ctx.strokeStyle = "#381d0e";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(obsX - 38, gy - 54, 76, 24, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px 'Baloo 2', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(cycle < 0.5 ? "∮ Giải tích 3" : "⏰ Deadline", obsX, gy - 38);

      drawAxieHero(ctx, w * 0.26 - 17, gy - 36, 34, 36, { phase: t, duck: ducking });

      if (ducking) {
        ctx.fillStyle = "#6fd973";
        ctx.strokeStyle = "#381d0e";
        ctx.lineWidth = 2.5;
        ctx.font = "800 12px 'Baloo 2', sans-serif";
        ctx.strokeText("NÉ ĐỈNH!", w * 0.52, h * 0.28);
        ctx.fillText("NÉ ĐỈNH!", w * 0.52, h * 0.28);
      }
    } else {
      // Year 4: Đồ án Tốt nghiệp cleared -> Diploma & celebration!
      const hop = Math.abs(Math.sin(t * 0.08)) * 16;
      drawAxieHero(ctx, w * 0.36, gy - 36 - hop, 36, 38, { phase: t, joy: true });

      // Floating Golden Diploma Scroll
      const dy = h * 0.34 + Math.sin(t * 0.1) * 5;
      ctx.fillStyle = "#fff6dc";
      ctx.strokeStyle = "#381d0e";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(w * 0.58, dy, 34, 16, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#e84245";
      ctx.fillRect(w * 0.58 + 14, dy, 6, 16);

      ctx.fillStyle = "#ffd45e";
      ctx.strokeStyle = "#381d0e";
      ctx.lineWidth = 2.5;
      ctx.textAlign = "center";
      ctx.font = "800 13px 'Baloo 2', sans-serif";
      ctx.strokeText("🎓 ĐỒ ÁN: PASS!", w * 0.5, h * 0.2);
      ctx.fillText("🎓 ĐỒ ÁN: PASS!", w * 0.5, h * 0.2);
    }
  }

  function buildAlbumPage(containerId, rows) {
    const root = document.getElementById(containerId);
    if (!root) return;

    rows.forEach((row) => {
      const rowEl = document.createElement("div");
      rowEl.className = "album-row";

      row.forEach((item) => {
        const fig = document.createElement("figure");
        fig.className = "tile";
        fig.style.setProperty("--ar", item.ar);

        if (item.orb) {
          const orb = document.createElement("span");
          orb.className = `card-orb ${item.theme || "emerald"}`;
          orb.textContent = item.orb;
          fig.appendChild(orb);
        }

        if (item.tag) {
          const tag = document.createElement("span");
          tag.className = "card-tag";
          tag.textContent = item.tag;
          fig.appendChild(tag);
        }

        if (item.type === "challenge") {
          const wrap = document.createElement("div");
          wrap.className = "challenge-wrap";

          const c = document.createElement("canvas");
          c.className = "challenge-clip";
          c.width = item.ar === "16 / 9" ? 320 : 200;
          c.height = item.ar === "16 / 9" ? 180 : 200;
          c.setAttribute("aria-label", item.alt || "Video thử thách");
          wrap.appendChild(c);

          if (item.title) {
            const cap = document.createElement("div");
            cap.className = "challenge-cap";
            const span = document.createElement("span");
            span.textContent = item.title;
            cap.appendChild(span);
            wrap.appendChild(cap);
          }

          fig.appendChild(wrap);
          challengeClips.push({
            ctx: c.getContext("2d"),
            w: c.width,
            h: c.height,
            scene: item.scene,
            t: Math.floor(Math.random() * 60),
          });
        } else {
          const img = document.createElement("img");
          img.src = item.src;
          img.alt = item.alt || "Ảnh tốt nghiệp";
          img.loading = "lazy";
          fig.appendChild(img);
        }

        rowEl.appendChild(fig);
      });

      root.appendChild(rowEl);
    });
  }

  buildAlbumPage("albumPage1", cfg.album.page1);
  buildAlbumPage("albumPage2", cfg.album.page2);
  buildAlbumPage("albumPage3", cfg.album.page3);

  if (challengeClips.length) {
    function tickClips() {
      challengeClips.forEach((clip) => {
        clip.t++;
        drawChallengeScene(clip);
      });
      requestAnimationFrame(tickClips);
    }
    requestAnimationFrame(tickClips);
  }

  /* =========================================================
     4. CONFETTI CANVAS (#fx)
     ========================================================= */
  const confetti = [];
  let fxRunning = false;

  function resizeFx() {
    fxCanvas.width = window.innerWidth;
    fxCanvas.height = window.innerHeight;
  }
  resizeFx();
  window.addEventListener("resize", resizeFx);

  function launchConfetti(count = 95) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const palette = ["#f6b828", "#e84245", "#25a9e0", "#39a854", "#fff6dc"];
    const w = fxCanvas.width;
    const h = fxCanvas.height;

    for (let i = 0; i < count; i++) {
      const fromLeft = i % 2 === 0;
      confetti.push({
        x: fromLeft ? w * 0.25 + Math.random() * 60 : w * 0.75 - Math.random() * 60,
        y: h * 0.52 + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 9 + (fromLeft ? 1.5 : -1.5),
        vy: -Math.random() * 11 - 4,
        g: 0.26 + Math.random() * 0.1,
        size: 6 + Math.random() * 5,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.2,
        color: palette[i % palette.length],
        alpha: 1,
      });
    }

    if (!fxRunning) {
      fxRunning = true;
      requestAnimationFrame(tickFx);
    }
  }

  function tickFx() {
    const ctx = fxCanvas.getContext("2d");
    ctx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

    for (let i = confetti.length - 1; i >= 0; i--) {
      const p = confetti[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.g;
      p.vx *= 0.99;
      p.rot += p.vrot;
      if (p.y > fxCanvas.height * 0.82) p.alpha -= 0.028;

      if (p.alpha <= 0 || p.y > fxCanvas.height + 30) {
        confetti.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size * 0.6);
      ctx.restore();
    }

    if (confetti.length > 0) requestAnimationFrame(tickFx);
    else fxRunning = false;
  }

  /* =========================================================
     5. BACKGROUND MUSIC + WEB AUDIO FALLBACK
     ========================================================= */
  bgm.src = cfg.musicSrc;

  function startFallbackMusic() {
    if (synthTimer) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioCtx) audioCtx = new AudioCtx();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const notes = [349.23, 440.0, 523.25, 659.25, 587.33, 440.0, 392.0, 523.25];
    let step = 0;

    const playNote = () => {
      if (!isMusicOn || !audioCtx) return;
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(notes[step % notes.length], now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 1.45);
      step++;
    };

    playNote();
    synthTimer = setInterval(playNote, 650);
  }

  function stopFallbackMusic() {
    if (synthTimer) {
      clearInterval(synthTimer);
      synthTimer = null;
    }
  }

  async function setMusic(on) {
    isMusicOn = on;
    soundBtn.setAttribute("aria-pressed", on ? "true" : "false");

    if (on) {
      try {
        bgm.volume = 0.4;
        await bgm.play();
        stopFallbackMusic();
      } catch {
        startFallbackMusic();
      }
    } else {
      bgm.pause();
      stopFallbackMusic();
    }
  }

  soundBtn.addEventListener("click", () => {
    setMusic(!isMusicOn);
  });

  /* =========================================================
     6. ENVELOPE TEAR-OPEN & UNFOLD SEQUENCE
     ========================================================= */
  let torn = false;
  let readyToDismiss = false;
  let dismissed = false;

  function triggerTear() {
    if (torn) return;
    torn = true;
    intro.classList.add("tearing");

    setTimeout(() => intro.classList.add("torn"), 260);
    setTimeout(() => intro.classList.add("rise"), 500);
    setTimeout(() => intro.classList.add("leave"), 940);
    setTimeout(() => intro.classList.add("unfold"), 1220);
    setTimeout(() => {
      intro.classList.add("ready");
      readyToDismiss = true;
    }, 1820);
  }

  function dismissIntro() {
    if (!readyToDismiss || dismissed) return;
    dismissed = true;
    intro.classList.add("done");
    document.body.classList.remove("locked");
    document.body.classList.add("opened");

    if (!isMusicOn) setMusic(true);
    launchConfetti(95);

    setTimeout(() => {
      intro.style.display = "none";
      updateScrollEffects();
      fitAllSections();
    }, 700);
  }

  let dragStartX = 0;
  let dragging = false;
  let moved = false;

  tearArea.addEventListener("pointerdown", (e) => {
    if (torn) return;
    dragging = true;
    moved = false;
    dragStartX = e.clientX;
    peel.classList.add("dragging");
    tearArea.setPointerCapture(e.pointerId);
  });

  tearArea.addEventListener("pointermove", (e) => {
    if (!dragging || torn) return;
    const dx = Math.max(0, e.clientX - dragStartX);
    if (dx > 6) moved = true;
    const width = env.clientWidth || 320;
    const progress = Math.min(1, dx / (width * 0.55));
    peel.style.setProperty("--t", String(dx));
    peel.style.setProperty("--k", String(progress));

    if (progress >= 0.62) {
      dragging = false;
      peel.classList.remove("dragging");
      triggerTear();
    }
  });

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    peel.classList.remove("dragging");
    if (!torn) {
      peel.style.setProperty("--t", "0");
      peel.style.setProperty("--k", "0");
    }
  };

  tearArea.addEventListener("pointerup", endDrag);
  tearArea.addEventListener("pointercancel", endDrag);

  env.addEventListener("click", () => {
    if (moved) {
      moved = false;
      return;
    }
    if (!torn) triggerTear();
    else if (readyToDismiss) dismissIntro();
  });

  intro.addEventListener("click", (e) => {
    if (readyToDismiss && e.target !== soundBtn) dismissIntro();
  });

  env.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!torn) triggerTear();
      else if (readyToDismiss) dismissIntro();
    }
  });

  /* =========================================================
     7. LIVE COUNTDOWN TIMER
     ========================================================= */
  const targetTs = new Date(cfg.event.isoDate).getTime();
  const cdNodes = {
    d: $("#cdD"),
    h: $("#cdH"),
    m: $("#cdM"),
    s: $("#cdS"),
  };
  const cdLabel = $("#cdLabel");
  const prevVals = { d: "", h: "", m: "", s: "" };

  function setDigit(node, key, val) {
    const txt = String(val).padStart(2, "0");
    if (prevVals[key] !== txt) {
      prevVals[key] = txt;
      node.textContent = txt;
      node.classList.remove("bump");
      void node.offsetWidth;
      node.classList.add("bump");
    }
  }

  function updateCountdown() {
    const diff = targetTs - Date.now();
    if (diff <= 0) {
      cdLabel.textContent = "NGÀY HỘI ĐÃ ĐẾN!";
      setDigit(cdNodes.d, "d", 0);
      setDigit(cdNodes.h, "h", 0);
      setDigit(cdNodes.m, "m", 0);
      setDigit(cdNodes.s, "s", 0);
      return;
    }
    const sec = Math.floor(diff / 1000);
    setDigit(cdNodes.d, "d", Math.floor(sec / 86400));
    setDigit(cdNodes.h, "h", Math.floor((sec % 86400) / 3600));
    setDigit(cdNodes.m, "m", Math.floor((sec % 3600) / 60));
    setDigit(cdNodes.s, "s", sec % 60);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* =========================================================
     8. SCROLL EFFECTS, .fit ZOOM, REVEALS & RPG DOCK STATE
     ========================================================= */
  const foldSections = [...$$(".sec"), $("#closingSec")];
  const pops = $$(".pop");
  const revealTargets = $$(".r, .pop, .album-row");
  const dockLinks = $$(".dock-item");
  const closingSec = $("#closingSec");

  function fitAllSections() {
    const vh = window.innerHeight;
    $$(".sec:not(.grow) .fit").forEach((fit) => {
      fit.style.zoom = "1";
      const avail = vh - 108;
      const h = fit.scrollHeight;
      if (h > avail && avail > 300) {
        const ratio = Math.max(0.72, avail / h);
        fit.style.zoom = ratio.toFixed(3);
      }
    });
  }

  function updateScrollEffects() {
    const vh = window.innerHeight || 1;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduce) {
      foldSections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        const p = Math.max(-1.2, Math.min(1.2, rect.top / vh));
        const a = Math.min(1, Math.abs(p));
        sec.style.setProperty("--p", p.toFixed(3));
        sec.style.setProperty("--a", a.toFixed(3));
      });

      pops.forEach((pop) => {
        const rect = pop.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const py = Math.max(-1, Math.min(1, (center - vh / 2) / vh));
        pop.style.setProperty("--py", py.toFixed(3));
      });
    }
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  revealTargets.forEach((el) => io.observe(el));

  const secObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target === closingSec) {
          document.body.classList.toggle("at-end", entry.isIntersecting);
          return;
        }
        if (entry.isIntersecting && entry.target.id) {
          dockLinks.forEach((a) => {
            a.classList.toggle("active", a.dataset.sec === entry.target.id);
          });
        }
      });
    },
    { threshold: 0.52 }
  );

  [...$$(".sec[id]"), closingSec].forEach((s) => secObserver.observe(s));

  let scrollTicking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(() => {
          updateScrollEffects();
          scrollTicking = false;
        });
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    fitAllSections();
    updateScrollEffects();
  });

  fitAllSections();
  updateScrollEffects();

  /* =========================================================
     9. RSVP & GUESTBOOK WALL
     ========================================================= */
  const wallList = $("#wallList");
  const gbForm = $("#gb");
  const gbBtn = $("#gbBtn");
  const rsvpMsg = $("#rsvpMsg");
  const photoInput = $("#photoInput");
  const fileLabel = $("#fileLabel");
  const previewImg = $("#preview");

  let pendingImageDataUrl = "";

  function loadStoredWishes() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  function saveStoredWishes(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Ignore quota exceeded
    }
  }

  function createWishCard(wish) {
    const card = document.createElement("article");
    card.className = "wish";

    const top = document.createElement("div");
    top.className = "wish-top";

    const h4 = document.createElement("h4");
    h4.textContent = wish.name || "Đồng đội";

    const tag = document.createElement("span");
    const isYes = wish.attend !== "no";
    tag.className = "wish-tag" + (isYes ? "" : " away");
    tag.textContent = isYes ? "✓ Sẽ tham dự" : "★ Gửi lời chúc";

    top.appendChild(h4);
    top.appendChild(tag);
    card.appendChild(top);

    const p = document.createElement("p");
    p.textContent =
      wish.message ||
      (isYes
        ? "Chúc mừng tân cử nhân! Hẹn gặp bạn tại buổi lễ nhé."
        : "Chúc mừng tốt nghiệp thật rực rỡ nhé!");
    card.appendChild(p);

    if (wish.image) {
      const img = document.createElement("img");
      img.src = wish.image;
      img.alt = `Ảnh kỷ niệm từ ${wish.name}`;
      img.loading = "lazy";
      card.appendChild(img);
    }

    return card;
  }

  function renderWall() {
    wallList.innerHTML = "";
    const stored = loadStoredWishes();
    const all = [...stored, ...(cfg.initialWishes || [])];
    all.forEach((w) => wallList.appendChild(createWishCard(w)));
  }

  renderWall();

  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const maxSide = 720;
          let { width, height } = img;
          if (width > maxSide || height > maxSide) {
            const scale = maxSide / Math.max(width, height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.78));
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  photoInput.addEventListener("change", async () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file) {
      pendingImageDataUrl = "";
      fileLabel.textContent = "📷 Gửi kèm một tấm ảnh (không bắt buộc)";
      previewImg.hidden = true;
      previewImg.removeAttribute("src");
      return;
    }

    try {
      pendingImageDataUrl = await compressImage(file);
      fileLabel.textContent = `✓ Đã chọn: ${file.name}`;
      previewImg.src = pendingImageDataUrl;
      previewImg.hidden = false;
    } catch {
      pendingImageDataUrl = "";
      rsvpMsg.className = "rsvp-msg err";
      rsvpMsg.textContent = "Không thể đọc ảnh này, bạn thử chọn tấm khác nhé.";
    }
  });

  gbForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(gbForm);

    if ((fd.get("website") || "").toString().trim() !== "") return;

    const name = (fd.get("name") || "").toString().trim();
    const message = (fd.get("message") || "").toString().trim();
    const attend = (fd.get("attend") || "yes").toString();

    if (!name) {
      rsvpMsg.className = "rsvp-msg err";
      rsvpMsg.textContent = "Bạn vui lòng nhập tên của mình nhé!";
      gbForm.querySelector('input[name="name"]').focus();
      return;
    }

    gbBtn.disabled = true;
    rsvpMsg.className = "rsvp-msg";
    rsvpMsg.textContent = "Đang ghi vào Bảng tin...";

    const newWish = {
      id: `local-${Date.now()}`,
      name,
      attend,
      message,
      image: pendingImageDataUrl,
      createdAt: new Date().toISOString(),
    };

    if (cfg.guestbookEndpoint) {
      try {
        await fetch(cfg.guestbookEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newWish),
        });
      } catch {
        // Fallback smoothly to localStorage
      }
    }

    const stored = loadStoredWishes();
    stored.unshift(newWish);
    saveStoredWishes(stored);
    renderWall();

    if (attend === "yes") launchConfetti(65);

    rsvpMsg.className = "rsvp-msg";
    rsvpMsg.textContent =
      attend === "yes"
        ? `🎉 Tuyệt vời ${name}! Hẹn gặp bạn tại lễ tốt nghiệp — lời nhắn đã lên Bảng tin.`
        : `💐 Cảm ơn ${name} đã gửi lời chúc! Thư của bạn đã được lưu vào Bảng tin.`;

    gbForm.reset();
    pendingImageDataUrl = "";
    fileLabel.textContent = "📷 Gửi kèm một tấm ảnh (không bắt buộc)";
    previewImg.hidden = true;
    previewImg.removeAttribute("src");
    gbBtn.disabled = false;
  });
})();
