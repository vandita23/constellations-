gsap.registerPlugin(ScrollTrigger);

// ════════════════════════════════════════════════════════════════════════════
// CUSTOM CURSOR — space orb with fading sparkle trail
// ════════════════════════════════════════════════════════════════════════════
const cursor = document.getElementById("customCursor");
let mx = -100, my = -100;

document.addEventListener("mousemove", e => {
  mx = e.clientX; my = e.clientY;
  gsap.to(cursor, { x: mx, y: my, duration: 0.12, ease: "power2.out" });
  spawnSparkle(mx, my);
});
document.addEventListener("mousedown", () => cursor.classList.add("clicking"));
document.addEventListener("mouseup",   () => cursor.classList.remove("clicking"));

// Sparkle shapes: star polygon points
function starPoints(cx, cy, r, n = 4) {
  let pts = "";
  for (let i = 0; i < n * 2; i++) {
    const angle = (i * Math.PI) / n - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.4;
    pts += `${cx + Math.cos(angle) * rad},${cy + Math.sin(angle) * rad} `;
  }
  return pts.trim();
}

let sparklePool = [];
function spawnSparkle(x, y) {
  // Throttle: ~30fps max sparkles
  const now = Date.now();
  if (spawnSparkle._last && now - spawnSparkle._last < 33) return;
  spawnSparkle._last = now;

  const size  = 4 + Math.random() * 7;
  const kind  = Math.random();
  const svg   = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const ox    = x + (Math.random() - 0.5) * 14;
  const oy    = y + (Math.random() - 0.5) * 14;

  svg.style.cssText = `position:fixed;pointer-events:none;z-index:99998;overflow:visible;top:0;left:0;`;
  svg.setAttribute("width", "1");
  svg.setAttribute("height", "1");

  let el;
  if (kind < 0.5) {
    // 4-pointed star
    el = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    el.setAttribute("points", starPoints(ox, oy, size, 4));
    el.setAttribute("fill", Math.random() > 0.5 ? "#ffffff" : "#7cc6ff");
  } else if (kind < 0.8) {
    // small circle
    el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    el.setAttribute("cx", ox); el.setAttribute("cy", oy); el.setAttribute("r", size * 0.45);
    el.setAttribute("fill", "#aad4ff");
  } else {
    // tiny cross
    el = document.createElementNS("http://www.w3.org/2000/svg", "path");
    el.setAttribute("d", `M${ox-size},${oy} L${ox+size},${oy} M${ox},${oy-size} L${ox},${oy+size}`);
    el.setAttribute("stroke", "#ffffff"); el.setAttribute("stroke-width", "1.2");
    el.setAttribute("fill", "none");
  }
  svg.appendChild(el);
  document.body.appendChild(svg);

  gsap.fromTo(svg,
    { opacity: 0.9, scale: 1, transformOrigin: `${ox}px ${oy}px` },
    {
      opacity: 0,
      scale: 0.1 + Math.random() * 0.6,
      y: -(10 + Math.random() * 20),
      x: (Math.random() - 0.5) * 14,
      duration: 0.55 + Math.random() * 0.4,
      ease: "power2.out",
      onComplete: () => svg.remove()
    }
  );
}

// ════════════════════════════════════════════════════════════════════════════
// HERO ENTRANCE
// ════════════════════════════════════════════════════════════════════════════
gsap.timeline({ delay: 0.4 })
  .from(".title",              { duration: 1.8, opacity: 0, y: -70, letterSpacing: "0.55em", ease: "expo.out" })
  .from(".typewriter",         { duration: 1.2, opacity: 0, y: 22,  ease: "power3.out" },   "-=0.4")
  .from("#soundBtn,#soundToggle", { duration: 0.8, opacity: 0, y: 14, stagger: 0.15, ease: "power2.out" }, "-=0.3")
  .from(".scroll",             { duration: 0.8, opacity: 0, y: 10,  ease: "power2.out" },   "-=0.2");

gsap.to(".scroll", { y: 8, duration: 1.6, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2.8 });

// ════════════════════════════════════════════════════════════════════════════
// STORY SECTIONS
// ════════════════════════════════════════════════════════════════════════════
document.querySelectorAll(".story").forEach(section => {
  const h2 = section.querySelector("h2");
  const ps = section.querySelectorAll("p");
  gsap.from(h2, {
    scrollTrigger: { trigger: h2, start: "top 82%", toggleActions: "play none none none" },
    duration: 1.1, opacity: 0, y: 44, letterSpacing: "0.5em", ease: "expo.out"
  });
  gsap.from(ps, {
    scrollTrigger: { trigger: section, start: "top 75%", toggleActions: "play none none none" },
    duration: 1, opacity: 0, y: 30, stagger: 0.22, ease: "power3.out"
  });
});

