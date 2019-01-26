var operations = {};

function give_svg(color) {
    return 'cursor: url(\'data:image/svg+xml;utf8,'
    + '<svg xmlns=\"http://www.w3.org/2000/svg" width="48" viewBox="0 0 48 48" height="48" fill="%23FF0000">'
        + '<g>'
            + '<path d="M12.969 37.238s1.472.068 1.97.412c.496.343.952 1.02.952 1.02L30.877 15.43l6.915-12.766C37.365.623 36.04.415 34.423.89L25.9 13.497z" '
            + 'fill="' + color + '" stroke-width=".03103"/>'
            + '<path d="M15.427 41.06c-1.135 3.718-3.05 4.639-6.212 5.514 0 0 1.167-1.171 1.371-2.302.204-1.131-1.248-2.017-.724-3.972.525-1.956 '
            + '1.844-2.438 2.898-2.352 1.953.16 2.993.846 2.667 3.112z" fill="' + color + '" stroke-width=".0313403"/>'
        + '</g>'
    + '</svg>\') 30 30, auto;';
}

function closeDialog(element) {
    "use strict";
    element.closest('.dialog').classList.add('hidden');
    document.getElementsByTagName('body')[0].classList.remove('mask');
}

function chooseGrid() {
    "use strict";
    document.getElementsByTagName('body')[0].classList.add('mask');
    var dialog = document.getElementById('create-grid-dialog');
    dialog.classList.remove('hidden');
    if (!document.getElementById('grid'))
        return;
    document.getElementById('create-warning').classList.remove('hidden');
}

