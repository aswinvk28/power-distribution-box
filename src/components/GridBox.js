import React, { useState, useCallback, useLayoutEffect } from 'react';
import { useDrag } from 'react-dnd';
import update from 'immutability-helper';
import { useEffect } from 'react'
import { fromEvent } from 'rxjs'
import { map, throttleTime } from 'rxjs/operators'
import { ItemTypes } from './ItemTypes';
import { snapToGrid as doSnapToGrid } from './snapToGrid';
import DistributionMenu from './DistributionMenu';
import $ from 'jquery';
import Singleton from './Singleton';
const style = {
    border: '1px dashed gray',
    backgroundColor: 'transparent',
    padding: '0.1px',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    cursor: 'move',
    float: 'left',
};
export const GridBox = ({ name, type, uniqid, distribution, image, top, left, width, height, distribution_name, description, container, e_name, isDropped }) => {
    // specify an id for styling purposes
    let {className, id} = Singleton.getGridBoxId({name, uniqid});

    // useDrag denotes draggable
    const [{ opacity, initialOffset, currentOffset, clientOffset, item, isDragging }, drag] = useDrag({
        // add attributes here
        item: { name, type, uniqid, distribution, image, width, height, distribution_name, description },
        collect: (monitor) => ({
            item: monitor.getItem(),
            opacity: monitor.isDragging() ? 0.4 : 1,
            initialOffset: monitor.getInitialClientOffset(),
            currentOffset: monitor.getSourceClientOffset(),
            clientOffset: monitor.getClientOffset(),
            canDrag: monitor.canDrag(),
            isDragging: monitor.isDragging()
        })
    });

    let position = useMousePosition();

    // // mouse tracking
    function useMousePosition() {
        const [x, setX] = useState(null)
        const [y, setY] = useState(null)

        useLayoutEffect(() => {
            // Subscribe to the mousemove event
            const sub = fromEvent(document, 'drag')
            // Extract out current mouse position from the event
            .pipe(map(event => [event.clientX, event.clientY]))
            // We have closure over the updater functions for our two state variables
            // Use these updaters to bridge the gap between RxJS and React
            .subscribe(([newX, newY]) => {
                setX(newX + window.scrollX)
                setY(newY + window.scrollY)
            })

            // When the component unmounts, remove the event listener
            return () => {
                sub.unsubscribe()
            }
            // We use [] here so that this effect fires exactly once.
            // (After the first render)
        }, [])

        if(isDragging && x && y) {
            let offset = {left: 0, top: 0};
            if(distribution_name == "cartesian") {
                offset = $('#cartesian_distribution_container').offset();
            } else if(distribution_name == "templated") {
                offset = $('#templated_distribution_container').offset();
            }
            const item = getItem(uniqid);
            if(item) {
                item.left = (x-offset['left']-40)+'px';
                item.top = (y-offset['top']-40)+'px';
                saveItem(item);
            }
        }

        return { mouseX: x, mouseY: y }
    }
    function getItem(uniqid) {
        let items = container.getTotalDroppedItems(item.distribution);
        for(var i in items) {
            if(uniqid == items[i].uniqid) {
                return items[i];
            }
        }
        return null;
    }
    function saveItem(item) {
        let items = container.getTotalDroppedItems(item.distribution);
        for(var i in items) {
            if(items[i].uniqid == item.uniqid) {
                items[i] = item;
                break;
            }
        }
        container.setTotalDroppedItems(items, item.distribution, item.distribution_name);
    }

    return (<div ref={drag} style={{...style, opacity, top, left}} className={className} id={id}>
            <DistributionMenu image={image} name={name} width={width} height="auto" />
		</div>);
};
