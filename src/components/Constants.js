import { ItemTypes } from './ItemTypes';

const ElementType = {
    INPUTS: 'Inputs',
    OUTPUTS: 'Outputs',
    THROUGH_OUTPUTS: 'Through Output',
    ADDONS: 'Add-ons',
    BOXES: 'Boxes',
    RCD: 'RCD',
    MCB: 'MCB'
};

const COLORS = {
    'BRAND_TITLE': 'b00110',
    
}

const SCALE = {
    FRONT_SIDE: 5,
    REAR_SIDE: 5
};

const SIZES = new Map([
    [ItemTypes.PLUGS_1, 50],
    [ItemTypes.PLUGS_2, 29],
    [ItemTypes.PLUGS_3, 29],
    [ItemTypes.PLUGS_4, 29],
    [ItemTypes.PLUGS_5, 29],
    [ItemTypes.SOCKETS_1, 50],
    [ItemTypes.SOCKETS_2, 24],
    [ItemTypes.SOCKETS_3, 28],
    [ItemTypes.PINS_INPUT_1, 42],
    [ItemTypes.PINS_INPUT_2, 50],
    [ItemTypes.LIVE_PINS_INPUT, [180,35]],
    [ItemTypes.LIVE_PINS_OUTPUT, [180,35]],
    [ItemTypes.MULTIMETER, [42,42]],
    [ItemTypes.PILOT_LIGHTS, [20,20]],
    [ItemTypes.WHEEL_24U, [681,1455]],
    [ItemTypes.WHEEL_20U, [681,1254]],
    [ItemTypes.WHEEL_16U, [681,1060]],
    [ItemTypes.WHEEL_12U, [681,865]],
    [ItemTypes.WHEEL_8U, [681,670]],
    [ItemTypes.GRID_24U, [484,1183]],
    [ItemTypes.GRID_20U, [484,983]],
    [ItemTypes.GRID_16U, [484,783]],
    [ItemTypes.GRID_12U, [484,583]],
    [ItemTypes.GRID_8U, [484,403]],
]);

const Constants = {
    useLocalStorage: true,
    gridSize: 15,
    drawingScale: 0.47,
    ElementType: ElementType,
    SCALE: SCALE,
    SIZES: Object.fromEntries(SIZES)
};

export default Constants;
