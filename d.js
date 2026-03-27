// mygamepad.js
(function(){
    if(document.getElementById('gp-container')) return;

    const container = document.createElement('div');
    container.id = 'gp-container';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.width = '250px';
    container.style.height = '250px';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    const style = document.createElement('style');
    style.textContent = `
        #gp-container * { box-sizing: border-box; }
        #gp-container button { border:none; cursor:pointer; transition:0.1s; }

        /* LR */
        #gp-container .gp-lr button {
            position:absolute; width:50px; height:30px; border-radius:0;
            background: rgba(102,102,102,0.5); color:white; font-weight:bold;
        }
        #gp-L { left:0; top:0; }
        #gp-R { right:0; top:0; }

        /* Dpad */
        #gp-container .gp-dpad { position:absolute; left:10px; bottom:60px; width:80px; height:80px; }
        #gp-container .gp-dpad button { position:absolute; width:25px; height:25px; background:transparent; }
        #gp-up { top:0; left:27px; }
        #gp-down { bottom:0; left:27px; }
        #gp-left { top:27px; left:0; }
        #gp-right { top:27px; right:0; }

        /* Dpad ✚ダミー */
        .gp-dummy {
            position:absolute; top:0; left:0; width:80px; height:80px; pointer-events:none;
        }
        .gp-dummy::before, .gp-dummy::after {
            content:''; position:absolute; background: rgba(255,255,255,0.3);
        }
        .gp-dummy::before { top:27px; left:0; width:80px; height:25px; }
        .gp-dummy::after { top:0; left:27px; width:25px; height:80px; }

        /* ABXY */
        #gp-container .gp-abxy button {
            position:absolute; width:30px; height:30px; border-radius:50%;
            background: rgba(102,102,102,0.5); color:white; font-weight:bold;
        }
        #gp-A { bottom:40px; right:10px; }
        #gp-B { bottom:10px; right:40px; }
        #gp-X { bottom:70px; right:40px; }
        #gp-Y { bottom:40px; right:70px; }

        /* Start/Select */
        #gp-container .gp-startselect button {
            width:40px; height:20px; border-radius:0; background:rgba(153,153,153,0.5);
            color:black; font-weight:bold; margin:0 5px;
            position:absolute; bottom:0; left:50%; transform:translateX(-50%);
        }
    `;
    document.head.appendChild(style);

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

    const gpButtons = container.querySelectorAll("button");
    gpButtons.forEach(btn=>{
        btn.addEventListener("mousedown", ()=>{
            btn.classList.add("gp-active");
            // カスタムイベント発火
            document.dispatchEvent(new CustomEvent(btn.id + "-pressed"));
        });
        btn.addEventListener("mouseup", ()=> btn.classList.remove("gp-active"));
        btn.addEventListener("mouseleave", ()=> btn.classList.remove("gp-active"));
    });

})();
