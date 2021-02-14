import { ItemTypes } from './ItemTypes';

const ElementType = {
    INPUTS: 'Inputs',
    OUTPUTS: 'Outputs',
    THROUGH_OUTPUTS: 'Through Output',
    ADDONS: 'Add-ons',
};

const COLORS = {
    'BRAND_TITLE': 'b00110',
    
}

const SCALE = {
    FRONT_SIDE: 5,
    REAR_SIDE: 5
};

const SVG_ELEMENTS = {
    FULL_WIDTH: '280px'
};

const SIZES = new Map([
    [ItemTypes.PLUGS_1, 45],
    [ItemTypes.PLUGS_2, 45],
    [ItemTypes.PLUGS_3, 45],
    [ItemTypes.PLUGS_4, 45],
    [ItemTypes.PLUGS_5, 45],
    [ItemTypes.SOCKETS_1, 45],
    [ItemTypes.SOCKETS_2, 45],
    [ItemTypes.SOCKETS_3, 45],
    [ItemTypes.PINS_INPUT_1, 45],
    [ItemTypes.PINS_INPUT_2, 45],
    [ItemTypes.LIVE_PINS_INPUT, [280,54]],
    [ItemTypes.LIVE_PINS_OUTPUT, [280,54]],
    [ItemTypes.MULTIMETER, [45,45]],
    [ItemTypes.PILOT_LIGHTS, [45,45]],
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
    gridSize: 16,
    ElementType: ElementType,
    SVG_ELEMENTS: SVG_ELEMENTS,
    SCALE: SCALE,
    SIZES: Object.fromEntries(SIZES)
};

export default Constants;
