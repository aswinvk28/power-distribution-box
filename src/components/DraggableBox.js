import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Box } from './Box';
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
        top: top
    };
}
export const DraggableBox = (props) => {
    const { name, type, uniqid, distribution, image, isDropped, left, top } = props;
    const [{ isDragging }, drag, preview] = useDrag({
        item: { name, type, uniqid, distribution, image },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
    }, []);
    return (<div ref={drag} style={getStyles(left, top, isDragging)} className="draggable-box">
            <Box name={name} type={type} uniqid={uniqid} distribution={distribution} image={image}
            isDropped={isDropped} />
		</div>);
};
