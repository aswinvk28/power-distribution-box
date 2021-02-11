import React from 'react'
import Controller from './Controller'
import { ItemTypes } from './ItemTypes'
import $ from 'jquery'
import Constants from './Constants';

class FrontSide extends React.Component {

    id = 'distribution_front_side'
    viewBox = ""

    state = {
        change: false,
        value: 50
    }
    
    constructor(props) {
        super(props)
        this.viewBox = this.props.viewBox;
        this.paper = window.Snap('#'+this.id)
        this.g = this.paper.g();
        this.image = this.image.bind(this);
        this.objects = this.objects.bind(this);
        this.type_mapping = this.type_mapping.bind(this);
        this.importAllObjects = this.importAllObjects.bind(this);
        this.importCartesianObjectsByCache = this.importCartesianObjectsByCache.bind(this);
        this.importCartesianObjectsByCache = this.importCartesianObjectsByCache.bind(this);
        this.draw = this.draw.bind(this);
        this.changeSlider = this.changeSlider.bind(this);
        this.obtainViewBox = this.obtainViewBox.bind(this);

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

        this.showGrid = this.showGrid.bind(this);
        this.showWheel = this.showWheel.bind(this);
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
            let width = parseInt(objects[i].width.replace('px', ''));
            let height = parseInt(objects[i].height.replace('px', ''));
            let element = this.paper.image(image, objects[i].left, objects[i].top, (width / Constants.SCALE.FRONT_SIDE).toString() + 'px', 
            (height / Constants.SCALE.FRONT_SIDE).toString() + 'px');
            this.g.add(element);
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

    obtainViewBox(vb) {
        let viewBox = vb.split(" ").map(v => parseInt(v)); // viewBox array
        return viewBox;
    }

    changeSlider(event) {
        let vb = this.obtainViewBox(this.props.viewBox);
        let viewBox = this.obtainViewBox(this.viewBox);
        let value = event.target.value;
        viewBox[2] = vb[2] + value * 20;
        viewBox[3] = vb[3] + value * 20;
        viewBox = viewBox.map(v => v.toString())
        this.viewBox = viewBox.join(" ");
        // console.log(this.viewBox);
        this.setState({change: !this.state['change']})
        this.setState({'value': value});
    }

    showGrid() {

    }

    showWheel() {

    }

    render() {
        $(document.getElementById(this.id)).attr('viewBox', this.viewBox);
        return <div className="distros_controls">
            <input type="range" name="zoom" id="zoom" min="-50" max="0" step="1" value={this.state['value']} onChange={this.changeSlider} />
        <input type="checkbox" name="show_grid" id="show_grid" value="" onChange={this.showGrid} />
        <input type="checkbox" name="show_wheel" id="show_wheel" value="" onChange={this.showWheel} /></div>
        ;
    }

}

export default FrontSide;