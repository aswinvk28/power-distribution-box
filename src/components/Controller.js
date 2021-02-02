import React, { useState, useCallback } from 'react';
import { Container } from './Container';
import { CustomDragLayer } from './CustomDragLayer';

export const Controller = () => {
    const [snapToGridAfterDrop, setSnapToGridAfterDrop] = useState(true);
    const [snapToGridWhileDragging, setSnapToGridWhileDragging] = useState(true);
    return (<div>
			<Container snapToGrid={snapToGridAfterDrop}/>
			<CustomDragLayer snapToGrid={snapToGridWhileDragging}/>
		</div>);
};