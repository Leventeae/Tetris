var w = 10, h = 20, colors = ['white', 'purple', 'yellow', 'green', 'blue', 'red', 'orange'];
var pieces = [
    [
        [1, 1],
        [1, 1]
    ],
    [
        [0, 0, 0],
        [2, 2, 2],
        [0, 0, 0]
    ],
    [
        [0, 0, 0],
        [0, 3, 3],
        [3, 3, 0]
    ],
    [
        [0, 0, 0],
        [4, 4, 0],
        [0, 4, 4]
    ],
    [
        [0, 0, 0],
        [5, 0, 0],
        [5, 5, 5]
    ],
    [
        [0, 0, 0],
        [0, 0, 6],
        [6, 6, 6]
    ]
];

function init() {
    var field = [];
    var table = document.getElementById('t');
    for (var i = 0; i < h; i++) {
        var tr = document.createElement('tr');
        var row = [];
        for (var j = 0; j < w; j++) {
            var td = document.createElement('td');
            td.classList.add('cell');
            row.push({value: 0, element: td});
            tr.appendChild(td);
        }
        field.push(row);
        table.appendChild(tr);
    }
    return field;
}

function draw(field, piece, pX, pY) {
    function drawCell(field, x, y, c) {
        field[y][x].element.style.backgroundColor = colors[c];
    }
    for (var y = 0; y < field.length; y++) {
        var row = field[y];
        for (var x = 0; x < row.length; x++) {
            drawCell(field, x, y, row[x].value);
        }
    }
    for (var y = 0; y < piece.length; y++) {
        var row = piece[y];
        for (var x = 0; x < row.length; x++) {
            if (row[x] > 0) {
                let newX = pX + x;
                let newY = pY + y;
                if (newX >= 0 && newX < w && newY >= 0 && newY < h) {
                    drawCell(field, newX, newY, row[x]);
                }
            }
        }
    }
}

function validPosition(field, piece, pX, pY) {
    for (var y = 0; y < piece.length; y++) {
        var row = piece[y];
        for (var x = 0; x < row.length; x++) {
            if (row[x] > 0) {
                if (pX + x < 0 || pX + x >= w || pY + y >= h || (pY + y >= 0 && field[pY + y][pX + x].value > 0)) {
                    return false;
                }
            }
        }
    }
    return true;
}

function putPiece(field, piece, pX, pY) {
    for (var y = 0; y < piece.length; y++) {
        var row = piece[y]
        for (var x = 0; x < row.length; x++) {
            if (row[x] > 0) field[pY + y][pX + x].value = row[x]
        }
    }
}

function ClearLines(field) {
    function fullRow(row) {
        return row.every(function(e) {return e.value > 0})
    }
    function moveDown(field, y) {
        for (var x = 0; x < w; x++) field[y][x].value = field[y - 1][x].value
    }
    for (var y = h - 1; y > 0; y--) {
        if (fullRow(field[y])) {
            for (yy = y; yy > 0; yy--) moveDown(field, yy)
        }
    }
}

function rotate(piece) {
    var p = []
    var size = piece.length
    for (var x = 0; x < size; x++) {
        p.push([])
        for (var y = 0; y < size; y++) {
            p[x].push(piece[size - y - 1][x])
        }
    }
}

function game() {
    var field = init();
    var piece, pX, pY;
    var int = setInterval(function() {
        if (!piece) {
            piece = pieces[Math.floor(Math.random() * pieces.length)];
            pX = Math.floor(w / 2) - Math.floor(piece[0].length / 2);
            pY = 0;
            if (!validPosition(field, piece, pX, pY)) {
                clearInterval(int)
                alert('Game Over!')
                window.location.reload()
            }
        }
        if (validPosition(field, piece, pX, pY + 1)) {
            pY++;
        } else {
            putPiece(field, piece, pX, pY)
            piece = null;
        }
        draw(field, piece, pX, pY);
    }, 300)
    document.addEventListener("keydown", function(e) {
        if (e.keyCode == 37 && validPosition(field, piece, pX-1, pY)) pX--
        if (e.keyCode == 39 && validPosition(field, piece, pX + 1, pY)) pX++
        if (e.keyCode == 32) {
            while (validPosition(field, piece, pX, pY + 1)) pY++
        }
        if (e.keyCode == 38) {
            var p = rotate(piece)
            if (validPosition(field, p, pX, pY)) piece = p
        }
    })
}
game();