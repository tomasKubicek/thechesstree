let endings = []

function reqListener() {
    endings = this.responseText.split("\n")
    console.log(endings)
    for (const endingFile of endings) {

        if (!endingFile.includes(".yml")) return

        console.log(endings);

        function req2Listener() {
            let ending = jsyaml.load(this.responseText)
            ending.id = endingFile.split('.')[0]
            console.log(ending)
            endingsBox.innerHTML += endingTemplate(ending);


            // Setup chess

            let board

            let game = new Chess()
            game.load(ending.start)


            function makeMove(i = 0, move = null) {
                if (game.game_over()) return
                if (i >= ending.moves.length) return

                let nextMove = null
                if (!move) {
                    let moves = ending.moves[i].split(' ')
                    move = moves[0]
                    nextMove = moves[1]
                    i++
                }
                game.move(move)

                // exit if the game is over
                if (game.game_over()) return

                board.position(game.fen())

                window.setTimeout(makeMove, Math.random() * 1000 + 500, i, nextMove)
            }

            board = Chessboard('board' + ending.id, {
                position: ending.start,
                orientation: ending.start.includes(' b ') ? 'black' : 'white'
            })

            //makeMove(index)

            window.setTimeout(makeMove, Math.random() * 1000 + 500)




        }

        const req2 = new XMLHttpRequest();
        req2.addEventListener("load", req2Listener);
        req2.open("GET", "https://tomaskubicek.github.io/thechesstree/data/koncovky/" + endingFile);
        req2.send();

    }
}

const req = new XMLHttpRequest();
req.addEventListener("load", reqListener);
req.open("GET", "https://tomaskubicek.github.io/thechesstree/koncovky.txt");
req.send();

const endingsBox = document.getElementById('endings');

const endingTemplate = (ending) => {

    return `
        <div class="col">
            <div class="card shadow-sm">
                <div id="board${ending.id}"></div>
                <div class="card-body">
                    <p class="card-text fs-3 fw-bold">${ending.name}</p>
                    <p>${ending.description}</p>
                </div>
            </div>
        </div>
    `

}