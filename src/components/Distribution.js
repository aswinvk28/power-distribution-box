import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react';
import { fromEvent } from 'rxjs'
import { map, throttleTime } from 'rxjs/operators'
import { snapToGrid as doSnapToGrid } from './snapToGrid';
import { useDrop } from 'react-dnd';
import { GridBox } from './GridBox';
import Constants from './Constants';
import { HighlightComponent } from './HighlightComponent';
import $ from 'jquery';
import Singleton from './Singleton';
const useLocalStorage = Constants.useLocalStorage;

let style = {
    marginBottom: '0.5rem',
    padding: '5%',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 'normal'
};

export const Distribution = ({ accept, lastDroppedItem, totalDroppedItems, e_name, onDrop, }) => {
    let currentItem = null;

    // useDrop denotes droppable
    const [{ isOver, canDrop, initialOffset, currentOffset, clientOffset, item }, drop] = useDrop({
        accept,
        drop: onDrop,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
            initialOffset: monitor.getInitialClientOffset(),
            currentOffset: monitor.getSourceClientOffset(),
            clientOffset: monitor.getClientOffset(),
            item: monitor.getItem()
        }),
        canDrop: (item, monitor) => {
            return (item.distribution != null) || (item.distribution != undefined) ? false : true;
        },
        hover: (item, monitor) => {
            currentItem = item;
            // specify an id for styling purposes
            let id = "element-box-item-" + item.name;
            item.dragElementId = id;
            item.highlightComponent = "highlight-component-" + item.name;
            return false;
        }
    });
    const isActive = isOver && canDrop;
    let backgroundColor = 'transparent';
    if (isActive) {
        backgroundColor = 'darkgreen';
    }
    else if (canDrop) {
        backgroundColor = 'darkkhaki';
    }
    if(!totalDroppedItems) {
        totalDroppedItems = [];
    }
    if(totalDroppedItems) {
        localStorage.setItem(e_name + ": items", JSON.stringify(totalDroppedItems));
    }

    let $elem = <div></div>;
    if(item && clientOffset && currentOffset && document.getElementById(item.dragElementId)) {
        $elem = <HighlightComponent item={item} currentOffset={currentOffset}
        clientOffset={clientOffset} />
    }

    let position = useMousePosition();

    // // mouse tracking
    function useMousePosition() {
        const [x, setX] = useState(null)
        const [y, setY] = useState(null)

        useEffect(() => {
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

        if(canDrop && item && document.getElementById(item.highlightComponent)) {
            // left and top are saved on refresh
            let [left, top] = doSnapToGrid(x, y);
            if(item.distribution_name == "cartesian") {
                let offset = $('#cartesian_distribution_container').offset();
                document.getElementById(item.highlightComponent).style.left = (left-offset['left']).toString() + "px";
                document.getElementById(item.highlightComponent).style.top = (top-offset['top']).toString() + "px";
                document.getElementById(item.dragElementId).style.left = (left-offset['left']).toString() + "px";
                document.getElementById(item.dragElementId).style.top = (top-offset['top']).toString() + "px";
                item.left = (left-offset['left']).toString() + "px";
                item.top = (top-offset['top']).toString() + "px";
            } else if(item.distribution_name == "templated") {
                let offset = $('#templated_distribution_container').offset();
                document.getElementById(item.highlightComponent).style.left = (left-offset['left']).toString() + "px";
                document.getElementById(item.highlightComponent).style.top = (top-offset['top']).toString() + "px";
                document.getElementById(item.dragElementId).style.left = (left-offset['left']).toString() + "px";
                document.getElementById(item.dragElementId).style.top = (top-offset['top']).toString() + "px";
                item.left = (left-offset['left']).toString() + "px";
                item.top = (top-offset['top']).toString() + "px";
            }
        }

        return { mouseX: x, mouseY: y }
    }

    const [distributionSize, setDistributionSize] = useState(0);
    useLayoutEffect(() => {
        const size = localStorage.getItem("cartesian: size");
        if (size) {
            setDistributionSize(size);
            let heights = new Map([
                ['24U', 1137],
                ['20U', 937],
                ['16U', 743],
                ['12U', 550],
                ['8U', 350],
            ]);

            if(distributionSize != '24U') {
                style['padding'] = '5.2%';
            }
        
            heights = Object.fromEntries(heights);
            $(document.getElementById(e_name)).css('height', ($(document).width() * 0.40 / 681 * 1455).toString() + "px");
            document.getElementById(e_name + "_distribution_container").style.height = 
            (heights[distributionSize] * $(document.getElementById(e_name)).outerWidth() / 681).toString() + "px"; // outerWidth
        }
    }, [distributionSize]);

    return (<div style={{ ...style }} className={e_name} id={e_name}>

            {$elem}

            <div ref={drop} style={{ backgroundColor, backgroundSize: Singleton.__singletonRef.controller.state['value']-50+100 + '%' }} className="distribution_container" id={e_name + "_distribution_container"}>
                {
                    totalDroppedItems.map((item, index) =>  {
                        return (
                            <GridBox name={item.name} type={item.type} uniqid={item.uniqid} key={item.index}
                            distribution={item.distribution} image={item.image} e_name={e_name}
                            top={item.top} left={item.left}
                            isDropped={true} />
                        )
                    })
                }
            </div>
		</div>);
};
