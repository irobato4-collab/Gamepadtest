<script type="module">
import { GamepadEmulator } from 'https://cdn.jsdelivr.net/npm/virtual-gamepad-lib/+esm';

(function () {

  // ⭐ 状態
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

  // HTML（ゾーンはそのまま）
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

  // CSS（そのまま）
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

  // 🎮 Gamepad Emulator
  const gamepad = new GamepadEmulator();

  // 十字キー（D-pad）
  gamepad.addDpad({
    element: document.getElementById("zone"),
    size: 150,
  });

  gamepad.connect();

  // 🎯 状態を同期（重要）
  function update() {
    const gp = navigator.getGamepads()[0];
    if (gp) {
      const x = gp.axes[0];
      const y = gp.axes[1];

      // しきい値
      window.gamepadState.left  = x < -0.5;
      window.gamepadState.right = x > 0.5;
      window.gamepadState.up    = y < -0.5;
      window.gamepadState.down  = y > 0.5;
    }
    requestAnimationFrame(update);
  }
  update();

  // 🔘 ボタン
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
</script>