function createGrid() {
    "use strict";
    document.getElementById('button-print').removeAttribute('disabled');
    document.getElementsByTagName('body')[0].classList.remove('mask');
    var dialog = document.getElementById('create-grid-dialog');
    dialog.classList.add('hidden');
    dialog.classList.remove('create');
    if (document.getElementById('grid')) {
        var grid = document.getElementById('grid');
        grid.parentNode.removeChild(grid);
    }
    var x = parseInt(document.getElementById('nb-lines').value);
    var y = parseInt(document.getElementById('nb-columns').value);
    var table = document.createElement('table');
    table.id  = 'grid';
    for (var i = 0; i < y; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < x; j++) {
            var td = document.createElement('td');
            td.setAttribute('onclick', 'getFocusOnTd(this)');
            var input = document.createElement('input');
            input.classList.add('input-operation');
            input.classList.add('hidden');
            input.setAttribute('onfocus', 'setOperation(this)');
            input.setAttribute('onfocusout', 'confirmOperation(this)');
            td.appendChild(input);
            var span = document.createElement('span');
            span.classList.add('hidden');
            td.appendChild(span);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.getElementById('grid-container').appendChild(table);
}

function getFocusOnTd(element) {
    "use strict";
    if (colorSelection) {
        element.setAttribute(
            "style",
            "background-color:" + colorSelection.color
        );
        element.classList.add('td-' + colorSelection.result);
        var operationNode = element.childNodes[1];
        operationNode.innerText = colorSelection.operation;
        operationNode.classList.remove('hidden');
        return;
    }
    var inputs = document.getElementsByClassName('input-operation');
    for (var i = 0, len = inputs.length; i < len; i++) {
        inputs[i].classList.add('hidden');
    }
    var input = element.childNodes[0];
    var span  = element.childNodes[1];
    input.classList.remove('hidden');
    span.classList.add('hidden');
    input.focus();
}

function setOperation(element) {
    "use strict";
    element.nextSibling.classList.add('hidden');
}

function chooseColor(element) {
    "use strict";
    colorSelection = {
        color:     element.getAttribute("data-color"),
        operation: element.getAttribute("data-operation"),
        result:    element.getAttribute("data-result")
    };
    document.getElementsByTagName('body')[0].setAttribute(
        'style',
        give_svg(colorSelection.color)
    );
}

function changeColor(element, color) {
    "use strict";
    color = color.rgbaString;
    element.setAttribute(
        "style", "background-color:" + color
    );
    var result    = element.previousSibling.textContent;
    var operation = element.previousSibling.previousSibling.textContent;
    element.setAttribute('data-color', color);
    var new_color = document.getElementById(
        'color-chooser-' + result
    );
    new_color.setAttribute("style", "background-color:" + color);
    new_color.setAttribute("data-color", color);
    var printedColor = document.getElementById(
        'print-color-' + result
    );
    printedColor.setAttribute("style", "background-color:" + color);
    var cases = document.getElementsByClassName('td-' + result);
    operations[operation] = color;
    for (var i = 0; i < cases.length; i++) {
        cases[i].setAttribute(
            "style",
            "background-color:" + color
        );
    }
    colorSelection = null;
    document.getElementsByTagName('body')[0].setAttribute('style', '');
}

function confirmOperation(element) {
    "use strict";
    if (colorSelection)
        return;
    document.getElementById('sidebar').classList.remove('hidden');
    element.classList.add('hidden');
    element.nextSibling.classList.remove('hidden');
    var operation = element.value.replace(' ', '').replace('*', ' x ');
    var str = element.value.replace('/[^-()\d/*+.]/g', '');
    str     = str.replace('x', '*');
    var result = eval(str);
    element.nextSibling.innerHTML = operation;
    var tdNode = element.parentNode;
    if (operation in operations) {
        tdNode.className = "";
        tdNode.classList.add('td-' + result);
        tdNode.setAttribute(
            "style",
            "background-color:" + operations[operation]
        );
        return;
    }
    if (!result)
        return;
    tdNode.classList = '';
    tdNode.classList.add('td-' + result);
    var color = random_colors();
    operations[operation] = color;

    element.parentNode.setAttribute("style", "background-color:" + color);

    var tableRef = document.getElementById('operation-grid').getElementsByTagName('tbody')[0];
    var newRow   = tableRef.insertRow(tableRef.rows.length);

    var operationCell  = newRow.insertCell(0);
    operationCell.classList.add('select');
    operationCell.setAttribute('onclick', 'setOperation(this)');
    var operationText  = document.createTextNode(operation);
    operationCell.appendChild(operationText);

    var resultCell = newRow.insertCell(1);
    var resultText    = document.createTextNode(result);
    resultCell.appendChild(resultText);

    var colorCell = newRow.insertCell(2);
    colorCell.classList.add('select');
    element.parentNode.setAttribute(
        "style",
        "background-color:" + color
    );
    colorCell.setAttribute("style", "background-color:" + color);
    colorCell.setAttribute('data-color', color);
    var popupPicker = new Picker({
        parent: colorCell,
        popup: 'left',
        color: color,
        alpha: false
    });
    popupPicker.onDone = function(color) {
        changeColor(colorCell, color);
    };
    colorCell.onclick = function(e) {
        popupPicker.show();
    };

    var colorChooser = document.getElementById("color-chooser");
    var new_color = document.createElement("span");
    new_color.id  = 'color-chooser-' + result;
    new_color.classList.add('select');
    new_color.setAttribute("style", "background-color:" + color);
    new_color.setAttribute("data-color", color);
    new_color.setAttribute("data-operation", operation);
    new_color.setAttribute("data-result", result);
    new_color.setAttribute("onclick", "chooseColor(this);");
    colorChooser.appendChild(new_color);

    var printColors = document.getElementById("color-operation");
    var colorOperation = document.createElement("div");
    colorOperation.classList.add('color-operation');
    colorOperation.id = 'print-color-' + result;
    colorOperation.setAttribute("style", "background-color:" + color);
    var text = document.createTextNode(result);
    colorOperation.appendChild(text);
    printColors.appendChild(colorOperation);
}

function setOperation(element) {
    "use strict";
    
}

function disableBross() {
    "use strict";
    colorSelection = null;
    document.getElementsByTagName('body')[0].setAttribute('style', '');
}
