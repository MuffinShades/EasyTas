/**
 *
 * Easy tas tassing library
 * 
 * Written by muffinshades
 * 
 * This library is for use in games and sets up the
 * proper enviroment for tassing games
 *
 */

const EasyTas = {
    frameRate: 60,
    intervals: [],
    timeouts: [],
    paused: false,
    globalInterval: null,
    globalCanvas: null,
    scripts: [],
    inpQueue: [],
    inps: [],
    tasStep: 0,
    frameStep: 0,
    inputTypes: {
        keyDown: 0,
        keyUp: 1,
        mouseDown: 2,
        mouseUp: 3,
        mouseMove: 4
    },
    listeners: {},

    //library functions
    reset: null,
    setFrameRate: null,
    step: null,
    setTimeout: null,
    setInterval: null,
    export: null,
    runTas: null,
    decodeExport: null,
    import: null,
    multiSimulateInps: null,
    simulateInput: null,
    setGlobalCanvas: null,
    getGlobalCanvas: null,
    pause: null,
    play: null,
    update: null,
    addScript: null,
    setInputs: null,
    dispatchEvent: null,
    addEventListener: null
};

//B64
var b64 = {
    table: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/+',
    paddingData: '==',
    bitCombine: function(bits, i, len) {
      var r = 0;
      for (var j = 0; j < len; j++) { //basically just collects all the bits into a int / long
        r |= bits[i++];
        r <<= 1;
      }
      return r >> 1;
    },
    addPadding: function(dat) {
        return dat + this.paddingData;
    },
    encode: function(dat) {
      var res = "";

      //remove padding if present
      if (dat.length >= this.paddingData.length) {
        if (dat.substring(dat.length-this.paddingData.length) == this.paddingData)
            dat = dat.sbustring(0,dat.length-this.paddingData.length);
      }
      
      var bits = [],v = null;
      
      //extract all the bits from the bytes to encode
      for (var i = 0; i < dat.length; i++) { //cant use of :/
        v = dat[i];
        for (var b = 0; b < 8; b++) {
          bits.push(
            (v >> b) 
            & 1
          );
        }
      }
      
      //combine the bits into 6 bit chunks from 0-64 and index a table to get the character
      for (i = 0; i < bits.length; i += 6) {
        var cmax = i >= bits.length ? 6 - (i - bits.length) : 6;
        res += this.table[
          this.bitCombine(bits, i, cmax)
        ];
      }
      return res;
    },
    decode: function(dat, padding) {
      var bits = [];
      var v;

      if (typeof padding == typeof void 0)
        padding = true;
      
      //collect all the bytes
      for (var i = 0; i < dat.length; i ++) {
        v = this.table.indexOf(dat[i]); //opposite of the prior table indexing
        for (var b = 0; b < 6; b++)
          bits.push(
            (v >> (5-b)) & 1  
          );
      }
      
      var res = [];
      
      //now assemble as bytes instead of 6 bit chunks
      var val = 0;
      for (var b = 0; b < bits.length; b += 8) {
        val = 0;
        var cmax = b >= bits.length ? 8 - (b - bits.length) : 8;
        for (var j = 0; j < cmax; j++) {
          val |= (bits[b+j] << j);
        }
        res.push(val);
      }

      if (padding) res = this.applyPadding(res);
      
      return res;
    }
  };
  
  //Binary utility functions
  var bin = {
    combineBytes: function(bytes, i, sz) {
      var r = 0;
      
      for (var b = i+sz-1; b >= i;) {
        r |= bytes[b--];
        r <<= 8;
      }
      
      return r >> 8;
    },
    intSplit: function(v, sz) {
      var r = [];
      
      for (var i = 0; i < sz; i++) {
        r.push(v & 255);
        v >>= 8;
      }
      
      return r;
    }
  };

const _DOM = document.createElement('div');

