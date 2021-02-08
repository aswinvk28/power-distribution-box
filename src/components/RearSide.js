import React from 'react';
import Controller from './Controller'
import { ItemTypes } from './ItemTypes'

class RearSide extends React.Component {

    // constructor(props) {
    //     super(props)
    //     this.paper = window.Snap('#distribution_rear_side')
    // }

    // type_mapping() {
    //     return new Map([
    //         [ItemTypes.LIVE_PINS_INPUT, this.image],
    //         [ItemTypes.LIVE_PINS_OUTPUT, this.image],
    //         [ItemTypes.PINS_INPUT_1, this.image],
    //         [ItemTypes.PINS_INPUT_2, this.image],
    //         [ItemTypes.PLUGS_1, this.image],
    //         [ItemTypes.PLUGS_2, this.image],
    //         [ItemTypes.PLUGS_3, this.image],
    //         [ItemTypes.PLUGS_4, this.image],
    //         [ItemTypes.PLUGS_5, this.image]
    //     ]);
    // }

    // objects() { return {}; }
    
    // image() {
    //     for(var i = 0; i < this.objects.length; i++) {
    //         let image = this.objects[i].image;
    //         this.paper.image(image, this.objects[i].left, this.objects[i].top, this.objects[i].width, objects[i].height)
    //     }
    // }

    // importAllObjects(cache) {
    //     if(cache == "local_storage") {
    //         this.importTemplatedObjectsByCache()
    //     } else if(cache == "database") {

    //     }
    // }

    // importTemplatedObjectsByCache(template_name) {
    //     let objects = localStorage.getItem(template_name + ":items");
    //     this.objects[template_name] = JSON.parse(objects);
    // }

    // draw() {
    //     for(var i in this.objects) {

    //     }
    //     this.setState({image_executed: true})
    // }

    // render() {
    //     return null;
    // }

}

export default RearSide;