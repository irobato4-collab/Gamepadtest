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

    .up::before { width:60px; height:90px; transform:translate(-50%, -100%); }
    .down::before { width:60px; height:90px; transform:translate(-50%, 0%); }
    .left::before { width:90px; height:60px; transform:translate(-100%, -50%); }
    .right::before { width:90px; height:60px; transform:translate(0%, -50%); }

    #pad {
      position:absolute;
      bottom:40px;
      right:100px;
      width:200px;
      height:200px;
      touch-action:none;
    }

    .btn {
      position:absolute;
      width:60px;
      height:60px;
      border-radius:50%;
      background:rgba(255,255,255,0.2);
      border:2px solid white;
      text-align:center;
      line-height:60px;
      color:white;
    }

    .btn.active {
      background:rgba(255,255,255,0.6);
    }

    #btnA { left:130px; top:70px; }
    #btnB { left:70px; top:130px; }
    #btnX { left:70px; top:10px; }
    #btnY { left:10px; top:70px; }
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

  let dpadTouchId = null;

  function handleDpadStart(e) {
    const rect = zone.getBoundingClientRect();

    for (let t of e.changedTouches) {
      if (
        t.clientX >= rect.left && t.clientX <= rect.right &&
        t.clientY >= rect.top && t.clientY <= rect.bottom
      ) {
        dpadTouchId = t.identifier;
      }
    }

    updateDpad(e);
  }

  function handleDpadMove(e) {
    if (dpadTouchId === null) return;
    updateDpad(e);
  }

  function handleDpadEnd(e) {
    for (let t of e.changedTouches) {
      if (t.identifier === dpadTouchId) {
        dpadTouchId = null;
        resetDir();
      }
    }
  }

  function resetDir() {
    gamepadState.up = false;
    gamepadState.down = false;
    gamepadState.left = false;
    gamepadState.right = false;
    Object.values(dirs).forEach(d => d.classList.remove("active"));
  }

  function updateDpad(e) {
    const rect = zone.getBoundingClientRect();

    resetDir();

    for (let t of e.touches) {
      if (t.identifier !== dpadTouchId) continue;

      const x = t.clientX - (rect.left + rect.width / 2);
      const y = t.clientY - (rect.top + rect.height / 2);

      if (Math.abs(x) < 10 && Math.abs(y) < 10) return;

      if (Math.abs(x) > Math.abs(y)) {
        if (x > 0) {
          gamepadState.right = true;
          dirs.right.classList.add("active");
        } else {
          gamepadState.left = true;
          dirs.left.classList.add("active");
        }
      } else {
        if (y > 0) {
          gamepadState.down = true;
          dirs.down.classList.add("active");
        } else {
          gamepadState.up = true;
          dirs.up.classList.add("active");
        }
      }
    }
  }

  zone.addEventListener("touchstart", handleDpadStart, { passive:false });
  zone.addEventListener("touchmove", handleDpadMove, { passive:false });
  zone.addEventListener("touchend", handleDpadEnd);
  zone.addEventListener("touchcancel", handleDpadEnd);

  // ===== ボタン =====
  const pad = document.getElementById("pad");

  const btnMap = {
    A: document.getElementById("btnA"),
    B: document.getElementById("btnB"),
    X: document.getElementById("btnX"),
    Y: document.getElementById("btnY")
  };

  let padTouchId = null;

  function handlePadStart(e) {
    const rect = pad.getBoundingClientRect();

    for (let t of e.changedTouches) {
      if (
        t.clientX >= rect.left && t.clientX <= rect.right &&
        t.clientY >= rect.top && t.clientY <= rect.bottom
      ) {
        padTouchId = t.identifier;
      }
    }

    updatePad(e);
  }

  function handlePadMove(e) {
    if (padTouchId === null) return;
    updatePad(e);
  }

  function handlePadEnd(e) {
    for (let t of e.changedTouches) {
      if (t.identifier === padTouchId) {
        padTouchId = null;
        resetButtons();
      }
    }
  }

  function resetButtons() {
    gamepadState.A = false;
    gamepadState.B = false;
    gamepadState.X = false;
    gamepadState.Y = false;
    Object.values(btnMap).forEach(b => b.classList.remove("active"));
  }

  function updatePad(e) {
    resetButtons();

    for (let t of e.touches) {
      if (t.identifier !== padTouchId) continue;

      for (let key in btnMap) {
        const b = btnMap[key].getBoundingClientRect();

        if (
          t.clientX >= b.left &&
          t.clientX <= b.right &&
          t.clientY >= b.top &&
          t.clientY <= b.bottom
        ) {
          gamepadState[key] = true;
          btnMap[key].classList.add("active");
        }
      }
    }
  }

  pad.addEventListener("touchstart", handlePadStart, { passive:false });
  pad.addEventListener("touchmove", handlePadMove, { passive:false });
  pad.addEventListener("touchend", handlePadEnd);
  pad.addEventListener("touchcancel", handlePadEnd);

})();
