import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { Box } from './Box';
import Constants from './Constants';
function getStyles(left, top, isDragging) {
    const transform = `translate3d(${left}px, ${top}px, 0)`;
    return {
        // IE fallback: hide the real node using CSS when dragging
        // because IE will ignore our custom "empty image" drag preview.
        opacity: isDragging ? 0 : 1,
        height: isDragging ? 0 : '',
        transform: transform,
        WebkitTransform: transform,
        left: left,
        top: top,
        marginBottom: '1.5rem'
    };
}
export const DraggableBox = (props) => {
    const { name, type, uniqid, distribution, image, width, height, isDropped, left, top, distribution_name, description, box_item, id } = props;
    const [{ isDragging }, drag, preview] = useDrag({
        item: { name, type, uniqid, distribution, image, width, distribution_name },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    // function breaker() {
    //     if('breaker' in box_item && 'default' in box_item.breaker) {
    //         return (
    //             <img className="breaker-default" src={box_item.breaker.default.image} width="30px" height="auto" style={{marginLeft: "15px"}} />
    //         )
    //     } else if(box_item.element_type == Constants.ElementType.OUTPUTS) {
    //         return (
    //             <img className="breaker-default" src="" width="30px" height="auto" style={{marginLeft: "15px"}} />
    //         )
    //     }
    //     return null;
    // }
    return (<div style={getStyles(left, top, isDragging)} className="draggable-box" key={id}>
            <Box name={name} type={type} uniqid={uniqid} distribution={distribution} image={image}
            width={width} height={height} distribution_name={distribution_name} description={description} box_item={box_item}
            isDropped={isDropped} />
            <abbr style={{width: '100%', display: 'inline'}}><React.Fragment><b style={{fontWeight: 400, fontSize: '18px'}}>{description}</b></React.Fragment></abbr>
		</div>);
};
