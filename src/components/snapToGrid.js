import Constants from './Constants';
import Singleton from './Singleton';

export function snapToGrid(x, y) {
    let grid_value = Singleton.__singletonRef.controller.state['value'] * 1.625 / 100 + 0.5;
    const snappedX = Math.round(x / (Constants.gridSize * grid_value)) * Constants.gridSize * grid_value;
    const snappedY = Math.round(y / (Constants.gridSize * grid_value)) * Constants.gridSize * grid_value;
    return [snappedX, snappedY];
}
  