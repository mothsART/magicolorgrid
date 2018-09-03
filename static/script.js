var palette = [
  ["#000"   , "#444"   , "#666"   , "#999"   , "#ccc"   , "#eee"   , "#f3f3f3", "#fff"],
  ["#f00"   , "#f90"   , "#ff0"   , "#0f0"   , "#0ff"   , "#00f"   , "#90f"   , "#f0f"],
  ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
  ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
  ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
  ["#c00"   , "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
  ["#900"   , "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
  ["#600"   , "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
];

var colors = []
for (var i = 0; i < palette.length; i++) {
  for (var j = 0; j < palette[i].length; j++) {
    colors.push(palette[i][j]);
  }
}

var remaining_colors = [];
var operations = [];

function random_colors() {
    "use strict";
    if (remaining_colors.length == 0)
        remaining_colors = colors;
    var new_value = colors[parseInt(Math.random() * remaining_colors.length)];
    var index = remaining_colors.indexOf(new_value);
    remaining_colors.splice(index, 1);
    return new_value;
}

function createGrid(x, y) {
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
            var div = document.createElement('div');
            div.classList.add('hidden');
            td.appendChild(div);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.getElementById('grid-container').appendChild(table);
}

function getFocusOnTd(element) {
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
    element.nextSibling.classList.add('hidden');
}

function confirmOperation(element) {
    element.classList.add('hidden');
    element.nextSibling.classList.remove('hidden');
    var operation = element.value.replace(' ', '').replace('*', ' x ');
    element.nextSibling.innerHTML = operation;
    if (operations.indexOf(operation) === -1) {
        operations.push(operation);
        var tableRef = document.getElementById('operation-grid').getElementsByTagName('tbody')[0];
        var newRow   = tableRef.insertRow(tableRef.rows.length);
        
        var operationCell  = newRow.insertCell(0);
        var operationText  = document.createTextNode(operation);
        operationCell.appendChild(operationText);
        
        var str = element.value.replace('/[^-()\d/*+.]/g', '');
        str     = str.replace('x', '*');
        var resultCell = newRow.insertCell(1);
        var resultText    = document.createTextNode(eval(str));
        resultCell.appendChild(resultText);
        
        var colorCell = newRow.insertCell(2);
        colorCell.setAttribute("style", "background-color:" + random_colors());
    }
}