// ════════════════════════════════════════════════════════════════════════════
// GREAT BEAR CONSTELLATION
// ════════════════════════════════════════════════════════════════════════════
ScrollTrigger.create({
  trigger: ".great-bear-section",
  start: "top 70%", once: true,
  onEnter: () => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.fromTo(".bear-title",   { opacity:0, y:28 }, { opacity:1, y:0, duration:1.0 }, 0);
    tl.fromTo(".bear-subtitle",{ opacity:0, y:16 }, { opacity:1, y:0, duration:0.8 }, 0.5);

    document.querySelectorAll(".bstar").forEach((s, i) => {
      tl.fromTo(s, { opacity:0, scale:0, transformOrigin:"center center" },
                   { opacity:1, scale:1.4, duration:0.35, ease:"back.out(3)" }, 0.8 + i*0.13);
      tl.to(s, { scale:1.0, duration:0.3 }, 1.05 + i*0.13);
    });
    document.querySelectorAll(".bline").forEach((l, i) => {
      tl.fromTo(l, { opacity:0, strokeDashoffset:1 },
                   { opacity:0.7, strokeDashoffset:0, duration:0.65, ease:"power1.inOut" }, 2.4 + i*0.1);
    });
    document.querySelectorAll(".slabel").forEach((lb, i) => {
      tl.fromTo(lb, { opacity:0 }, { opacity:1, duration:0.5 }, 4.0 + i*0.18);
    });
    tl.fromTo([".pointer-line",".pointer-ext"],
      { opacity:0, strokeDashoffset:1 }, { opacity:0.95, strokeDashoffset:0, duration:0.9, stagger:0.3 }, 5.0);
    tl.fromTo([".ptr-arrow",".ptr-label"], { opacity:0 }, { opacity:1, duration:0.5 }, 5.9);
    tl.fromTo(".bear-caption", { opacity:0, y:12 }, { opacity:1, y:0, duration:1.0 }, 6.2);
    tl.call(() => {
      document.querySelectorAll(".bstar").forEach(s => {
        gsap.to(s, { opacity: 0.4+Math.random()*0.6, duration:1.2+Math.random()*2.5,
                     repeat:-1, yoyo:true, ease:"sine.inOut", delay:Math.random()*2.5 });
      });
    }, null, 7.0);
  }
});

// ════════════════════════════════════════════════════════════════════════════
// SAILOR NAVIGATION SCENE
// ════════════════════════════════════════════════════════════════════════════
ScrollTrigger.create({
  trigger: ".sailor-scene",
  start: "top 75%", once: true,
  onEnter: () => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // Scene fades in from darkness
    tl.fromTo(".sailor-scene", { opacity:0 }, { opacity:1, duration:1.2 }, 0);

    // Ship sails in from the left
    tl.fromTo(".ship",
      { opacity:0, x:-80 },
      { opacity:1, x:0, duration:1.4, ease:"power3.out" }, 0.6);

    // Background stars twinkle on one by one
    document.querySelectorAll(".nav-star").forEach((s, i) => {
      tl.fromTo(s, { opacity:0, scale:0, transformOrigin:"center center" },
                   { opacity: s.classList.contains("dim") ? 0.5 : 1,
                     scale:1, duration:0.4, ease:"back.out(2)" }, 1.0 + i*0.15);
    });

    // Polaris flares
    tl.fromTo("#polarisCirc",
      { opacity:0, scale:0, transformOrigin:"640px 8px" },
      { opacity:1, scale:1, duration:0.8, ease:"elastic.out(1,0.5)" }, 2.8);
    tl.fromTo(".polaris-label", { opacity:0 }, { opacity:1, duration:0.5 }, 3.4);

    // Pointer lines draw in
    tl.fromTo("#navPtr1",
      { strokeDashoffset:1, opacity:0 },
      { strokeDashoffset:0, opacity:0.9, duration:0.7 }, 3.2);
    tl.fromTo("#navPtr2",
      { strokeDashoffset:1, opacity:0 },
      { strokeDashoffset:0, opacity:0.7, duration:0.8 }, 3.7);

    // Sailor's gaze line sweeps from ship to Polaris
    tl.fromTo("#gazeLine",
      { strokeDashoffset:1, opacity:0 },
      { strokeDashoffset:0, opacity:1, duration:1.2, ease:"power1.inOut" }, 4.0);

    // Compass rose spins in
    tl.fromTo(".compass-rose",
      { opacity:0, rotation:-180, transformOrigin:"710px 200px", scale:0 },
      { opacity:1, rotation:0, scale:1, duration:1.0, ease:"back.out(1.5)" }, 4.2);

    // Nav labels pop in
    tl.fromTo("#nlMerak",   { opacity:0, y:6 }, { opacity:1, y:0, duration:0.5 }, 4.8);
    tl.fromTo("#nlDubhe",   { opacity:0, y:6 }, { opacity:1, y:0, duration:0.5 }, 5.1);
    tl.fromTo("#nlPolaris", { opacity:0, y:6 }, { opacity:1, y:0, duration:0.5 }, 5.4);

    // Quote fades up last
    tl.fromTo("#navQuote",
      { opacity:0, y:10 },
      { opacity:1, y:0, duration:1.0, ease:"power2.out" }, 5.8);

    // Polaris continuous pulse
    tl.call(() => {
      gsap.to("#polarisCirc", {
        filter:"drop-shadow(0 0 16px #fff) drop-shadow(0 0 30px #aad4ff)",
        duration:1.6, repeat:-1, yoyo:true, ease:"sine.inOut"
      });
      // Compass rose slow spin
      gsap.to(".compass-rose", {
        rotation: 360, duration: 40,
        repeat: -1, ease: "none",
        transformOrigin: "710px 200px"
      });
    }, null, 6.2);
  }
});

