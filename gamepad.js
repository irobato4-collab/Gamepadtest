(function () {

// ===== 状態 =====
window.gamepadState = {
  up:false, down:false, left:false, right:false,
  A:false, B:false, X:false, Y:false,
  start:false, select:false, L:false, R:false
};

let useStick = true;
let joystick = null;

// ===== HTML =====
document.body.insertAdjacentHTML("beforeend", `
<div id="zone"></div>

<div id="toggleMode" class="btn small" style="
  position:absolute; top:20px; left:20px;
">STICK</div>

<div id="pad">  
  <div id="btnA" class="btn">A</div>  
  <div id="btnB" class="btn">B</div>  
  <div id="btnX" class="btn">X</div>  
  <div id="btnY" class="btn">Y</div>  
</div>

<div id="btnL" class="btn lr">L</div>
<div id="btnR" class="btn lr">R</div>

<div id="centerBtns">
  <div id="btnSelect" class="btn small">SEL</div>
  <div id="btnStart" class="btn small">STA</div>
</div>
`);

// ===== CSS =====
const style = document.createElement("style");
style.textContent = `
#zone {
  position:absolute;
  bottom:60px;
  left:60px;
  width:190px;
  height:190px;
  touch-action:none;
}

.dir { position:absolute; width:100%; height:100%; }
.up { clip-path: polygon(50% 50%, 0% 0%, 100% 0%); }
.down { clip-path: polygon(50% 50%, 0% 100%, 100% 100%); }
.left { clip-path: polygon(50% 50%, 0% 0%, 0% 100%); }
.right { clip-path: polygon(50% 50%, 100% 0%, 100% 100%); }

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
}

.small { width:60px; height:60px; line-height:60px; font-size:14px; }

#pad { position:absolute; bottom:40px; right:100px; width:220px; height:220px; }

#btnA { left:150px; top:80px; }  
#btnB { left:80px; top:150px; }  
#btnX { left:80px; top:10px; }  
#btnY { left:10px; top:80px; }

.lr {
  width:160px; height:50px; border-radius:6px;
  line-height:50px;
}
#btnL { bottom:340px; left:30px; position:absolute; }
#btnR { bottom:340px; right:30px; position:absolute; }

#centerBtns {
  position:absolute;
  bottom:10px;
  left:50%;
  transform:translateX(-50%);
  width:160px;
}
`;
document.head.appendChild(style);

// ===== Dpad =====
function createDpad() {
  document.getElementById("zone").innerHTML = `
    <div class="dir up"></div>
    <div class="dir down"></div>
    <div class="dir left"></div>
    <div class="dir right"></div>
  `;
}

// ===== nipplejs（4方向のみ）=====
function createStick() {
  document.getElementById("zone").innerHTML = "";

  if (!joystick) {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/nipplejs@0.10.1/dist/nipplejs.min.js";
    script.onload = () => initStick();
    document.head.appendChild(script);
  } else {
    initStick();
  }
}

function initStick() {
  joystick = nipplejs.create({
    zone: document.getElementById('zone'),
    mode: 'static',
    position: { left: '50%', top: '50%' },
    color: 'white'
  });

  joystick.on('move', (evt, data) => {
    if (!useStick || !data.vector) return;

    const x = data.vector.x;
    const y = data.vector.y;

    gamepadState.up = false;
    gamepadState.down = false;
    gamepadState.left = false;
    gamepadState.right = false;

    // 4方向のみ
    if (Math.abs(x) > Math.abs(y)) {
      if (x > 0) gamepadState.right = true;
      else gamepadState.left = true;
    } else {
      if (y > 0) gamepadState.up = true;
      else gamepadState.down = true;
    }
  });

  joystick.on('end', () => {
    gamepadState.up = false;
    gamepadState.down = false;
    gamepadState.left = false;
    gamepadState.right = false;
  });
}

// ===== Dpad操作 =====
function handleDpad(e) {
  if (useStick) return;

  const rect = zone.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  gamepadState.up = false;
  gamepadState.down = false;
  gamepadState.left = false;
  gamepadState.right = false;

  for (let t of e.touches) {
    const x = t.clientX - cx;
    const y = t.clientY - cy;

    if (Math.abs(x) > Math.abs(y)) {
      gamepadState.right = x > 0;
      gamepadState.left = x < 0;
    } else {
      gamepadState.down = y > 0;
      gamepadState.up = y < 0;
    }
  }
}

zone.addEventListener("touchstart", handleDpad);
zone.addEventListener("touchmove", handleDpad);
zone.addEventListener("touchend", handleDpad);

// ===== 切り替え =====
document.getElementById("toggleMode").onclick = () => {
  useStick = !useStick;

  gamepadState.up = false;
  gamepadState.down = false;
  gamepadState.left = false;
  gamepadState.right = false;

  document.getElementById("toggleMode").textContent = useStick ? "STICK" : "DPAD";

  if (useStick) createStick();
  else createDpad();
};

// 初期
createStick();

})();
