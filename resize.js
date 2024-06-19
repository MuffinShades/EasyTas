//maybe add this later idk
//actually add this cause the css dont work, womp :( womp :((((((( lol
(function() {
    const t = window.querySelectorAll('[resizeable]'), types = ['horizontal', 'vertical', 'all'];

    for (const e of t) {
        var type = e.getAttribute('resizeType');

        if (typeof type != 'string')
            type = 'all';

        for (var i in types)
            if (types[i] == type) {
                type = i;
                break;
            }

        if (typeof type != 'number')
            type = 2; //(all)

        //create le drag element based on type
    }
})();