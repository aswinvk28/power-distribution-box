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
    [ItemTypes.PLUGS_1, 90],
    [ItemTypes.PLUGS_2, 90],
    [ItemTypes.PLUGS_3, 90],
    [ItemTypes.PLUGS_4, 90],
    [ItemTypes.PLUGS_5, 90],
    [ItemTypes.SOCKETS_1, 90],
    [ItemTypes.SOCKETS_2, 90],
    [ItemTypes.SOCKETS_3, 90],
    [ItemTypes.PINS_INPUT_1, 90],
    [ItemTypes.PINS_INPUT_2, 90],
    [ItemTypes.LIVE_PINS_INPUT, [467,90]],
    [ItemTypes.LIVE_PINS_OUTPUT, [467,90]],
    [ItemTypes.MULTIMETER, [90,90]],
    [ItemTypes.PILOT_LIGHTS, [90,90]],
    [ItemTypes.WHEEL, [681,1455]],
    [ItemTypes.GRID, [484,1183]],
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
