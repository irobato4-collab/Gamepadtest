(function () {

// ===== 状態 =====
window.gamepadState = {
  up:false, down:false, left:false, right:false,
  moveX:0, moveY:0, // ←追加（アナログ）
  A:false, B:false, X:false, Y:false,
  start:false, select:false, L:false, R:false
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
  width:150px;
  height:150px;
  touch-action:none;
}

#pad {  
  position:absolute;  
  bottom:40px;  
  right:100px;  
  width:220px;  
  height:220px;  
  touch-action:none;  
}

.lr {
  width:160px !important;
  height:50px !important;
  border-radius:6px !important;
  line-height:50px !important;
  font-size:18px !important;
  background:rgba(255,255,255,0.25) !important;
  border:2px solid rgba(255,255,255,0.6) !important;
}

#btnL { position:absolute; bottom:340px; left:30px; }
#btnR { position:absolute; bottom:340px; right:30px; }

#centerBtns {
  position:absolute;
  bottom:10px;
  left:50%;
  transform:translateX(-50%);
  width:160px;
  height:70px;
}

#btnSelect { left:0; top:0; }
#btnStart { right:0; top:0; }

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

.small {
  width:60px;
  height:60px;
  line-height:60px;
  font-size:14px;
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

// ===== nipplejs =====
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/nipplejs@0.10.1/dist/nipplejs.min.js";
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
    const force = Math.min(data.force || 0, 1);

    // リセット
    gamepadState.up = false;
    gamepadState.down = false;
    gamepadState.left = false;
    gamepadState.right = false;

    // デッドゾーン
    if (force < 0.2) {
      gamepadState.moveX = 0;
      gamepadState.moveY = 0;
      return;
    }

    // アナログ値
    gamepadState.moveX = x * force;
    gamepadState.moveY = y * force;

    // 8方向
    const angle = Math.atan2(y, x) * (180 / Math.PI);

    if (angle >= -22.5 && angle < 22.5) gamepadState.right = true;
    else if (angle < 67.5) { gamepadState.up = true; gamepadState.right = true; }
    else if (angle < 112.5) gamepadState.up = true;
    else if (angle < 157.5) { gamepadState.up = true; gamepadState.left = true; }
    else if (angle >= 157.5 || angle < -157.5) gamepadState.left = true;
    else if (angle < -112.5) { gamepadState.down = true; gamepadState.left = true; }
    else if (angle < -67.5) gamepadState.down = true;
    else { gamepadState.down = true; gamepadState.right = true; }
  });

  joystick.on('end', () => {
    gamepadState.up = false;
    gamepadState.down = false;
    gamepadState.left = false;
    gamepadState.right = false;
    gamepadState.moveX = 0;
    gamepadState.moveY = 0;
  });
};
document.head.appendChild(script);

// ===== ボタン =====
const btnMap = {
  A: document.getElementById("btnA"),
  B: document.getElementById("btnB"),
  X: document.getElementById("btnX"),
  Y: document.getElementById("btnY"),
  start: document.getElementById("btnStart"),
  select: document.getElementById("btnSelect"),
  L: document.getElementById("btnL"),
  R: document.getElementById("btnR")
};

function handlePad(e) {
  const next = {
    A:false,B:false,X:false,Y:false,
    start:false,select:false,L:false,R:false
  };

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

document.addEventListener("touchstart", handlePad, { passive:false });
document.addEventListener("touchmove", handlePad, { passive:false });
document.addEventListener("touchend", handlePad);
document.addEventListener("touchcancel", handlePad);

})();
