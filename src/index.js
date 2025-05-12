import "./styles.css"
import Gameboard from "./Gameboard"
import Ship from "./Ship"
import Player from "./Player"
import GameManager from "./gameManager"

const game = new GameManager(10);
game.init(5);