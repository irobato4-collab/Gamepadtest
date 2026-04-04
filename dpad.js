(function () {

  window.gamepadState = {
    up:false, down:false, left:false, right:false,
    A:false, B:false, X:false, Y:false
  };

  document.body.insertAdjacentHTML("beforeend", `
    <div id="zone">
      <div class="hit up"></div>
      <div class="hit down"></div>
      <div class="hit left"></div>
      <div class="hit right"></div>

      <div class="stick up"></div>
      <div class="stick down"></div>
      <div class="stick left"></div>
      <div class="stick right"></div>
    </div>

    <div id="pad">
      <div id="btnA" class="btn">A</div>
      <div id="btnB" class="btn">B</div>
      <div id="btnX" class="btn">X</div>
      <div id="btnY" class="btn">Y</div>
    </div>
  `);

  const style = document.createElement("style");
  style.textContent = `
    /* ===== D-pad（そのまま再現） ===== */
    #zone {
      position:absolute;
      bottom:60px;
      left:60px;
      width:200px;
      height:200px;
      touch-action:none;
    }

    .hit {
      position:absolute;
      width:100%;
      height:100%;
    }

    .up { clip-path: polygon(50% 50%, 0% 0%, 100% 0%); }
    .down { clip-path: polygon(50% 50%, 0% 100%, 100% 100%); }
    .left { clip-path: polygon(50% 50%, 0% 0%, 0% 100%); }
    .right { clip-path: polygon(50% 50%, 100% 0%, 100% 100%); }

    .stick {
      position:absolute;
      left:50%;
      top:50%;
      background:white;
      opacity:0.4;
      pointer-events:none;
      border-radius:10px;
    }

    .stick.active {
      opacity:1;
    }

    /* ⭐ 完全一致サイズ */
    .stick.up {
      width:55px;
      height:100px;
      transform:translate(-50%, -100%);
    }

    .stick.down {
      width:55px;
      height:100px;
      transform:translate(-50%, 0%);
    }

    .stick.left {
      width:100px;
      height:55px;
      transform:translate(-100%, -50%);
    }

    .stick.right {
      width:100px;
      height:55px;
      transform:translate(0%, -50%);
    }

    /* ===== ABXY ===== */
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

  const sticks = {
    up: zone.querySelector(".stick.up"),
    down: zone.querySelector(".stick.down"),
    left: zone.querySelector(".stick.left"),
    right: zone.querySelector(".stick.right")
  };

  function handleDpad(e) {
    const rect = zone.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const DEAD = 10;
    const RANGE = 30;

    gamepadState.up = false;
    gamepadState.down = false;
    gamepadState.left = false;
    gamepadState.right = false;

    Object.values(sticks).forEach(s => s.classList.remove("active"));

    for (let t of e.touches) {

      if (
        t.clientX < rect.left - RANGE ||
        t.clientX > rect.right + RANGE ||
        t.clientY < rect.top - RANGE ||
        t.clientY > rect.bottom + RANGE
      ) continue;

      const x = t.clientX - cx;
      const y = t.clientY - cy;

      if (Math.abs(x) < DEAD && Math.abs(y) < DEAD) continue;

      if (Math.abs(x) > Math.abs(y)) {
        if (x > 0) {
          gamepadState.right = true;
          sticks.right.classList.add("active");
        } else {
          gamepadState.left = true;
          sticks.left.classList.add("active");
        }
      } else {
        if (y > 0) {
          gamepadState.down = true;
          sticks.down.classList.add("active");
        } else {
          gamepadState.up = true;
          sticks.up.classList.add("active");
        }
      }
    }
  }

  zone.addEventListener("touchstart", handleDpad, { passive:false });
  zone.addEventListener("touchmove", handleDpad, { passive:false });
  zone.addEventListener("touchend", handleDpad);
  zone.addEventListener("touchcancel", handleDpad);

  // ===== ABXY =====
  const pad = document.getElementById("pad");

  const btnMap = {
    A: document.getElementById("btnA"),
    B: document.getElementById("btnB"),
    X: document.getElementById("btnX"),
    Y: document.getElementById("btnY")
  };

  function handlePad(e) {
    const next = { A:false, B:false, X:false, Y:false };

    for (let t of e.touches) {

      for (let key in btnMap) {

        const r = btnMap[key].getBoundingClientRect();
        const margin = 12;

        if (
          t.clientX >= r.left - margin &&
          t.clientX <= r.right + margin &&
          t.clientY >= r.top - margin &&
          t.clientY <= r.bottom + margin
        ) {
          next[key] = true;
        }
      }
    }

    for (let key in btnMap) {
      gamepadState[key] = next[key];
      btnMap[key].classList.toggle("active", next[key]);
    }
  }

  pad.addEventListener("touchstart", handlePad, { passive:false });
  pad.addEventListener("touchmove", handlePad, { passive:false });
  pad.addEventListener("touchend", handlePad);
  pad.addEventListener("touchcancel", handlePad);

})();
