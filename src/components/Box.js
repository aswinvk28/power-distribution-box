import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
const style = {
    border: '1px dashed gray',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    cursor: 'move',
    float: 'left',
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
    let width = "20px";
    if(name == ItemTypes.LIVE_PINS_INPUT || name == ItemTypes.LIVE_PINS_OUTPUT) {
        width = "80px";
    }
    return (<div style={{ ...style, opacity }} className={className}>
            <img src={image} alt={name} title={name} width={width} height="auto" />
		</div>);
};
