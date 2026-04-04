(function () {

  // ===== 状態 =====
  window.gamepadState = {
    up:false, down:false, left:false, right:false,
    A:false, B:false, X:false, Y:false
  };

  // ===== HTML =====
  document.body.insertAdjacentHTML("beforeend", `
    <div id="zone"></div>

    <div id="pad">
      <div id="btnA" class="btn">A</div>
      <div id="btnB" class="btn">B</div>
      <div id="btnX" class="btn">X</div>
      <div id="btnY" class="btn">Y</div>
    </div>
  `);

  // ===== CSS =====
  const style = document.createElement("style");
  style.textContent = `
    #zone {
      position:absolute;
      bottom:60px;
      left:60px;
      width:180px;
      height:180px;
      touch-action:none;
    }

    .dir { position:absolute; width:100%; height:100%; }
    .up { clip-path: polygon(50% 50%, 0% 0%, 100% 0%); }
    .down { clip-path: polygon(50% 50%, 0% 100%, 100% 100%); }
    .left { clip-path: polygon(50% 50%, 0% 0%, 0% 100%); }
    .right { clip-path: polygon(50% 50%, 100% 0%, 100% 100%); }

    .dir::before {
      content:"";
      position:absolute;
      left:50%;
      top:50%;
      background:white;
      opacity:0.5;
    }
    .dir.active::before { opacity:1; }

    /* ⭐ 外側に長くした */
    .up::before {
      width:80px;
      height:130px;
      transform:translate(-50%, -100%);
    }

    .down::before {
      width:80px;
      height:130px;
      transform:translate(-50%, 0%);
    }

    .left::before {
      width:130px;
      height:80px;
      transform:translate(-100%, -50%);
    }

    .right::before {
      width:130px;
      height:80px;
      transform:translate(0%, -50%);
    }

    #pad {
      position:absolute;
      bottom:40px;
      right:100px;
      width:220px;
      height:220px;
      touch-action:none;
    }

    .btn {
      position:absolute;
      width:70px;
      height:70px;
      border-radius:50%;
      background:rgba(255,255,255,0.2);
      border:2px solid white;
      text-align:center;
      line-height:70px;
      color:white;
      font-size:22px;
    }

    .btn.active {
      background:rgba(255,255,255,0.7);
    }

    #btnA { left:150px; top:80px; }
    #btnB { left:80px; top:150px; }
    #btnX { left:80px; top:10px; }
    #btnY { left:10px; top:80px; }
  `;
  document.head.appendChild(style);

  // ===== D-pad =====
  const zone = document.getElementById("zone");
  zone.innerHTML = `
    <div class="dir up"></div>
    <div class="dir down"></div>
    <div class="dir left"></div>
    <div class="dir right"></div>
  `;

  const dirs = {
    up: zone.querySelector(".up"),
    down: zone.querySelector(".down"),
    left: zone.querySelector(".left"),
    right: zone.querySelector(".right")
  };

  function handleDpad(e) {
    const rect = zone.getBoundingClientRect();

    const DEAD = 12;
    const RANGE = 20; // ⭐ 少し広げた

    gamepadState.up = false;
    gamepadState.down = false;
    gamepadState.left = false;
    gamepadState.right = false;
    Object.values(dirs).forEach(d => d.classList.remove("active"));

    for (let t of e.touches) {

      if (
        t.clientX < rect.left - RANGE || t.clientX > rect.right + RANGE ||
        t.clientY < rect.top - RANGE || t.clientY > rect.bottom + RANGE
      ) continue;

      const x = t.clientX - (rect.left + rect.width / 2);
      const y = t.clientY - (rect.top + rect.height / 2);

      if (Math.abs(x) < DEAD && Math.abs(y) < DEAD) continue;

      if (x > DEAD) {
        gamepadState.right = true;
        dirs.right.classList.add("active");
      }
      if (x < -DEAD) {
        gamepadState.left = true;
        dirs.left.classList.add("active");
      }
      if (y > DEAD) {
        gamepadState.down = true;
        dirs.down.classList.add("active");
      }
      if (y < -DEAD) {
        gamepadState.up = true;
        dirs.up.classList.add("active");
      }
    }
  }

  zone.addEventListener("touchstart", handleDpad, { passive:false });
  zone.addEventListener("touchmove", handleDpad, { passive:false });
  zone.addEventListener("touchend", handleDpad);
  zone.addEventListener("touchcancel", handleDpad);

  // ===== ボタン =====
  const pad = document.getElementById("pad");

  const btnMap = {
    A: document.getElementById("btnA"),
    B: document.getElementById("btnB"),
    X: document.getElementById("btnX"),
    Y: document.getElementById("btnY")
  };

  function expandRect(rect, margin) {
    return {
      left: rect.left - margin,
      right: rect.right + margin,
      top: rect.top - margin,
      bottom: rect.bottom + margin
    };
  }

  function handlePad(e) {
    const padRect = pad.getBoundingClientRect();

    const nextState = {
      A:false, B:false, X:false, Y:false
    };

    for (let t of e.touches) {

      if (
        t.clientX < padRect.left || t.clientX > padRect.right ||
        t.clientY < padRect.top || t.clientY > padRect.bottom
      ) continue;

      for (let key in btnMap) {

        const base = btnMap[key].getBoundingClientRect();
        const b = expandRect(base, 20);

        if (
          t.clientX >= b.left &&
          t.clientX <= b.right &&
          t.clientY >= b.top &&
          t.clientY <= b.bottom
        ) {
          nextState[key] = true;
        }
      }
    }

    for (let key in btnMap) {
      gamepadState[key] = nextState[key];

      if (nextState[key]) {
        btnMap[key].classList.add("active");
      } else {
        btnMap[key].classList.remove("active");
      }
    }
  }

  pad.addEventListener("touchstart", handlePad, { passive:false });
  pad.addEventListener("touchmove", handlePad, { passive:false });
  pad.addEventListener("touchend", handlePad);
  pad.addEventListener("touchcancel", handlePad);

})();
