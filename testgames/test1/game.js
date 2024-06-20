const can = document.getElementById('c');
const ctx = can.getContext('2d');

var p ={
    x: 0,
    y: 0,
    w: 24,
    h: 24,
    vx: 0,
    vy: 0,
    mu: false,
    md: false,
    mr: false,
    ml: false,
    speed: 5,
    color: 'red',
    update: function() {
        const sDelta = 1;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.w,this.h);

        this.x += this.vx;
        this.y += this.vy;

        if (this.mr && this.vx < this.speed)
            this.vx += this.speed * sDelta;
        if (this.ml && this.vx > -this.speed)
            this.vx -= this.speed * sDelta;
        if (this.md && this.vy < this.speed)
            this.vy += this.speed * sDelta;
        if (this.mu && this.vy > -this.speed)
            this.vy -= this.speed * sDelta;

        if (!this.mr && !this.ml && Math.abs(Math.floor(this.vx*10)/10) > 0)
            this.vx += -Math.sign(this.vx) * sDelta;
        else if (!this.mr && !this.ml)
            this.vx = 0;

        if (!this.mu && !this.md && Math.abs(Math.floor(this.vy*10)/10) > 0)
            this.vy += -Math.sign(this.vy) * sDelta;
        else if (!this.mu && !this.md)
            this.vy = 0;
    }
}

can.style = 'position: absolute; top: 0; left: 0;';

EasyTas.setInterval(function() {
    can.width = document.documentElement.clientWidth;
    can.height = document.documentElement.clientHeight;
    p.update();
}, 1000/60);

window.addEventListener('keydown', function(e) {
    switch (e.key.toLowerCase()) {
        case 'w': {
            p.mu = true;
            break;
        }
        case 'a': {
            p.ml = true;
            break;
        }
        case 's': {
            p.md = true;
            break;
        }
        case 'd': {
            p.mr = true;
            break;
        }
    }
})

window.addEventListener('keyup', function(e) {
    switch (e.key.toLowerCase()) {
        case 'w': {
            p.mu = false;
            break;
        }
        case 'a': {
            p.ml = false;
            break;
        }
        case 's': {
            p.md = false;
            break;
        }
        case 'd': {
            p.mr = false;
            break;
        }
    }
})