let openings = []

function reqListener() {
    openings = this.responseText.split("\n")
    console.log(openings)
    for (const openingFile of openings) {

        if (!openingFile.includes(".yml")) return

        console.log(openings);

        function req2Listener() {
            let opening = jsyaml.load(this.responseText)
            opening.id = openingFile.split('.')[0]
            console.log(opening)
            openingsBox.innerHTML += openingTemplate(opening, openingFile);


            // Setup chess

            let board

            let game = new Chess()


            function makeMove(i = 0, move = null) {
                if (game.game_over()) return
                if (i >= opening.moves.length) return

                let nextMove = null
                if (!move) {
                    let moves = opening.moves[i].split(' ')
                    move = moves[0]
                    nextMove = moves[1]
                    i++
                }
                game.move(move)

                board.position(game.fen())

                window.setTimeout(makeMove, Math.random() * 1000 + 500, i, nextMove)
            }

            board = Chessboard('board' + opening.id, {
                position: 'start',
            })

            //makeMove(index)

            window.setTimeout(makeMove, Math.random() * 1000 + 500)




        }

        const req2 = new XMLHttpRequest();
        req2.addEventListener("load", req2Listener);
        req2.open("GET", "https://tomaskubicek.github.io/thechesstree/data/otevreni/" + openingFile);
        req2.send();

    }
}

const req = new XMLHttpRequest();
req.addEventListener("load", reqListener);
req.open("GET", "https://tomaskubicek.github.io/thechesstree/otevreni.txt");
req.send();

const openingsBox = document.getElementById('openings');

const openingTemplate = (opening, link) => {

    return `
        <a class="d-block text-light link-light text-decoration-none col" href="./detail.html?t=0&f=${link}">
            <article class="card shadow-sm  bg-secondary text-light border">
                <div id="board${opening.id}"></div>
                <div class="card-body">
                    <p class="card-text fs-3 fw-bold">${opening.name}</p>
                    <p>${opening.description}</p>
                </div>
            </article>
        </a>
    `

}