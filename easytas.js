const EasyTas = {
    frameRate: 60,
    intervals: [],
    timeouts: [],
};

EasyTas.setFrameRate = function(r) {
    if (typeof r != 'number') return;

    this.frameRate = r;
    this.frameDelta = 1000 / r;
}

EasyTas.step = function() {
    if (typeof easyTasUpdate == 'function')
        easyTasUpdate();

    //do timeouts
    for (var _timeOut of this.timeouts) {
        if (--_timeOut.frames == 0) {
            _timeOut.fn();

            //remove timeout
        }
    }
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
