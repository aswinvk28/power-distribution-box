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
        value: 50,
        grid: 0,
        wheel: 0
    }
    
    constructor(props) {
        super(props)
        this.viewBox = this.props.viewBox;
        this.paper = window.Snap('#'+this.id)
        this.g = this.paper.g();
        this.image = this.image.bind(this);
        this.objects = this.objects.bind(this);
        this.type_mapping = this.type_mapping.bind(this);
        this.wheel_image = this.wheel_image.bind(this);
        this.grid_image = this.grid_image.bind(this);
        this.importAllObjects = this.importAllObjects.bind(this);
        this.importCartesianObjectsByCache = this.importCartesianObjectsByCache.bind(this);
        this.importCartesianObjectsByCache = this.importCartesianObjectsByCache.bind(this);
        this.draw = this.draw.bind(this);
        this.changeSlider = this.changeSlider.bind(this);
        this.obtainViewBox = this.obtainViewBox.bind(this);
        this.wheel = this.wheel.bind(this);

        let mousePosition = 0, instance = this, length = 0;
        $('#'+this.id).mousedown(function(event1) {
            $(this).css('cursor', 'grab');
            if(mousePosition == 0) {
                mousePosition = {'x': event1.clientX, 'y': event1.clientY}
            }
            $(this).mousemove(function (event2) {
                length+=0.95; // estimate of pan activity
                $(this).css('cursor', 'grab');
                const difference = {'x': (event2.clientX - mousePosition.x)/length, 'y': (event2.clientY - mousePosition.y)/length};
                let viewBox = instance.obtainViewBox(instance.viewBox);
                viewBox[0] -= (difference.x);
                viewBox[1] -= (difference.y);
                viewBox = viewBox.map(v => v.toString())
                instance.viewBox = viewBox.join(" ");
                instance.setState({change: !instance.state['change']})
            });
        }).mouseup(function () {
            $(this).css('cursor', 'default');
            $(this).unbind('mousemove');
            mousePosition = 0;
            length = 0;
        }).mouseout(function () {
            $(this).css('cursor', 'default');
            $(this).unbind('mousemove');
            length = 0;
        });

        this.showGrid = this.showGrid.bind(this);
        this.showWheel = this.showWheel.bind(this);

        this.wheel_svg = Object.fromEntries(this.wheel_image());
        this.grid_svg = Object.fromEntries(this.grid_image());
    }

    wheel_image() {
        return new Map([
            ['24U', 'images/power_box/canvas_wheel.png'], 
            ['20U', 'images/power_box/canvas_wheel-20u.png'], 
            ['16U', 'images/power_box/canvas_wheel-16u.png'],
            ['12U', 'images/power_box/canvas_wheel-12u.png'],
            ['8U', 'images/power_box/canvas_wheel-8u.png']
        ])
    }

    grid_image() {
        return new Map([
            ['24U', 'images/power_box/canvas_grid.png'], 
            ['20U', 'images/power_box/canvas_grid-20u.png'], 
            ['16U', 'images/power_box/canvas_grid-16u.png'],
            ['12U', 'images/power_box/canvas_grid-12u.png'],
            ['8U', 'images/power_box/canvas_grid-8u.png']
        ])
    }

    type_mapping() {
        return new Map([
            [ItemTypes.WHEEL, 'base_image'], 
            [ItemTypes.PILOT_LIGHTS, 'image'], 
            [ItemTypes.MULTIMETER, 'image']
        ])
    }

    objects() {
        return null;
    }

    wheel() {
        let val = $('#unit_size').val();
        let image = this.wheel_svg[val];
        let width = Constants.SIZES[ItemTypes['WHEEL_'+val.toString()]][0];
        let height = Constants.SIZES[ItemTypes['WHEEL_'+val.toString()]][1];
        let element = this.paper.image(image, 0, 0, (width).toString() + 'px', (height).toString() + 'px');
        this.g.prepend(element);
        this.wheelEl = element;
    }

    grid() {
        let val = $('#unit_size').val();
        let image = this.grid_svg[val];
        let width = Constants.SIZES[ItemTypes['GRID_'+val.toString()]][0];
        let height = Constants.SIZES[ItemTypes['GRID_'+val.toString()]][1];
        let element = this.paper.image(image, 100, 65, (width).toString() + 'px', (height).toString() + 'px');
        this.g.prepend(element);
        this.gridEl = element;
    }
    
    image(objects) {
        for(var i = 0; i < objects.length; i++) {
            let image = objects[i].image;
            let width = parseFloat(objects[i].width.replace('px', ''));
            let height = parseFloat(objects[i].height.replace('px', ''));
            let element = this.paper.image(image, objects[i].left, objects[i].top, (Constants.SIZES[objects[i].type][0]).toString() + 'px', 
            (Constants.SIZES[objects[i].type][1]).toString() + 'px');
            element.attr('style', 'z-index: ' + 100);
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
        var function_to_execute = [];
        for(var i in objects) {
            if(objects[i].type in this.object_types && !(this.object_types[objects[i].type] in function_to_execute)) {
                function_to_execute.push(this.object_types[objects[i].type]);
            }
        }
        if(function_to_execute.length > 0) {
            for(var f in function_to_execute) {
                this[function_to_execute[f]](objects) // call this.image function
            }
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
        viewBox[2] = vb[2] - value * 20;
        viewBox[3] = vb[3] - value * 20;
        viewBox = viewBox.map(v => v.toString())
        this.viewBox = viewBox.join(" ");
        // console.log(this.viewBox);
        this.setState({change: !this.state['change']})
        this.setState({'value': value});
    }

    showGrid() {
        if(this.state['grid'] == 0) {
            this.grid()
            this.setState({grid: 1});
        } else {
            this.gridEl.remove();
            this.setState({grid: 0});
        }
    }

    showWheel() {
        if(this.state['wheel'] == 0) {
            this.wheel()
            this.setState({wheel: 1});
        } else {
            this.wheelEl.remove();
            this.setState({wheel: 0});
        }
    }

    componentDidMount() {
        this.object_types = Object.fromEntries(this.type_mapping());
        // import function is a Promise
        this.importAllObjects("local_storage").then((objects) => this.draw(objects)).catch(err => console.error(err))
    }

    render() {
        $(document.getElementById(this.id)).attr('viewBox', this.viewBox);
        return <div className="distros_controls">
            <input type="range" name="zoom" id="zoom" min="-100" max="0" step="1" value={this.state['value']} onChange={this.changeSlider} />
        <input title="Show Grid" type="checkbox" name="show_grid" id="show_grid" value={this.state['grid']} onChange={this.showGrid} />
        <input title="Display Wheel" type="checkbox" name="show_wheel" id="show_wheel" value={this.state['wheel']} onChange={this.showWheel} /></div>
    }

}

export default FrontSide;