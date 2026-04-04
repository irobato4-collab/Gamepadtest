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

  // HTML生成（ログなし）
  document.body.insertAdjacentHTML("beforeend", `
    <div id="zone" style="
      position:absolute; bottom:60px; left:60px;
      width:150px; height:150px;
    "></div>

    <div id="pad" style="
      position:absolute; bottom:40px; right:100px;
      width:200px; height:200px;
    ">
      <div id="btnA" class="btn">A</div>
      <div id="btnB" class="btn">B</div>
      <div id="btnX" class="btn">X</div>
      <div id="btnY" class="btn">Y</div>
    </div>
  `);

  // CSS
  const style = document.createElement("style");
  style.textContent = `
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

    .btn:active {
      background:rgba(255,255,255,0.5);
    }
  `;
  document.head.appendChild(style);

  // nipplejs読み込み
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/nipplejs/0.9.0/nipplejs.min.js";
  script.onload = () => {

    const joystick = nipplejs.create({
      zone: document.getElementById('zone'),
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: 'white'
    });

    joystick.on('move', (evt, data) => {
      if (!data.vector) return;

      const x = data.vector.x;
      const y = data.vector.y;

      // リセット
      window.gamepadState.up = false;
      window.gamepadState.down = false;
      window.gamepadState.left = false;
      window.gamepadState.right = false;

      // 判定（しきい値あり）
      if (y > 0.5) window.gamepadState.up = true;
      if (y < -0.5) window.gamepadState.down = true;
      if (x < -0.5) window.gamepadState.left = true;
      if (x > 0.5) window.gamepadState.right = true;
    });

    joystick.on('end', () => {
      window.gamepadState.up = false;
      window.gamepadState.down = false;
      window.gamepadState.left = false;
      window.gamepadState.right = false;
    });
  };

  document.head.appendChild(script);

  // ボタン
  function setupButton(id, key) {
    const btn = document.getElementById(id);

    const press = () => window.gamepadState[key] = true;
    const release = () => window.gamepadState[key] = false;

    btn.addEventListener("touchstart", press);
    btn.addEventListener("touchend", release);
    btn.addEventListener("mousedown", press);
    btn.addEventListener("mouseup", release);
  }

  setupButton("btnA", "A");
  setupButton("btnB", "B");
  setupButton("btnX", "X");
  setupButton("btnY", "Y");

})();
