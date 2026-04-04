(function () {

  window.gamepadState = {
    up: false,
    down: false,
    left: false,
    right: false,
    A: false,
    B: false,
    X: false,
    Y: false
  };

  document.body.insertAdjacentHTML("beforeend", `
    <div id="zone"></div>

    <div id="pad">
      <div id="btnA" class="btn">A</div>
      <div id="btnB" class="btn">B</div>
      <div id="btnX" class="btn">X</div>
      <div id="btnY" class="btn">Y</div>
    </div>
  `);

  const style = document.createElement("style");
  style.textContent = `
    #zone {
      position:absolute;
      bottom:60px;
      left:60px;
      width:180px;
      height:180px;
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
      font-size:20px;
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

  const zone = document.getElementById("zone");
  zone.innerHTML = `
    <div class="dir up"></div>
    <div class="dir down"></div>
    <div class="dir left"></div>
    <div class="dir right"></div>
  `;

  const dirs = {
    up: document.querySelector(".up"),
    down: document.querySelector(".down"),
    left: document.querySelector(".left"),
    right: document.querySelector(".right")
  };

  function reset() {
    for (let k in gamepadState) {
      if (["up","down","left","right"].includes(k)) {
        gamepadState[k] = false;
      }
    }
    Object.values(dirs).forEach(d => d.classList.remove("active"));
  }

  function updateDirection(x, y) {
    reset();

    const absX = Math.abs(x);
    const absY = Math.abs(y);

    if (absX > absY) {
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

  let rect;

  zone.addEventListener("touchstart", e => {
    rect = zone.getBoundingClientRect();
    handleTouch(e);
  });

  zone.addEventListener("touchmove", e => {
    handleTouch(e);
  });

  zone.addEventListener("touchend", reset);
  zone.addEventListener("touchcancel", reset);

  function handleTouch(e) {
    const touch = e.touches[0];
    const x = touch.clientX - (rect.left + rect.width / 2);
    const y = touch.clientY - (rect.top + rect.height / 2);
    updateDirection(x, y);
  }

  // ボタン
  function setupButton(id, key) {
    const btn = document.getElementById(id);

    const press = () => {
      gamepadState[key] = true;
      btn.classList.add("active");
    };

    const release = () => {
      gamepadState[key] = false;
      btn.classList.remove("active");
    };

    btn.addEventListener("touchstart", press);
    btn.addEventListener("touchend", release);
    btn.addEventListener("touchcancel", release);

    btn.addEventListener("mousedown", press);
    btn.addEventListener("mouseup", release);
    btn.addEventListener("mouseleave", release);
  }

  setupButton("btnA", "A");
  setupButton("btnB", "B");
  setupButton("btnX", "X");
  setupButton("btnY", "Y");

})();
