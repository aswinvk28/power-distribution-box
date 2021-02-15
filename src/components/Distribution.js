import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react';
import { fromEvent } from 'rxjs'
import { map, throttleTime } from 'rxjs/operators'
import { snapToGrid as doSnapToGrid } from './snapToGrid';
import { useDrop, useDrag } from 'react-dnd';
import { GridBox } from './GridBox';
import Constants from './Constants';
import { HighlightComponent } from './HighlightComponent';
import $ from 'jquery';
import Singleton from './Singleton';
const useLocalStorage = Constants.useLocalStorage;

let style = {
    marginBottom: '0.5rem',
    textAlign: 'center',
    padding: '66px',
    fontSize: '1rem',
    lineHeight: 'normal'
};

export const Distribution = ({ accept, lastDroppedItem, totalDroppedItems, e_name, container, onDrop, }) => {
    let currentItem = null;

    // useDrop denotes droppable
    const [{ isOver, canDrop, initialOffset, currentOffset, clientOffset, diffOffset, item }, drop] = useDrop({
        accept,
        drop: onDrop,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
            initialOffset: monitor.getInitialClientOffset(),
            currentOffset: monitor.getSourceClientOffset(),
            clientOffset: monitor.getClientOffset(),
            diffOffset: monitor.getInitialSourceClientOffset(),
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
                let width = $('#boxes_container_draggable_holder').width();
                let width2 = $('#templated').parent().width();
                let width3 = ($('#cartesian').parent().width() - 500*Constants.drawingScale) / 2;
                let offset2 = $('#cartesian').offset();
                document.getElementById(item.highlightComponent).style.width = (parseFloat((item.width).replace('px', '')) * Constants.drawingScale).toString() + 'px';
                document.getElementById(item.highlightComponent).style.height = (parseFloat((item.height).replace('px', '')) * Constants.drawingScale).toString() + 'px';
                document.getElementById(item.highlightComponent).style.left = ((left-offset2['left']-width+width2+width3+185)).toString() + "px";
                document.getElementById(item.highlightComponent).style.top = ((top-offset['top']-40)).toString() + "px";
                document.getElementById(item.dragElementId).style.left = ((left-offset['left'])).toString() + "px";
                document.getElementById(item.dragElementId).style.top = ((top-offset['top'])).toString() + "px";
                item.left = ((left-offset['left']-40)).toString() + "px";
                item.top = ((top-offset['top']-40)).toString() + "px";
            } else if(item.distribution_name == "templated") {
                let offset = $('#templated_distribution_container').offset();
                let width = $('#boxes_container_draggable_holder').width();
                let width2 = ($('#templated').parent().width() - 500*Constants.drawingScale) / 2;
                let offset2 = $('#templated').offset();
                document.getElementById(item.highlightComponent).style.width = (parseFloat((item.width).replace('px', '')) * Constants.drawingScale).toString() + 'px';
                document.getElementById(item.highlightComponent).style.height = (parseFloat((item.height).replace('px', '')) * Constants.drawingScale).toString() + 'px';
                document.getElementById(item.highlightComponent).style.left = ((left-offset['left']-40)).toString() + "px";
                document.getElementById(item.highlightComponent).style.top = ((top-offset['top']-40)).toString() + "px";
                document.getElementById(item.dragElementId).style.left = ((left-offset['left'])).toString() + "px";
                document.getElementById(item.dragElementId).style.top = ((top-offset['top'])).toString() + "px";
                item.left = ((left-offset['left']-40)).toString() + "px"; // !important
                item.top = ((top-offset['top']-40)).toString() + "px"; // !important
            }
        }

        return { mouseX: x, mouseY: y }
    }

    const [distributionSize, setDistributionSize] = useState(0);
    useLayoutEffect(() => {
        const size = localStorage.getItem("cartesian: size");
        if (size) {
            setDistributionSize(size);
            // predetermined heights
            let heights = new Map([
                ['24U', 1183],
                ['20U', 983],
                ['16U', 783],
                ['12U', 583],
                ['8U', 403],
            ]);

            heights = Object.fromEntries(heights);
            $(document.getElementById(e_name)).css('height', ($(document).width() * 0.40 / 681 * 1455).toString() + "px");
            document.getElementById(e_name + "_distribution_container").style.height = 
            (heights[distributionSize] * $(document.getElementById(e_name)).outerWidth() / 681).toString() + "px"; // outerWidth
        }
    }, [distributionSize]);

    if(!totalDroppedItems) {
        totalDroppedItems = [];
    }
    // if(totalDroppedItems) {
    //     localStorage.setItem(e_name + ": items", JSON.stringify(totalDroppedItems));
    // }

    let distribution_width = (Constants.drawingScale * 681).toString() + 'px';
    let grid_width = (Constants.drawingScale * 500).toString() + 'px';
    let heights = Object.fromEntries(Singleton.__singletonRef.controller.heights);
    let grid_heights = Object.fromEntries(Singleton.__singletonRef.controller.grid_heights);
    let distribution_height = (Constants.drawingScale * heights[container.state['distributionSize']]).toString() + 'px';
    let grid_height = (Constants.drawingScale * grid_heights[container.state['distributionSize']]).toString() + 'px';
    let padding = (66 * Constants.drawingScale).toString() + 'px';

    return (<div className="col-lg-6 col-md-6 col-sm-6">
        <div style={{ ...style, padding, width: distribution_width, height: distribution_height }} className={e_name} id={e_name} data-size={container.state['distributionSize']}>


            <div ref={drop} style={{ width: grid_width, height: grid_height, backgroundColor, backgroundSize: Singleton.__singletonRef.controller.state['value']-50+100 + '%' }} className="distribution_container" id={e_name + "_distribution_container"}>
            {$elem}
                {
                    totalDroppedItems.map((item, index) =>  {
                        return (
                            <GridBox container={container} name={item.name} type={item.type} uniqid={item.uniqid} key={index}
                            distribution={item.distribution} image={item.image} e_name={e_name}
                            top={item.top} left={item.left} width={item.width} height={item.height}
                            distribution_name={item.distribution_name} description={item.description} 
                            breaker={item.breaker} 
                            isDropped={true} />
                        )
                    })
                }
            </div>
		</div></div>);
};
