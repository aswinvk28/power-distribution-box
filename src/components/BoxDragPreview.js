import React, { useEffect, useState, memo } from 'react';
import { Box } from './Box';
const styles = {
    display: 'inline-block',
    transform: 'rotate(0deg)',
    WebkitTransform: 'rotate(0deg)',
};
export const BoxDragPreview = memo(({ name, type, image }) => {
    const [tickTock, setTickTock] = useState(false);
    useEffect(function subscribeToIntervalTick() {
        const interval = setInterval(() => setTickTock(!tickTock), 500);
        return () => clearInterval(interval);
    }, [tickTock]);
    return (<div style={styles} className="box-drag-preview">
				<Box name={name} type={type} image={image} yellow={tickTock}/>
			</div>);
});
