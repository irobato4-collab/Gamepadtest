(function () {

  // ===== 状態 =====
  window.gamepadState = {
    up:false, down:false, left:false, right:false,
    A:false, B:false, X:false, Y:false
  };

  // ===== HTML =====
  document.body.insertAdjacentHTML("beforeend", `
    <div id="zone">
      <div class="dir up" data-key="up"></div>
      <div class="dir down" data-key="down"></div>
      <div class="dir left" data-key="left"></div>
      <div class="dir right" data-key="right"></div>
    </div>

    <div id="pad">
      <div id="btnA" class="btn">A</div>
      <div id="btnB" class="btn">B</div>
      <div id="btnX" class="btn">X</div>
      <div id="btnY" class="btn">Y</div>
    </div>
  `);

  // ===== CSS（そのまま＋ボタン追加）=====
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

    .dir {
      position:absolute;
      width:100%;
      height:100%;
    }

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

    .dir.active::before {
      opacity:1;
    }

    .up::before {
      width:60px;
      height:90px;
      transform:translate(-50%, -100%);
    }

    .down::before {
      width:60px;
      height:90px;
      transform:translate(-50%, 0%);
    }

    .left::before {
      width:90px;
      height:60px;
      transform:translate(-100%, -50%);
    }

    .right::before {
      width:90px;
      height:60px;
      transform:translate(0%, -50%);
    }

    /* ===== ボタン ===== */
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

  // ===== D-pad スライド対応 =====
  const zone = document.getElementById("zone");
  const dirs = {
    up: zone.querySelector(".up"),
    down: zone.querySelector(".down"),
    left: zone.querySelector(".left"),
    right: zone.querySelector(".right")
  };

  function handleDpad(e) {
    const rect = zone.getBoundingClientRect();

    const DEAD = 10;

    gamepadState.up = false;
    gamepadState.down = false;
    gamepadState.left = false;
    gamepadState.right = false;
    Object.values(dirs).forEach(d => d.classList.remove("active"));

    for (let t of e.touches) {

      if (
        t.clientX < rect.left ||
        t.clientX > rect.right ||
        t.clientY < rect.top ||
        t.clientY > rect.bottom
      ) continue;

      const x = t.clientX - (rect.left + rect.width / 2);
      const y = t.clientY - (rect.top + rect.height / 2);

      if (Math.abs(x) < DEAD && Math.abs(y) < DEAD) continue;

      if (x > 0) {
        gamepadState.right = true;
        dirs.right.classList.add("active");
      }
      if (x < 0) {
        gamepadState.left = true;
        dirs.left.classList.add("active");
      }
      if (y > 0) {
        gamepadState.down = true;
        dirs.down.classList.add("active");
      }
      if (y < 0) {
        gamepadState.up = true;
        dirs.up.classList.add("active");
      }
    }
  }

  zone.addEventListener("touchstart", handleDpad, { passive:false });
  zone.addEventListener("touchmove", handleDpad, { passive:false });
  zone.addEventListener("touchend", handleDpad);
  zone.addEventListener("touchcancel", handleDpad);

  // ===== ABXY（スライド＋同時押し）=====
  const pad = document.getElementById("pad");

  const btnMap = {
    A: document.getElementById("btnA"),
    B: document.getElementById("btnB"),
    X: document.getElementById("btnX"),
    Y: document.getElementById("btnY")
  };

  function handlePad(e) {
    const rect = pad.getBoundingClientRect();

    const next = { A:false, B:false, X:false, Y:false };

    for (let t of e.touches) {

      if (
        t.clientX < rect.left ||
        t.clientX > rect.right ||
        t.clientY < rect.top ||
        t.clientY > rect.bottom
      ) continue;

      for (let key in btnMap) {
        const b = btnMap[key].getBoundingClientRect();

        if (
          t.clientX >= b.left &&
          t.clientX <= b.right &&
          t.clientY >= b.top &&
          t.clientY <= b.bottom
        ) {
          next[key] = true;
        }
      }
    }

    for (let key in btnMap) {
      gamepadState[key] = next[key];

      if (next[key]) btnMap[key].classList.add("active");
      else btnMap[key].classList.remove("active");
    }
  }

  pad.addEventListener("touchstart", handlePad, { passive:false });
  pad.addEventListener("touchmove", handlePad, { passive:false });
  pad.addEventListener("touchend", handlePad);
  pad.addEventListener("touchcancel", handlePad);

})();