// ════════════════════════════════════════════════════════════════════════════
// BIG DIPPER CONSTELLATION heading
// ════════════════════════════════════════════════════════════════════════════
gsap.from(".constellation h2", {
  scrollTrigger: { trigger: ".constellation", start: "top 80%", toggleActions: "play none none none" },
  duration: 1.3, opacity: 0, scale: 0.8, ease: "back.out(1.4)"
});

// ════════════════════════════════════════════════════════════════════════════
// NORTH STAR — HOPE METAPHOR (3-phase)
// ════════════════════════════════════════════════════════════════════════════
let hopePhase = -1;
const phases = [
  document.getElementById("phase1"),
  document.getElementById("phase2"),
  document.getElementById("phase3")
];
const dots = document.querySelectorAll(".dot");

function activateDot(idx) {
  dots.forEach((d, i) => d.classList.toggle("active", i === idx));
}

function showPhase(idx) {
  if (hopePhase === idx) return;
  hopePhase = idx;
  activateDot(idx);
  phases.forEach(p => { p.classList.add("hidden"); gsap.set(p, { opacity:0 }); });

  const p = phases[idx];
  p.classList.remove("hidden");

  if (idx === 0) {
    document.getElementById("darknessLayer").classList.add("dark");
    gsap.to([".c1",".c2",".c3"], { opacity:1, duration:2.5, stagger:0.4, ease:"power2.inOut" });
    const dt = p.querySelectorAll(".dark-text");
    const tl = gsap.timeline();
    tl.set(p, { opacity:1 });
    dt.forEach((t, i) => {
      tl.fromTo(t, { opacity:0, y:18 }, { opacity:1, y:0, duration:0.9, ease:"power2.out" }, 0.3 + i*1.1);
    });
    tl.call(() => setTimeout(() => showPhase(1), 1400), null, 0.3 + dt.length * 1.1);

  } else if (idx === 1) {
    gsap.to([".c1",".c2",".c3"], { opacity:0, duration:2.2, stagger:0.3 });
    document.getElementById("darknessLayer").classList.remove("dark");
    const tl = gsap.timeline();
    tl.set(p, { opacity:1 });
    tl.to(".north-rays", { opacity:1, duration:1 }, 0.4);
    tl.fromTo(".north", { scale:0, opacity:0 }, { scale:1, opacity:1, duration:1.2, ease:"elastic.out(1,0.5)" }, 0.5);
    tl.fromTo(".reveal-text", { opacity:0, y:20 }, { opacity:1, y:0, duration:1.0 }, 1.5);
    tl.call(() => setTimeout(() => showPhase(2), 2000), null, 2.2);

  } else if (idx === 2) {
    const tl = gsap.timeline();
    tl.set(p, { opacity:1 });
    ["#mc1","#mc2","#mc3"].forEach((id, i) => {
      tl.fromTo(id, { opacity:0, y:30 }, { opacity:1, y:0, duration:0.9, ease:"back.out(1.4)" }, 0.2 + i*0.38);
    });
    tl.fromTo(".hope-final-line", { opacity:0, y:16 }, { opacity:1, y:0, duration:1.2 }, 1.6);
    gsap.to(".north", { boxShadow:"0 0 80px #7cc6ff, 0 0 140px rgba(124,198,255,0.3)", duration:1.8, repeat:-1, yoyo:true });
  }
}

dots.forEach((dot, i) => dot.addEventListener("click", () => showPhase(i)));

ScrollTrigger.create({
  trigger: ".north-star", start: "top 60%", once: true,
  onEnter: () => {
    gsap.fromTo(".north-heading", { opacity:0, y:30 }, { opacity:1, y:0, duration:1.2, ease:"expo.out" });
    setTimeout(() => showPhase(0), 700);
  }
});

