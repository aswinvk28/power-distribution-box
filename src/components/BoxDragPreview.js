import React, { useEffect, useState, memo } from 'react';
import { Box } from './Box';
import { ItemTypes } from './ItemTypes';
const styles = {
    display: 'inline-block',
    transform: 'rotate(0deg) translate(-84px, -10px)',
    WebkitTransform: 'rotate(0deg) translate(-84px, -10px)',
};
export const BoxDragPreview = memo(({ name, type, image, width }) => {
    const [tickTock, setTickTock] = useState(false);
    useEffect(function subscribeToIntervalTick() {
        const interval = setInterval(() => setTickTock(!tickTock), 500);
        return () => clearInterval(interval);
    }, [tickTock]);
    let id = "box-drag-preview-" + name;
    return (<div style={styles} className="box-drag-preview" id={id}>
				<Box name={name} type={type} image={image} width={width} yellow={tickTock}/>
			</div>);
});
