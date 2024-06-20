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