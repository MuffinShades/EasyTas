const tColors = ['#eee', '#fff'];

function reloadTable() {
    const targets = document.querySelectorAll('.tasInput');
    var i=0,m;
    
    for (const e of targets) {
        m=++i%2;
        e.style.backgroundColor = tColors[m];
    }
}

reloadTable();

var playBtn = document.getElementById('play-btn');

playBtn.addEventListener('click', function() {
    const mode = this.getAttribute('mode');

    if (typeof mode != 'string')
        mode = 0;
    else
        try {
            mode = parseInt(mode);
        } catch {
            mode = 0;
        }

    switch (mode) {
        case 0: {
            EasyTas.play();
            break;
        }
        case 1: {
            EasyTas.pause();
            break;
        }
    }

    //switch mode
    mode = !mode;
    this.setAttribute('mode', mode);

    switch (mode) {
        case 0: {
            this.innerText = 'Play';
            break;
        }
        case 1: {
            this.innerText = 'Pause';
        }
    }
})