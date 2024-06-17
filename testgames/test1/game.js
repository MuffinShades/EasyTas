const can = document.getElementById('c');
const ctx = can.getContext('2d');

var p ={
    x: 0,
    y: 0,
    w: 32,
    h: 32,
    vx: 0,
    vy: 0,
    mu: false,
    md: false,
    mr: false,
    ml: false,
    speed: 5,
    color: 'red',
    update: function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.w,this.h);

        this.x += this.vx;
        this.y += this.vy;

        const sDelta = 1/20;

        if (this.mr && this.vx < this.speed)
            this.vx += this.speed * sDelta;
        if (this.ml && this.vx > -this.speed)
            this.vx -= this.speed * sDelta;
        if (this.md && this.vy < this.speed)
            this.vy += this.speed * sDelta;
        if (this.mu && this.vy > -this.speed)
            this.vy -= this.speed * sDelta;

        if (!this.mr && !this.ml && Math.floor(this.vx*100)/100 > 0)
            this.vx += -Math.sign(this.vx) * sDelta;
        else
            this.vx = 0;

        if (!this.mu && !this.md && Math.floor(this.vy*100)/100 > 0)
            this.vy += -Math.sign(this.vy) * sDelta;
        else
            this.vy = 0;
    }
}

setInterval(function() {
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