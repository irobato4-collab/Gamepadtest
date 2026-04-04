(function () {

  // ⭐ 外部から使える状態
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

  // HTML生成
  document.body.insertAdjacentHTML("beforeend", `
    <div id="zone"></div>

    <div id="pad">
      <div id="btnA" class="btn">A</div>
      <div id="btnB" class="btn">B</div>
      <div id="btnX" class="btn">X</div>
      <div id="btnY" class="btn">Y</div>
    </div>
  `);

  // CSS
  const style = document.createElement("style");
  style.textContent = `

    /* ===== D-pad ===== */
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
      user-select:none;
    }

    #btnA { left:130px; top:70px; }
    #btnB { left:70px; top:130px; }
    #btnX { left:70px; top:10px; }
    #btnY { left:10px; top:70px; }

    .btn.active {
      background:rgba(255,255,255,0.6);
    }

  `;
  document.head.appendChild(style);

  // ===== D-pad生成 =====
  const zone = document.getElementById("zone");
  zone.innerHTML = `
    <div class="dir up" data-key="up"></div>
    <div class="dir down" data-key="down"></div>
    <div class="dir left" data-key="left"></div>
    <div class="dir right" data-key="right"></div>
  `;

  // ===== D-pad入力 =====
  document.querySelectorAll(".dir").forEach(btn => {
    const key = btn.dataset.key;

    const press = () => {
      window.gamepadState[key] = true;
      btn.classList.add("active");
    };

    const release = () => {
      window.gamepadState[key] = false;
      btn.classList.remove("active");
    };

    btn.addEventListener("touchstart", press);
    btn.addEventListener("touchend", release);
    btn.addEventListener("touchcancel", release);

    btn.addEventListener("mousedown", press);
    btn.addEventListener("mouseup", release);
    btn.addEventListener("mouseleave", release);
  });

  // ===== ボタン =====
  function setupButton(id, key) {
    const btn = document.getElementById(id);

    const press = () => {
      window.gamepadState[key] = true;
      btn.classList.add("active");
    };

    const release = () => {
      window.gamepadState[key] = false;
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
