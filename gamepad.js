(function () {

// ===== 状態 =====
window.gamepadState = {
  up:false, down:false, left:false, right:false,
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
  <div id="btnSelect" class="btn small">select</div>
  <div id="btnStart" class="btn small">start</div>
</div>
`);

// ===== CSS（fixed化）=====
const style = document.createElement("style");
style.textContent = `
body {
  margin:0;
  background:transparent;
  overflow:hidden;
}

#zone {
  position:fixed;
  bottom:60px;
  left:60px;
  width:200px;
  height:200px;
  touch-action:none;
}

#pad {  
  position:fixed;  
  bottom:40px;  
  right:100px;  
  width:220px;  
  height:220px;  
  touch-action:none;  
}

/* ===== L R ===== */
.lr {
  width:160px !important;
  height:50px !important;
  border-radius:6px !important;
  line-height:50px !important;
  font-size:18px !important;
  background:rgba(255,255,255,0.25) !important;
  border:2px solid rgba(255,255,255,0.6) !important;
}
.lr.active {
  background: rgba(255,255,255,0.7) !important;
}

#btnL { position:fixed; bottom:340px; left:30px; }
#btnR { position:fixed; bottom:340px; right:30px; }

#pad, #btnL, #btnR, #centerBtns {
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

/* ===== 中央 ===== */
#centerBtns {
  position:fixed;
  bottom:10px;
  left:50%;
  transform:translateX(-50%);
  width:180px;
  height:70px;

  display:flex;
  justify-content:space-between;
  align-items:center;
}

#centerBtns .btn {
  position: static;
}

/* ===== ボタン ===== */
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
  width: 4.4em;
  height: 2.2em;
  line-height: 2.2em;
  font-size:14px;
  border-radius:8px;
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
script.src = "nipplejs.min.js";
script.onload = () => {

  const joystick = nipplejs.create({
    zone: document.getElementById('zone'),
    mode: 'static',
    position: { left: '50%', top: '50%' },
    color: 'white'
    size: 180
  });

  joystick.on('move', (evt, data) => {
    if (!data.vector) return;

    const x = data.vector.x;
    const y = data.vector.y;

    gamepadState.up = y > 0.5;
    gamepadState.down = y < -0.5;
    gamepadState.left = x < -0.5;
    gamepadState.right = x > 0.5;
  });

  joystick.on('end', () => {
    gamepadState.up = false;
    gamepadState.down = false;
    gamepadState.left = false;
    gamepadState.right = false;
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
