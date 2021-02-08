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

        this.object_types = Object.fromEntries(this.type_mapping());
        // import function is a Promise
        this.importAllObjects("local_storage").then((objects) => this.draw(objects)).catch(err => console.error(err))

        let mousePosition = 0, instance = this;
        $('#'+this.id).mousedown(function(event1) {
            $(this).css('cursor', 'grab');
            if(mousePosition == 0) {
                mousePosition = {'x': event1.clientX, 'y': event1.clientY}
            }
            $(this).mousemove(function (event2) {
                $(this).css('cursor', 'grab');
                const difference = {'x': event2.clientX - mousePosition.x, 'y': event2.clientY - mousePosition.y};
                let viewBox = instance.obtainViewBox();
                viewBox[0] -= (difference.x);
                viewBox[1] -= (difference.y);
                viewBox = viewBox.map(v => v.toString())
                instance.viewBox = viewBox.join(" ");
                instance.setState({change: !instance.state['change']})
            });
        }).mouseup(function () {
            $(this).css('cursor', 'default');
            $(this).unbind('mousemove');
            mousePosition = 0
        }).mouseout(function () {
            $(this).css('cursor', 'default');
            $(this).unbind('mousemove');
        });
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
            this.paper.image(image, objects[i].left, objects[i].top, (width / Constants.SCALE.FRONT_SIDE).toString() + 'px', 
            (height / Constants.SCALE.FRONT_SIDE).toString() + 'px')
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

    obtainViewBox() {
        let viewBox = this.viewBox.split(" ").map(v => parseInt(v)); // viewBox array
        return viewBox;
    }

    render() {
        // alert(this.props.viewBox)
        $(document.getElementById(this.id)).attr('viewBox', this.props.viewBox);
        return <input type="range" name="zoom" id="zoom" min="0" max="50" step="1" onChange={this.changeSlider} />;
    }

}

export default RearSide;