export default function findRandom(sizeX, sizeY = sizeX) {
    const x = Math.floor(Math.random() * sizeX);
    const y = Math.floor(Math.random() * sizeY);
    return { x, y};
}