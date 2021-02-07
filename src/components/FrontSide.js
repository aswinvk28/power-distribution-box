import React from 'react'
import PowerDist from './PowerDist'
import Snap from 'imports-loader?imports=snapsvg';
import { ItemTypes } from './ItemTypes'

export class FrontSide extends React.Component {

    static type_mapping = [
        [ItemTypes.PILOT_LIGHTS, this.image], 
        [ItemTypes.MULTIMETER, this.image]
    ]

    objects = null
    
    constructor(props) {
        super(props)
        this.paper = Snap('#distribution_front_side')
    }

    image() {
        for(var i = 0; i < this.objects.length; i++) {
            let image = this.objects[i].image;
            this.paper.image(image, this.objects[i].left, this.objects[i].top, this.objects[i].width, "auto")
        }
    }

    importAllObjects() {
        
    }

    importCartesianObjectsByCache() {
        let objects = localStorage.getItem("cartesian:items");
        this.objects = objects;
    }

    render() {
        return null;
    }
}