// ════════════════════════════════════════════════════════════════════════════
// ENDING — HOPE IN DARKNESS CANVAS + WORD ANIMATION
// ════════════════════════════════════════════════════════════════════════════
ScrollTrigger.create({
  trigger: ".ending", start: "top 75%", once: true,
  onEnter: () => {
    // Heading
    gsap.fromTo(".ending h2",
      { opacity:0, y:50, letterSpacing:"0.6em" },
      { opacity:1, y:0, letterSpacing:"0.18em", duration:1.4, ease:"expo.out" });

    gsap.fromTo(".ending p:not(.final):not(.hope-words)",
      { opacity:0, y:25 },
      { opacity:1, y:0, duration:1, stagger:0.3, ease:"power2.out", delay:0.6 });

    // Hope canvas — dark starfield that brightens
    const wrap = document.getElementById("hopeDarkWrap");
    const canvas = document.getElementById("hopeCanvas");
    canvas.width  = wrap.offsetWidth  || 700;
    canvas.height = wrap.offsetHeight || 260;
    const ctx2 = canvas.getContext("2d");

    // Create hope stars
    const hStars = Array.from({length: 90}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.5 + Math.random() * 2.2,
      brightness: 0,
      targetB: 0.3 + Math.random() * 0.7,
      speed: 0.004 + Math.random() * 0.008,
      twinkle: Math.random() * 0.015,
      twinkleDir: 1
    }));

    let hopeBrightness = 0;
    let hopeAnimActive = true;

    function drawHopeCanvas() {
      if (!hopeAnimActive) return;
      ctx2.fillStyle = `rgb(${Math.round(hopeBrightness * 12)}, ${Math.round(hopeBrightness * 18)}, ${Math.round(hopeBrightness * 35)})`;
      ctx2.fillRect(0, 0, canvas.width, canvas.height);

      hStars.forEach(s => {
        s.brightness = Math.min(s.targetB, s.brightness + s.speed);
        s.brightness += s.twinkle * s.twinkleDir;
        if (s.brightness > s.targetB || s.brightness < 0.05) s.twinkleDir *= -1;

        const grad = ctx2.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 2.5);
        grad.addColorStop(0, `rgba(255,255,255,${s.brightness})`);
        grad.addColorStop(0.5, `rgba(170,212,255,${s.brightness * 0.4})`);
        grad.addColorStop(1, "transparent");
        ctx2.beginPath();
        ctx2.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
        ctx2.fillStyle = grad;
        ctx2.fill();
      });
      requestAnimationFrame(drawHopeCanvas);
    }

    // Fade in the wrap, then start the canvas
    gsap.fromTo(wrap, { opacity:0 }, {
      opacity:1, duration:1.2, delay:0.8,
      onComplete: () => {
        drawHopeCanvas();
        // Gradually brighten the background
        gsap.to({ v: 0 }, {
          v: 1, duration: 4, ease: "power1.inOut",
          onUpdate: function() { hopeBrightness = this.targets()[0].v; }
        });
      }
    });

    // Dark words appear first (lost, afraid…)
    const darkWords  = [document.getElementById("hw1"), document.getElementById("hw2"),
                        document.getElementById("hw3"), document.getElementById("hw4")];
    const lightWords = [document.getElementById("hw5"), document.getElementById("hw6"),
                        document.getElementById("hw7"), document.getElementById("hw8")];

    const wtl = gsap.timeline({ delay: 1.2 });
    darkWords.forEach((w, i) => {
      wtl.fromTo(w, { opacity:0, scale:0.8 }, { opacity:1, scale:1, duration:0.6, ease:"power2.out" }, i * 0.4);
    });
    // Pause in darkness…
    wtl.to({}, { duration: 0.8 });
    // Dark words fade out
    wtl.to(darkWords, { opacity:0, y:-12, duration:0.5, stagger:0.1 });
    // Light words emerge
    lightWords.forEach((w, i) => {
      wtl.fromTo(w,
        { opacity:0, scale:0.7, y:14 },
        { opacity:1, scale:1,   y:0, duration:0.8, ease:"back.out(1.5)" },
        `>-${0.4 - i*0.05}`
      );
    });

    // Final line
    gsap.fromTo(".final",
      { opacity:0, y:30, scale:0.95 },
      { opacity:1, y:0, scale:1, duration:1.4, ease:"back.out(1.2)", delay:5.5 }
    );
    gsap.to(".final", {
      textShadow:"0 0 30px rgba(124,198,255,0.9)", duration:1.5, delay:7, yoyo:true, repeat:-1
    });
  }
});