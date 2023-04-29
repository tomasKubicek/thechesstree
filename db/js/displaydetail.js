let params = new URLSearchParams(window.location.search)

let file = params.get('f')
console.log(file);
let type = parseInt(params.get('t')) // 0 = opening, 1 = ending
console.log(type);



function showBoard() {

    let autoplay = true

    let ending = jsyaml.load(this.responseText)

    // Setup chess

    let board

    let game = new Chess()

    if (ending.start) game.load(ending.start)

    let currentMove = [0, -1]

    function makeMove(i = 0, move = null) {
        if (!autoplay) return
        if (game.game_over()) return
        if (i >= ending.moves.length) return

        let nextMove = null
        if (!move) {
            let moves = ending.moves[i].split(' ')
            move = moves[0]
            nextMove = moves[1]
            i++
            currentMove = [i, 0]
        } else {
            currentMove = [i, 1]
        }
        game.move(move)

        board.position(game.fen())

        window.setTimeout(makeMove, Math.random() * 1000 + 500, i, nextMove)
    }

    board = Chessboard('board', {
        position: ending.start || 'start',
        orientation: ending.start ? (ending.start.includes(' b ') ? 'black' : 'white') : 'white'
    })

    //makeMove(index)

    window.setTimeout(makeMove, Math.random() * 1000 + 500)

    document.querySelector('#gamename').innerHTML = ending.name
    document.querySelector('#gamedesc').innerHTML = ending.description
    document.querySelector('#gamemoves').innerHTML = "Tahy: &nbsp;" + ending.moves.join('&nbsp;,&nbsp;')
    if (ending.start) {
        document.querySelector('#gamefen').innerHTML = "FEN: &nbsp;\"" + ending.start + "\""
        document.querySelector('#gamefen').style.display = 'block'
    }

    function disAutoPlay(game, board) {
        if (autoplay) {
            autoplay = false
            currentMove = [0, -1]
            game.reset()
        }
    }

    document.querySelector('#tostart').addEventListener('click', () => {
        disAutoPlay(game, board)
        currentMove = [0, -1]
        if (ending.start) game.load(ending.start)
        else game.reset()
        board.position(game.fen())
    })

    document.querySelector('#forwards').addEventListener('click', () => {
        disAutoPlay(game, board)
        if (currentMove[0] >= ending.moves.length) return
        if (currentMove[1] >= ending.moves[currentMove[0]].split(' ').length) return
        if (currentMove[1] == 1) {
            currentMove[0]++;
            currentMove[1] = 0;
        } else {
            currentMove[1]++;
        }
        game.move(ending.moves[currentMove[0]].split(' ')[currentMove[1]])
        board.position(game.fen())
    })

    document.querySelector('#backwards').addEventListener('click', () => {
        disAutoPlay(game, board)
        if (currentMove.toString() == [0, -1].toString()) return
        if (currentMove.toString() == [0, 0].toString()) currentMove = [0, -1]
        else if (currentMove[1] == 0) {
            currentMove[0]--;
            currentMove[1] = 1;
        } else {
            currentMove[1]--;
        }
        game.undo()
        board.position(game.fen())
    })

}



const req = new XMLHttpRequest();
req.addEventListener("load", showBoard);
req.open("GET", "https://chess.webytom.cz/data/" + (type ? 'koncovky' : 'otevreni') + "/" + file);
req.send();