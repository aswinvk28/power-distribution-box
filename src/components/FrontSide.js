import React from 'react'
import PowerDist from './PowerDist'
import Snap from 'imports-loader?imports=snapsvg';
import { ItemTypes } from './ItemTypes'

class FrontSide {

    constructor() {
        this.paper = Snap('#distribution_front_side')
    }

    type_mapping() {
        return new Map([
            [ItemTypes.PILOT_LIGHTS, 'image'], 
            [ItemTypes.MULTIMETER, 'image']
        ])
    }

    objects() {
        return null;
    }
    
    image(objects) {
        for(var i = 0; i < objects.length; i++) {
            let image = objects[i].image;
            this.paper.image(image, objects[i].left, objects[i].top, objects[i].width, "auto")
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
        let objects = localStorage.getItem("cartesian:items");
        return JSON.parse(objects);
    }

    importCartesianObjectsByCache() {
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
            function_to_execute(objects) // call this.image function
        }
    }

    render() {
        this.object_types = Object.fromEntries(this.type_mapping);
        // import function is a Promise
        this.importAllObjects("local_storage").then((objects) => this.draw(objects)).catch(err => console.error(err))
    }

}

export default FrontSide;