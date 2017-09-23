{
    let reversi = new Reversi();

    let PlayerInfo = {
        stone: Math.round(Math.random()) ? Player.black : Player.white,
    };

    let AIInfo = {
        stone: -PlayerInfo.stone
    };

    let conankun = new AI(AIInfo.stone);

    let player_stone_count = document.getElementById("player-stone-count");
    let ai_stone_count = document.getElementById("ai-stone-count");
    let ai_comment = document.getElementById("ai-comment");

    window.onload = function() {
        let currentBoard = reversi.getCurrentBoard();

        BoardRenderer.update(currentBoard, -1, -1);

        player_stone_count.innerHTML = (PlayerInfo.stone === Player.black ? currentBoard.getBlackCount() : currentBoard.getWhiteCount()) + "石";
        ai_stone_count.innerHTML = (AIInfo.stone === Player.black ? currentBoard.getBlackCount() : currentBoard.getWhiteCount()) + "石";
    };

    let main = function (h, v) {
        if (reversi.isFinished) return;
        let mobility = reversi.getCurrentMobility();

        if (mobility.getStateAt(h, v) === GridState.empty) return;

        reversi.putStoneAt(h, v);
        reversi.switchPlayer();

        let currentBoard = reversi.getCurrentBoard();

        BoardRenderer.update(currentBoard, h, v);

        player_stone_count.innerHTML = (PlayerInfo.stone === Player.black ? currentBoard.getBlackCount() : currentBoard.getWhiteCount()) + "石";
        ai_stone_count.innerHTML = (AIInfo.stone === Player.black ? currentBoard.getBlackCount() : currentBoard.getWhiteCount()) + "石";
    };

    BoardRenderer.setCallbackOnRenderingFinished(function () {
        if (!reversi.isFinished && reversi.currentPlayer === AIInfo.stone) {
            ai_comment.innerHTML = "考え中...";

            let currentBoard = reversi.getCurrentBoard();

            let startTime = Date.now();
            let move = conankun.determineNextMove(currentBoard);

            setTimeout(function () {
                main(move.h, move.v);
                ai_comment.innerHTML = conankun.comment || "";
            }, 250 - Date.now() + startTime);
        }
    });

    BoardRenderer.setCallbackOnGridClicked(function (h, v) {
        if (reversi.currentPlayer === PlayerInfo.stone) main(h, v);
    });
}