export default class RenderUtils {
    static disableBoard(boardDiv) {
        boardDiv.style.pointerEvents = "none";
        boardDiv.style.opacity = "50%";
    }

    static enableBoard(boardDiv) {
        boardDiv.style.pointerEvents = "auto";
        boardDiv.style.opacity = "100%";
    } 

    static initDisable(pOneDiv, pTwoDiv) {
        RenderUtils.disableBoard(pOneDiv);
        RenderUtils.disableBoard(pTwoDiv);
    }
    
}