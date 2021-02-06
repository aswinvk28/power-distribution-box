import React, { useState, useCallback } from 'react';
import { useDragLayer } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { BoxDragPreview } from './BoxDragPreview';
import { snapToGrid } from './snapToGrid';
import { useDrag } from 'react-dnd';
import update from 'immutability-helper';
import { useEffect } from 'react'
import { fromEvent } from 'rxjs'
import { map, throttleTime } from 'rxjs/operators'
const layerStyles = {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 100,
    marginLeft: "-45%",
    width: '100%',
    height: '100%',
};
function getItemStyles(initialOffset, currentOffset, clientOffset, isSnapToGrid) {
    if (!initialOffset || !currentOffset) {
        return {
            display: 'none',
        };
    }
    let { x, y } = clientOffset;
    if (isSnapToGrid) {
        x -= initialOffset.x + 32;
        y -= initialOffset.y + 32;
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
    let id = null, shortClassName = null;
    const { itemType, isDragging, item, initialOffset, currentOffset, clientOffset } = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        initialOffset: monitor.getInitialClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        clientOffset: monitor.getClientOffset(),
        isDragging: monitor.isDragging(),
        collect: (monitor) => {
            shortClassName = "custom-drag-layer-item-" + itemType;
            // specify an id for styling purposes
            id = shortClassName + "-" + item.name;
            return {
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
                initialOffset: monitor.getInitialClientOffset(),
                currentOffset: monitor.getSourceClientOffset(),
                clientOffset: monitor.getClientOffset()
            }
        }
    }));
    let position = useMousePosition();

    useEffect(() => {
        // left and top are saved on refresh
        if(currentOffset) {
            document.getElementById(id).style.position = "absolute";
            document.getElementById(id).style.left = clientOffset.x.toString() + "px";
            document.getElementById(id).style.top = currentOffset.y.toString() + "px";
        }
    }, []);
    // mouse tracking
    function useMousePosition() {
        const [x, setX] = useState(null)
        const [y, setY] = useState(null)
        
        useEffect(() => {
            // Subscribe to the mousemove event
            const sub = fromEvent(document, 'mousemove')
            // Extract out current mouse position from the event
            .pipe(map(event => [event.clientX, event.clientY]))
            // We have closure over the updater functions for our two state variables
            // Use these updaters to bridge the gap between RxJS and React
            .subscribe(([newX, newY]) => {
                setX(newX)
                setY(newY)
            })
        
            // When the component unmounts, remove the event listener
            return () => {
                sub.unsubscribe()
            }
            // We use [] here so that this effect fires exactly once.
            // (After the first render)
        }, [])
        
        return { mouseX: x, mouseY: y }
    }
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
    return (<div style={layerStyles} className="custom-drag-layer" id={id}>
			<div style={getItemStyles(initialOffset, currentOffset, clientOffset, props.snapToGrid)} className="custom-drag-layer-inner">
				{renderItem()}
			</div>
		</div>);
};
