import Constants from './Constants';

export function snapToGrid(x, y) {
    const snappedX = Math.round(x / Constants.gridSize) * Constants.gridSize;
    const snappedY = Math.round(y / Constants.gridSize) * Constants.gridSize;
    return [snappedX, snappedY];
}
  