EasyTas.addScript = function(sc) {
    if (typeof sc != typeof _DOM)
        return;

    if (sc.tagName == 'script')
        this.scripts.push({
            dom: sc,
            src: sc.src
        })
}

EasyTas.reset = function() {
    //reload all scripts
    for (var s of this.scripts) {
        if (typeof s != 'object')
            continue;

        s.dom.remove();
        var eClone = document.createElement('script');
        eClone.src = s.src;
        document.body.appendChild(s);
    }

    this.tasStep = 0;
    this.frameStep = 0;
}

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
        return r - e;
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

    //input simulation
    while (this.inps[0].frame <= this.frameStep) {
        const i = this.inps.shift();
        this.simulateInput(i);
    }

    this.frameStep++;
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

EasyTas.export = function(inps) {

}

EasyTas.runTas = function(tas) {
    this.setInputs(inps);
}

EasyTas.setInputs = function(inps) {
    this.inps = [];

    //input assertion / validaity
    for (var i of inps) {
        if (
            typeof i != 'object' ||
            typeof i.frame != 'number' ||
            i.frame < 0
        ) continue;

        if (typeof i.duration != 'number')
            i.duration = 1;

        this.inps.push(i);
    }

    //sort inputs
    this.inps.sort(function(a, b) {
        return a.frame - b.frame;
    })
}

EasyTas.multiSimulateInps = function(inps) {
    if (typeof inps != 'object')
        return;

    try {
        for (const i of inps) {
            if (typeof i != 'object' || i.inputType == void 0 || i.e == void 0)
                continue;

            this.simulateInput(
                i.inputType,
                i.e
            );
        }
    } catch {
        //basically cant interate
        return;
    }
}

EasyTas.simulateInput = function(type, info) {
    switch (type) {
        case EasyTas.inputTypes.keyDown: {
            if (typeof easyTas_keyDown == 'function')
                easyTas_keyDown(info);
            break;
        }
        case EasyTas.inputTypes.keyUp: {
            if (typeof easyTas_keyUp == 'function')
                easyTas_keyUp(info);
            break;
        }
        case EasyTas.inputTypes.mouseDown: {
            if (typeof easyTas_mouseDown == 'function')
                easyTas_mouseDown(info);
            break;
        }
        case EasyTas.inputTypes.mouseUp: {
            if (typeof easyTas_mouseUp == 'function')
                try {
                    easyTas_mouseUp(info);
                } catch {
                    console.error('Could not dispatch event EasyTas.inputTypes.mouseUp');
                }
            break;
        }
        case EasyTas.inputTypes.mouseMove: {
            if (typeof easyTas_mouseMove == 'function')
                try {
                    easyTas_mouseMove(info);
                } catch {
                    console.error('Could not dispatch event EasyTas.inputTypes.mouseMove');
                }
            break;
        }
        default: {
            return;
        }
    }
}

function createKeyEvent(key, mode) {
    var e = new KeyboardEvent(mode);

    e.key = key;
}

EasyTas.addEventListener = function(ty, fn) {
    if (typeof ty != 'string' || typeof fn != 'function')
        return;

    if (typeof this.listeners[ty] != 'object')
        this.listeners[ty] = [];

    this.listeners[ty].push(fn);
}

EasyTas.dispatchEvent = function(ty, inf) {
    if (typeof this.listeners[ty] == 'object') {
        for (var f of this.listeners[ty])
            f(inf);
    }
}

EasyTas.setGlobalCanvas = function(c) {
    if (c)
        this.globalCanvas = c;
}

EasyTas.getGlobalCanvas = function() {
    if (this.globalCanvas != null)
        return this.globalCanvas;

    this.globalCanvas = document.createElement('canvas');
    document.body.appendChild(this.globalCanvas);
}

EasyTas.pause = function() {
    this.paused = true;
}

EasyTas.play = function() {
    this.paused = false;
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

//called each frame
EasyTas.update = function() {
    if (!this.paused)
        this.step();
}