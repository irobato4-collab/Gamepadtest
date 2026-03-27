// mygamepad.js
(function(){
    // 既に追加済みなら何もしない
    if(document.getElementById('gp-container')) return;

    // コンテナ作成
    const container = document.createElement('div');
    container.id = 'gp-container';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.width = '500px';
    container.style.height = '250px';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    // CSS追加
    const style = document.createElement('style');
    style.textContent = `
    #gp-container * { box-sizing: border-box; }
    #gp-container button { border:none; cursor:pointer; transition:0.1s; }
    #gp-container button.gp-active { filter: brightness(140%); }

    /* L/Rボタン */
    #gp-container .gp-lr button {
        position:absolute; width:70px; height:40px; border-radius:0;
        background: rgba(102,102,102,0.5); color:white; font-weight:bold;
    }
    #gp-container .gp-lr #gp-L { left:0; top:20px; }
    #gp-container .gp-lr #gp-R { right:0; top:20px; }

    /* Dパッド透明ボタン */
    #gp-container .gp-dpad button {
        position:absolute; width:52px; height:52px; background:transparent; border:none;
    }
    #gp-container .gp-dpad #gp-up { top:0; left:49px; }
    #gp-container .gp-dpad #gp-down { bottom:0; left:49px; }
    #gp-container .gp-dpad #gp-left { top:49px; left:0; }
    #gp-container .gp-dpad #gp-right { top:49px; right:0; }

    /* Dパッド ✚ダミー */
    #gp-container .gp-dpad .gp-dummy {
        position:absolute; top:0; left:0; width:150px; height:150px;
        pointer-events:none;
    }
    #gp-container .gp-dpad .gp-dummy::before,
    #gp-container .gp-dpad .gp-dummy::after {
        content:''; position:absolute; background: rgba(255,255,255,0.3);
    }
    #gp-container .gp-dpad .gp-dummy::before { top:49px; left:0; width:150px; height:52px; }
    #gp-container .gp-dpad .gp-dummy::after { top:0; left:49px; width:52px; height:150px; }

    /* ABXY 半透明 */
    #gp-container .gp-abxy button {
        position:absolute; width:50px; height:50px; border-radius:50%;
        background: rgba(102,102,102,0.5); color:white; font-weight:bold;
    }
    #gp-container .gp-abxy #gp-A { top:50px; left:100px; }
    #gp-container .gp-abxy #gp-B { top:90px; left:60px; }
    #gp-container .gp-abxy #gp-X { top:10px; left:60px; }
    #gp-container .gp-abxy #gp-Y { top:50px; left:20px; }

    /* Start/Select 半透明 */
    #gp-container .gp-startselect button {
        width:70px; height:40px; border-radius:0; background:rgba(153,153,153,0.5);
        color:black; font-weight:bold; margin:0 10px;
    }
    `;
    document.head.appendChild(style);

    // HTML生成
    container.innerHTML = `
    <div class="gp-lr">
        <button id="gp-L">L</button>
        <button id="gp-R">R</button>
    </div>
    <div class="gp-dpad">
        <button id="gp-up"></button>
        <button id="gp-down"></button>
        <button id="gp-left"></button>
        <button id="gp-right"></button>
        <div class="gp-dummy"></div>
    </div>
    <div class="gp-abxy">
        <button id="gp-A">A</button>
        <button id="gp-B">B</button>
        <button id="gp-X">X</button>
        <button id="gp-Y">Y</button>
    </div>
    <div class="gp-startselect">
        <button id="gp-start">Start</button>
        <button id="gp-select">Select</button>
    </div>
    `;

    // 押下効果
    const gpButtons = container.querySelectorAll("button");
    gpButtons.forEach(btn=>{
        btn.addEventListener("mousedown",()=>btn.classList.add("gp-active"));
        btn.addEventListener("mouseup",()=>btn.classList.remove("gp-active"));
        btn.addEventListener("mouseleave",()=>btn.classList.remove("gp-active"));
    });

})();
