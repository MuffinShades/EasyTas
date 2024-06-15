const EasyTas = {
    frameRate: 60,
    intervals: [],
    timeouts: [],
    paused: false,
    globalInterval: null,
    inputTypes: {
        keyDown: 0,
        keyUp: 1,
        mouseDown: 2,
        mouseUp: 3,
        mouseMove: 4
    }
};

EasyTas.setFrameRate = function(r) {
    if (typeof r != 'number') return;

    this.frameRate = r;
    this.frameDelta = 1000 / r;

    if (this.globalInterval != null)
        clearInterval(this.globalInterval);

    this.globalInterval = setInterval(this.update, this.frameDelta);
}

function handleQueue(q, a) {
    q.sort(function(e,r) {
        return e - r;
    })
    while (q.length > 0) {
        a.splice(q.pop(), 1);
        for (var j in q)
            q[j]--;
    }
}

EasyTas.step = function() {
    if (typeof easyTasUpdate == 'function')
        easyTasUpdate();

    //do timeouts
    var _timeOut,i,rQ = [];
    for (i in this.timeouts) {
        _timeOut = this.timeouts[i];
        if (--_timeOut.frames == 0) {
            _timeOut.fn();

            //remove timeout
            rQ.push(i);
        }
    }

    //intervalss
    for (var i of this.intervals) {
        i.ticks--;

        if (i.ticks <= 0) {
            i.ticks = i.maxTicks;
            i.fn();
        }
    }

    this.timeouts = handleQueue(rQ, this.timeouts);
}

EasyTas.setTimeout = function(f, t) {
    if (typeof f != 'function' || typeof t != 'number')
        return;

    let frames = t / (this.frameDelta);

    this.timeouts.push({
        frames: frames,
        fn: f
    });
}

EasyTas.setInterval = function(f, r) {
    if (typeof r != 'number') r = 1;

    if (typeof f == 'function')
        this.intervals.push({
            maxTicks: r,
            ticks: r,
            fn: f
        })
}

EasyTas.simulateInput = function(type, info) {
    switch (type) {

        default: {
            return;
        }
    }
}

EasyTas.pause = function() {
    this.paused = true;
}

EasyTas.update = function() {
    if (!this.paused)
        this.step();
}

window.addEventListener('keydown', function(e) {
    EasyTas.simulateInput(EasyTas.inputTypes.keyDown, e);
})

window.addEventListener('keyup', function(e) {
    EasyTas.simulateInput(EasyTas.inputTypes.keyUp, e);
})

window.addEventListener('mousedown', function(e) {
    EasyTas.simulateInput(EasyTas.inputTypes.mouseDown, e);
})

window.addEventListener('mouseup', function(e) {
    EasyTas.simulateInput(EasyTas.inputTypes.mouseUp, e);
})

window.addEventListener('mousemove', function(e) {
    EasyTas.simulateInput(EasyTas.inputTypes.mouseMove, e);
})