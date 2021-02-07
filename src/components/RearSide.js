import React from 'react';
import PowerDist from './PowerDist'
import Snap from 'imports-loader?imports=snapsvg';

export class RearSide extends React.Component {

    type_mapping = {
        
    }
    
    constructor(props) {
        super(props)
        this.paper = Snap('#distribution_rear_side')
    }

    image() {
        for(var i = 0; i < this.objects.length; i++) {
            let image = this.objects[i].image;
            this.paper.image(image, this.objects[i].left, this.objects[i].top, this.objects[i].width, "auto")
        }
    }

    importAllObjects(cache) {
        if(cache == "local_storage") {

        } else if(cache == "database") {

        }
    }

    importTemplatedObjectsByCache(template_name) {
        let objects = localStorage.getItem(template_name + ":items");
    }

    render() {
        return null;
    }
}
