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
import Constants from './Constants';
import { getEmptyImage } from 'react-dnd-html5-backend';
const style = {
    border: '1px dashed gray',
    backgroundColor: 'transparent',
    padding: '0.1px',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    cursor: 'move',
    float: 'left',
    zIndex: 1000,
};

function getBBox(item) {
    let bbox = [parseFloat(item.left.replace('px', '')), parseFloat(item.top.replace('px', '')), 
                parseFloat(item.left.replace('px', '')) + parseFloat(item.width.replace('px', '')), 
                parseFloat(item.top.replace('px', '')) + parseFloat(item.height.replace('px', ''))]
    return bbox;
}

function elementsOnTop(item, totalDroppedItems) {
    let least_distance1 = 0, least_distance2 = 0, least_distance3 = 0, least_distance4 = 0, isOnTop = false, distance = null;
    const [xmin, ymin, xmax, ymax] = item.bbox;
    let distances = {};
    for(var i in totalDroppedItems) {
        const canvasItem = totalDroppedItems[i];
        if(canvasItem.uniqid == item.uniqid) {
            continue;
        }
        const [x2, y2, x3, y3] = canvasItem.bbox;
        least_distance1 = Math.sqrt((x2-xmin)**2 + (y2-ymin)**2);
        least_distance2 = Math.sqrt((x3-xmax)**2 + (y3-ymax)**2);
        least_distance3 = Math.sqrt((x2-xmax)**2 + (y2-ymax)**2);
        least_distance4 = Math.sqrt((x3-xmin)**2 + (y3-ymin)**2);
        distances[canvasItem.uniqid] = Math.min(least_distance1, least_distance2, least_distance3, least_distance4);
    }
    return distances;
}

export const GridBox = ({ name, type, uniqid, distribution, image, top, left, width, 
    height, distribution_name, description, container, breaker, breaker_item, box_item, e_name, isDropped }) => {
    // specify an id for styling purposes
    let {className, id} = Singleton.getGridBoxId({name, uniqid});

    // useDrag denotes draggable
    const [{ opacity, initialOffset, currentOffset, clientOffset, isDragging, canDrag }, drag, preview] = useDrag({
        // add attributes here
        item: { name, type, uniqid, distribution, image, width, height, distribution_name, description, 
            left: box_item.left, top: box_item.top, bbox: box_item.bbox, breaker_item: {} },
        collect: (monitor) => ({
            item: monitor.getItem(),
            opacity: monitor.isDragging() ? 0.4 : 1,
            initialOffset: monitor.getInitialClientOffset(),
            currentOffset: monitor.getSourceClientOffset(),
            clientOffset: monitor.getClientOffset(),
            canDrag: monitor.canDrag(),
            isDragging: monitor.isDragging()
        }),
    });

    let [mcb, setMCB] = useState(false);
    let [rcd, setRCD] = useState(false);
    
    // preview Image empty
    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
    }, []);

    useLayoutEffect(() => {
        if(breaker_item && breaker_item.breaker_type == Constants.ElementType.RCD) {
            setMCB(false);
            setRCD(true);
        } else if(breaker_item && breaker_item.breaker_type == Constants.ElementType.MCB) {
            setMCB(true);
            setRCD(false);
        }
    }, []);

    let grid_heights = Object.fromEntries(container.controller.grid_heights);

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

        // moving
        if(isDragging && x && y) {
            container.setDragDrop(true);
            let item = getItem(uniqid);
            item.bbox = getBBox(item);
            let isOnTop = elementsOnTop(item, container.getTotalDroppedItems(item.distribution));
            let [left, top] = doSnapToGrid(x, y);
            let offset = {left: 0, top: 0};
            if(distribution_name == "cartesian") {
                offset = $('#cartesian_distribution_container').offset();
            } else if(distribution_name == "templated") {
                offset = $('#templated_distribution_container').offset();
            }
            let dragElement = $('#'+item.dragElementId).find('img');
            let w = dragElement.width();
            let h = dragElement.height();
            // let breaker_item = item.breaker_item;
            // save item
            if(item && (Math.min(...Object.values(isOnTop)) >= 23) && (left-offset['left']) >= 0 && (left-offset['left']) <= (Constants.drawingScale * 450)
            && (top-offset['top']) >= 0 && (top-offset['top']) <= (Constants.drawingScale * (grid_heights[container.state['distributionSize']]-50))) {
                if(item.type == ItemTypes.LIVE_PINS_INPUT || item.type == ItemTypes.LIVE_PINS_OUTPUT) {
                    item.left = '10px';
                } else {
                    item.left = (left-offset['left']-w/2)+'px';
                }
                item.top = (top-offset['top']-h/2)+'px';
                saveItem(item);
                // breaker_item attribute is null for others, no need to save the breaker item while moving parent input/output
                // if(breaker_item) {
                //     breaker_item.left = item.left;
                //     breaker_item.top = item.top;
                //     saveItem(breaker_item);
                // }
            } else if((Math.min(...Object.values(isOnTop)) >= 23) < 23) {
                if(item.type == ItemTypes.LIVE_PINS_INPUT || item.type == ItemTypes.LIVE_PINS_OUTPUT) {
                    item.left = '10px';
                } else {
                    item.left = (left-offset['left']-w/2)+50+'px'; // allocate some space for it
                }
                item.top = (top-offset['top']-h/2)+50+'px'; // allocate some space for it
                saveItem(item);
                // breaker_item attribute is null for others
                // if(breaker_item) {
                //     breaker_item.left = item.left;
                //     breaker_item.top = item.top;
                //     saveItem(breaker_item);
                // }
            }
        } else {
            container.setDragDrop(false);
        }

        return { mouseX: x, mouseY: y }
    }
    function getItem(uniqid) {
        let items = container.getTotalDroppedItems(distribution);
        for(var i in items) {
            if(uniqid == items[i].uniqid) {
                return items[i];
            }
        }
        return null;
    }
    function saveItem(item) {
        let items = container.getTotalDroppedItems(distribution);
        for(var i in items) {
            if(items[i].uniqid == item.uniqid) {
                items[i] = item;
                break;
            }
        }
        container.setTotalDroppedItems(items, distribution, distribution_name);
    }

    return (<div ref={drag} style={{...style, opacity, top, left}} className={className} id={id}>
            <DistributionMenu container={container} key={id} image={image} name={name} width={width} height="auto" name={name} type={type} 
            uniqid={uniqid} distribution_name={distribution_name} distribution={distribution}
            breaker_item={breaker_item} box_item={box_item}
            mcb={mcb} rcd={rcd} />
		</div>);
};
