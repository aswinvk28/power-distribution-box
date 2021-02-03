import React from 'react';
import { useDrag } from 'react-dnd';
const style = {
    border: '1px dashed gray',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    cursor: 'move',
    float: 'left',
};
export const Box = ({ name, type, uniqid, distribution, isDropped }) => {
    // useDrag denotes draggable
    const [{ opacity }, drag] = useDrag({
        // add attributes here
        item: { name, type, uniqid, distribution },
        collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0.4 : 1,
        })
    });
    let className = "box-item box-item-" + name;
    return (<div style={{ ...style, opacity }} className={className}>
			{isDropped ? <s>{name}</s> : name}
		</div>);
};
