import renderBoard from "./renderBoard";

export default function render(gameManager, pOne, pTwo) {
    const pOneDiv = document.querySelector("#player-board");
    const pTwoDiv = document.querySelector("#opponent-board");
    pOne.gameboard.init();

    renderBoard(gameManager, pOne, pOneDiv);
    renderBoard(gameManager, pTwo, pTwoDiv);
}