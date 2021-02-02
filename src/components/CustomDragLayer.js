import React from 'react';
import { useDragLayer } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { BoxDragPreview } from './BoxDragPreview';
import { snapToGrid } from './snapToGrid';
const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
};
function getItemStyles(initialOffset, currentOffset, isSnapToGrid) {
    if (!initialOffset || !currentOffset) {
        return {
            display: 'none',
        };
    }
    let { x, y } = currentOffset;
    if (isSnapToGrid) {
        x -= initialOffset.x;
        y -= initialOffset.y;
        [x, y] = snapToGrid(x, y);
        x += initialOffset.x;
        y += initialOffset.y;
    }
    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform: transform,
        WebkitTransform: transform,
    };
}
export const CustomDragLayer = (props) => {
    const { itemType, isDragging, item, initialOffset, currentOffset, } = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    }));
    function renderItem() {
        switch (itemType) {
            case ItemTypes.PLUGS:
                return <BoxDragPreview type={item.type} name={item.name} />;
            case ItemTypes.SOCKETS:
                return <BoxDragPreview type={item.type} name={item.name} />;
            case ItemTypes.PILOT_LIGHTS:
                return <BoxDragPreview type={item.type} name={item.name} />;
            case ItemTypes.MULTIMETER:
                return <BoxDragPreview type={item.type} name={item.name} />;
            case ItemTypes.LIVE_PINS_INPUT:
                return <BoxDragPreview type={item.type} name={item.name} />;
            case ItemTypes.LIVE_PINS_OUTPUT:
                return <BoxDragPreview type={item.type} name={item.name} />;
            default:
                return null;
        }
    }
    if (!isDragging) {
        return null;
    }
    return (<div style={layerStyles} className="custom-drag-layer">
			<div style={getItemStyles(initialOffset, currentOffset, props.snapToGrid)} className="custom-drag-layer-inner">
				{renderItem()}
			</div>
		</div>);
};