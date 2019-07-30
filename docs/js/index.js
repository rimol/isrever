﻿import { Player, Reversi, flipState } from './reversi.js';
import { BoardCanvas } from './render.js';
import { Engine } from './engine.js';

function reverseString(str) {
    return str.split("").reverse().join("");
}

!function () {
    let currentReversi = new Reversi();
    let winNum = 0;
    let humanColor = Player.black;
    currentReversi.isOver = true;

    function newGame() {
        currentReversi = new Reversi();
        humanColor = Player.black;
        BoardCanvas.render(currentReversi);
    }

    async function onCOMTurn() {
        let move = await Engine.chooseBestMove(currentReversi);

        if (!currentReversi.isLegalMove(move.x, move.y, currentReversi.player)) {
            throw "Engineが不正な手を打ちました";
        }

        currentReversi.move(move.x, move.y);
        BoardCanvas.render(currentReversi);
    }

    BoardCanvas.onRenderingFinished(() => {
        if (!currentReversi.isOver && currentReversi.player === flipState(humanColor)) onCOMTurn();
    });

    BoardCanvas.onTryingToPlaceStoneAt((x, y) => {
        if (!currentReversi.isOver && currentReversi.player === humanColor && currentReversi.isLegalMove(x, y, currentReversi.player)) {
            currentReversi.move(x, y);
            BoardCanvas.render(currentReversi);
        }
    });

    Engine.onReady(newGame);
}();