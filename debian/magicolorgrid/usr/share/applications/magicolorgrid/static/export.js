var get_blob;

function save() {
    "use strict";
    var BB = get_blob();
    var stream = [];
    var inc = 1;
    for (var operation in file["operations"]) {
        var op = file["operations"][operation];
        stream.push('[op' + inc + ']\n');
        stream.push('    operation = "' + operation + '"\n');
        stream.push('    result = "'    + op.result + '"\n');
        stream.push('    color = "'     + op.color  + '"\n\n');
        inc++;
    }
    stream.push('[grid]\n');
    stream.push('    width = '  + file['grid']['width']  + '\n');
    stream.push('    height = ' + file['grid']['height'] + '\n');
    for (var row in file['rows']) {
        stream.push('\n[' + row + ']\n');
        inc = 1;
        for (var col in file['rows'][row]) {
            stream.push(
                '    ' + col + ' = ' + file['rows'][row][col] + '\n'
            );
            inc++;
        }
    }
    saveAs(
        new BB(
            stream, {type: "application/toml;charset=UTF-8"}
        )
        , "file.pixar"
    );
}

(function(view) {
    "use strict";
    get_blob = function() {
        return view.Blob;
    }
}(self));
