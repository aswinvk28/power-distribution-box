import React, { useState, useCallback } from 'react';
import { Container } from './Container';
import { CustomDragLayer } from './CustomDragLayer';
import FrontSide from './FrontSide'
import RearSide from './RearSide'

export class Controller extends React.Component {
    
    state = {
        svg_monitoring: false,
        svg_power: false
    }
    
    render() {
        let $elem = null;
        let $designer = null;
        const [snapToGridAfterDrop, setSnapToGridAfterDrop] = useState(true);
        const [snapToGridWhileDragging, setSnapToGridWhileDragging] = useState(true);
        if(this.state['svg_monitoring'] == true) {
            $elem = <FrontSide />;
        } else if(this.state['svg_power'] == true) {
            $elem = <RearSide />;
        } else {
            $designer = <div className="bodyContainer">
            <CustomDragLayer snapToGrid={snapToGridWhileDragging}/>
            <div className="AppInnerContainerHolder">
                <Container snapToGrid={snapToGridAfterDrop}/>
            </div></div>;
        }
        return (<div className="container">
            
            { $designer }

            { $elem }

        </div>);
    }
}