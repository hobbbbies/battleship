export default class RenderUtils {
    static disableBoard(boardDiv) {
        boardDiv.style.pointerEvents = "none";
    }

    static enableBoard(boardDiv) {
        boardDiv.style.pointerEvents = "auto";
    } 

    static initDisable(pOneDiv, pTwoDiv) {
        RenderUtils.disableBoard(pOneDiv);
        RenderUtils.disableBoard(pTwoDiv);
    }
    
}