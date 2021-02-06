import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
const style = {
    border: '0px none',
    backgroundColor: 'white',
    padding: '0px',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    cursor: 'move',
    float: 'left'
};
export const Box = ({ name, type, uniqid, distribution, image, isDropped }) => {
    // useDrag denotes draggable
    const [{ opacity }, drag] = useDrag({
        // add item attributes here
        item: { name, type, uniqid, distribution, image },
        collect: (monitor) => {
            return {
                opacity: monitor.isDragging() ? 0.4 : 1
            }
        }
    });
    let className = "box-item box-item-" + name;
    let width = "60px";
    if(type == ItemTypes.LIVE_PINS_INPUT || type == ItemTypes.LIVE_PINS_OUTPUT) {
        width = "160px";
    }
    return (<div style={{ ...style, opacity }} className={className}>
            <img src={image} alt={name} title={name} width={width} height="auto" />
		</div>);
};
