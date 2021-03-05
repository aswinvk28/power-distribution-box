import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
const style = {
    border: '0px none',
    backgroundColor: 'transparent',
    padding: '0px',
    marginRight: '1.5rem',
    marginBottom: '0.25rem',
    cursor: 'move',
    zIndex: 100,
    marginLeft: 'auto',
    marginRight: 'auto'
};
export const Box = ({ name, type, uniqid, distribution, image, width, height, distribution_name, description, box_item, isDropped }) => {
    // useDrag denotes draggable
    const [{ opacity }, drag] = useDrag({
        // add item attributes here
        item: { name, type, uniqid, distribution, image, width, height, 
            distribution_name, description, breaker: box_item.breaker, bbox: box_item.bbox, left: box_item.left, top: box_item.top },
        collect: (monitor) => {
            return {
                opacity: monitor.isDragging() ? 0.4 : 1
            }
        }
    });
    let className = "box-item box-item-" + name;
    let w = parseFloat(width.replace('px', '')) + 12 + 'px';
    return (<div ref={drag} style={{ ...style, opacity, width: w, border: '2px solid #fe0000',
    backgroundImage: 'url("../images/power_box/canvas_grid-8u.png")', padding: '4px 1.5px', 
    borderRadius: '3px', backgroundRepeat: 'no-repeat', backgroundPosition: '-5px -50px', 
    backgroundSize: '200px', backgroundColor: '#f3f3f3' }} className={className} id={"element-box-item-" + name}>
            <img src={image} alt={name} title={name} width={width} height="auto" /><br/>
		</div>);
};
