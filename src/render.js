import renderBoard from "./renderBoard";

export default function render(pOne, pTwo) {
    const pOneDiv = document.querySelector("#player-board");
    const pTwoDiv = document.querySelector("#opponent-board");
    pOne.init();

    renderBoard(pOne, pOneDiv);
    renderBoard(pTwo, pTwoDiv);
}