function load_file(stream) {
    "use strict";
    var c = marktytoml(stream);
    newGrid(c.grid.width, c.grid.height);
    for (var i = 1, lenI = c.grid.height + 1; i < lenI; i++) {
        if (('row' + i) in c) {
            for (var j = 0, lenJ = c.grid.width + 1; j < lenJ; j++) {
                if (('col' + j) in c['row' + i ]) {
                    var tdNode = document.getElementById(
                        'row-' + i + '-col-' + j
                    );
                    var conf = c[c['row' + i]['col' + j]];
                    confirmOperation(
                        conf.operation,
                        tdNode,
                        conf.result,
                        conf.color
                    );
                }
            }
        }
    }
}

function load_example(url, name) {
  "use strict";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            load_file(xmlhttp.responseText);
        }
    }
    xmlhttp.send();
}
