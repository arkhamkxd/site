/* ============================================================
   cat.js — a small pixel cat that strolls past now and then.
   Same tabby from the side-scroller portfolio. Cheap, quiet,
   and it stops entirely if the visitor prefers reduced motion.
   ============================================================ */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const CELL = 3, W = 15, H = 12;
  const PAL = { o:'#1a0e05', b:'#fb923c', h:'#ffc078', s:'#c96a18', k:'#1f2937', a:'#e06a15' };

  /* rows of palette letters — edit a letter, the cat changes */
  const base = [
    '...............',
    '.........o.o...',
    '........oaoao..',
    '.ooo....ohhho..',
    'oh.o...ohbbbho.',
    'oh..oooobbbbko.',
    'ohhhhhhhhhbbao.',
    'obbbbbbbbbhbbo.',
    'osbsbsbsbsobbo.',
    'ossssssssso.oo.',
    '..L..L..R..R...',
    '..L..L..R..R...',
  ];
  /* four-frame walk: which leg columns shift */
  const frames = [[0,0],[1,-1],[0,0],[-1,1]];

  const cv = document.createElement('canvas');
  cv.width = (W + 2) * CELL; cv.height = H * CELL;
  Object.assign(cv.style, {
    position:'fixed', left:'0', bottom:'10px', zIndex:'40',
    imageRendering:'pixelated', pointerEvents:'none', opacity:'0'
  });
  const c = cv.getContext('2d');
  c.imageSmoothingEnabled = false;
  document.body.appendChild(cv);

  function draw(frame, flip){
    const [lo, ro] = frames[frame];
    c.clearRect(0, 0, cv.width, cv.height);
    for (let y = 0; y < H; y++){
      const row = base[y];
      for (let x = 0; x < W; x++){
        let ch = row[x];
        if (!ch || ch === '.') continue;
        let dx = x;
        if (ch === 'L'){ ch = 's'; dx = x + lo; }
        else if (ch === 'R'){ ch = 's'; dx = x + ro; }
        const col = PAL[ch]; if (!col) continue;
        c.fillStyle = col;
        c.fillRect((flip ? W - 1 - dx : dx) * CELL + CELL, y * CELL, CELL, CELL);
      }
    }
  }

  let x = -80, dir = 1, frame = 0, t = 0, walking = false, next = 6000;

  function tick(ts){
    if (!walking && ts > next){
      walking = true;
      dir = Math.random() < 0.5 ? 1 : -1;
      x = dir > 0 ? -60 : innerWidth + 60;
      cv.style.opacity = '.85';
    }
    if (walking){
      x += dir * 0.55;
      if (++t % 11 === 0) frame = (frame + 1) % 4;
      draw(frame, dir < 0);
      cv.style.transform = `translateX(${x}px)`;
      if ((dir > 0 && x > innerWidth + 60) || (dir < 0 && x < -60)){
        walking = false;
        cv.style.opacity = '0';
        next = ts + 40000 + Math.random() * 50000;   /* ~40–90s between visits */
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
