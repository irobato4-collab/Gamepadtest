
(function () {

  window.gamepadState = {
    up:false, down:false, left:false, right:false
  };

  document.body.insertAdjacentHTML("beforeend", `
    <div id="zone">
      <div class="hit up"></div>
      <div class="hit down"></div>
      <div class="hit left"></div>
      <div class="hit right"></div>

      <!-- ⭐ 見た目（切られない） -->
      <div class="stick up"></div>
      <div class="stick down"></div>
      <div class="stick left"></div>
      <div class="stick right"></div>
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
      touch-action:none;
    }

    /* ===== 当たり判定（三角） ===== */
    .hit {
      position:absolute;
      width:100%;
      height:100%;
    }

    .up { clip-path: polygon(50% 50%, 0% 0%, 100% 0%); }
    .down { clip-path: polygon(50% 50%, 0% 100%, 100% 100%); }
    .left { clip-path: polygon(50% 50%, 0% 0%, 0% 100%); }
    .right { clip-path: polygon(50% 50%, 100% 0%, 100% 100%); }

    /* ===== 見た目（棒） ===== */
    .stick {
      position:absolute;
      left:50%;
      top:50%;
      background:white;
      opacity:0.5;
      pointer-events:none;
      border-radius:12px;
    }

    .stick.active {
      opacity:1;
    }

    /* ⭐ ここは自由に伸びる */
    .stick.up {
      width:60px;
      height:170px;
      transform:translate(-50%, -100%);
    }

    .stick.down {
      width:60px;
      height:170px;
      transform:translate(-50%, 0%);
    }

    .stick.left {
      width:170px;
      height:60px;
      transform:translate(-100%, -50%);
    }

    .stick.right {
      width:170px;
      height:60px;
      transform:translate(0%, -50%);
    }
  `;
  document.head.appendChild(style);

  const zone = document.getElementById("zone");

  const sticks = {
    up: zone.querySelector(".stick.up"),
    down: zone.querySelector(".stick.down"),
    left: zone.querySelector(".stick.left"),
    right: zone.querySelector(".stick.right")
  };

  function handle(e) {
    const rect = zone.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    gamepadState.up = false;
    gamepadState.down = false;
    gamepadState.left = false;
    gamepadState.right = false;

    Object.values(sticks).forEach(s => s.classList.remove("active"));

    for (let t of e.touches) {
      const x = t.clientX - cx;
      const y = t.clientY - cy;

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

  zone.addEventListener("touchstart", handle, { passive:false });
  zone.addEventListener("touchmove", handle, { passive:false });
  zone.addEventListener("touchend", handle);
})();
