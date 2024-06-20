//maybe add this later idk
//actually add this cause the css dont work, womp :( womp :((((((( lol
(function() {
    function PARSE_INF(inf) {
        return {
            type: (inf >> 2) & 3, 
            subType: inf & 3,
        }
    }
    var globalTe = null;
    const t = document.querySelectorAll('[resizeable]'), types = ['horizontal', 'vertical'], subTypes = [["left","right"], ["top", "bottom"]];
    
    for (const e of t) {
        var rInfo = e.getAttribute('resize-info');
        if (rInfo == null)
            continue;

        var prInfo = rInfo.split('-');

        if (prInfo.length != 2)
            continue;

        //get types and sub types
        const tyStr = prInfo[0], subTyStr = prInfo[1];
        var type, subType;
        for (var i in types)
            if (types[i] == tyStr) {
                type = parseInt(i);
                break;
            }
        for (var i in types)
            if (subTypes[type][i] == subTyStr) {
                subType = parseInt(i);
                break;
            }
        
        if (typeof type != 'number' || typeof subType != 'number')
            continue;
        //create le drag element based on type
        const de = document.createElement('div');
        //<div class='resize-horizontal-bar' bar-pos='right'></div>
        //set main attributes
        de.setAttribute('class', 'resize-'+types[type]+'-bar');
        de.setAttribute('bar-pos', subTypes[type][subType]);
        de.setAttribute('ninf', ((type & 3) << 2) | (subType & 3));

        //add event listeneres
        de.addEventListener('mousedown', function(_) {
            globalTe = this;
            
            const te = this.parentElement;
            var inf = parseInt(this.getAttribute('ninf'));
            if (inf == NaN) return;
            var pInf = PARSE_INF(inf), box = te.getBoundingClientRect();

            switch (pInf.type) {
                case 0: { //horizontal
                    if (pInf.subType)
                        this.setAttribute('anchor', box.right);
                    break;
                }
                case 1: {
                    if (pInf.subType)
                        this.setAttribute('anchor', box.bottom);
                    break;
                }
            }
        })

        window.addEventListener('mouseup', function(_) {
            globalTe = null;
        })

        window.addEventListener('mousemove', function(e) {
            if (globalTe == null) return;
            
            const self = globalTe;
            const te = self.parentElement, 
                  anchor = parseInt(self.getAttribute('anchor')), 
                  inf = parseInt(self.getAttribute('ninf'));
            if (inf == NaN || anchor == NaN) return; 
            var pInf = PARSE_INF(inf), box = te.getBoundingClientRect();

            switch (pInf.type) {
                case 0: { //horizontal
                    if (pInf.subType) {
                        te.width = e.pageX - box.left;
                        te.style.width = (e.pageX - box.left) + 'px'
                    } else {
                        //TODO maybe add this later, idk dom stuff like this is a pain in the ass
                        //te.x = e.pageX;
                        //te.width = anchor - e.pageX;
                    }
                    break;
                }
                case 1: { //vertical
                    if (pInf.subType) {
                        te.height = e.pageY - box.top;
                        te.style.height = (e.pageY - box.top) + 'px';
                    } else {
                        //TODO maybe add this later, idk dom stuff like this is a pain in the ass
                        //console.log('!');
                        //te.height = e.pageY - box.top;
                        //te.style.height = (e.pageY - box.top) + 'px';
                    }
                    break;
                }
            }
        })

        e.appendChild(de);
    }
})();