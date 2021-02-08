import React from 'react'
import Controller from './Controller'
import { ItemTypes } from './ItemTypes'
import $ from 'jquery'
import Constants from './Constants';

class RearSide extends React.Component {

    id = 'distribution_rear_side'
    
    constructor(props) {
        super(props)
        this.paper = window.Snap('#'+this.id)
        this.image = this.image.bind(this);
        this.objects = this.objects.bind(this);
        this.type_mapping = this.type_mapping.bind(this);
        this.importAllObjects = this.importAllObjects.bind(this);
        this.importCartesianObjectsByCache = this.importCartesianObjectsByCache.bind(this);
        this.importCartesianObjectsByCache = this.importCartesianObjectsByCache.bind(this);
        this.draw = this.draw.bind(this);
    }

    type_mapping() {
        return new Map([
            [ItemTypes.LIVE_PINS_INPUT, this.image],
            [ItemTypes.LIVE_PINS_OUTPUT, this.image],
            [ItemTypes.PINS_INPUT_1, this.image],
            [ItemTypes.PINS_INPUT_2, this.image],
            [ItemTypes.PLUGS_1, this.image],
            [ItemTypes.PLUGS_2, this.image],
            [ItemTypes.PLUGS_3, this.image],
            [ItemTypes.PLUGS_4, this.image],
            [ItemTypes.PLUGS_5, this.image]
        ]);
    }

    objects() {
        return null;
    }
    
    image(objects) {
        for(var i = 0; i < objects.length; i++) {
            let image = objects[i].image;
            let width = parseInt(objects[i].width.replace('px', ''));
            let height = parseInt(objects[i].height.replace('px', ''));
            this.paper.image(image, objects[i].left, objects[i].top, (width * Constants.SCALE.FRONT_SIDE).toString() + 'px', 
            (height * Constants.SCALE.FRONT_SIDE).toString() + 'px')
        }
    }

    importAllObjects(cache) {
        return new Promise((resolve, reject) => {
            try {
                if(cache == "local_storage") {
                    this.objects = this.importCartesianObjectsByCache()
                } else if(cache == "database") {
                    this.objects = this.importCartesianObjectsFromDatabase()
                }
            } catch(err) {
                reject(err)
            }
            resolve(this.objects)
        })
    }

    importCartesianObjectsByCache() {
        let objects = window.localStorage.getItem("cartesian: items");
        return JSON.parse(objects);
    }

    importCartesianObjectsFromDatabase() {
        return null;
    }

    draw(objects) {
        var function_to_execute = null;
        for(var i in objects) {
            if(objects[i].type in this.object_types) {
                function_to_execute = this.object_types[objects[i].type];
            }
        }
        if(function_to_execute != null) {
            this[function_to_execute](objects) // call this.image function
        }
    }

    render() {
        // alert(this.props.viewBox)
        $(document.getElementById(this.id)).attr('viewBox', this.props.viewBox);
        this.object_types = Object.fromEntries(this.type_mapping());
        // import function is a Promise
        this.importAllObjects("local_storage").then((objects) => this.draw(objects)).catch(err => console.error(err))
        return null
    }

}

export default RearSide;