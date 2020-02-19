import React from "react";
import Paper from "paper";


class Drawing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: new Date(),
            properties: {
                //Add properties here
                //value: input value
                //type: input type
                //name: input name
                //label: input label
                text: {
                    value: "Hello World",
                    type: "text",
                    name: "text",
                    label: "Text"
                },
                divisions: {
                    value: 7,
                    type: "number",
                    name: "divisions",
                    label: "Divisions"
                },
                maxRange: {
                    value: 50,
                    type: "number",
                    name: "maxRange",
                    label: "Max Range"
                },
                size: {
                    value: 20,
                    type: "range",
                    name: "size",
                    label: "Size"
                },
                strokeSize: {
                    value: 10,
                    type: "range",
                    name: "strokeSize",
                    label: "Stroke Size"
                },
                yOffset: {
                    value: 20,
                    type: "range",
                    name: "yOffset",
                    label: "Y-Offset"
                },
                xOffset: {
                    value: 20,
                    type: "range",
                    name: "xOffset",
                    label: "X-Offset"
                },
                color: {
                    value: "#000000",
                    type: "color",
                    name: "color",
                    label: "Color"
                },
                bgColor: {
                    value: "#ffffff",
                    type: "color",
                    name: "bgColor",
                    label: "Background Color"
                }
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.drawing = this.drawing.bind(this);
    }
    componentDidMount() {
        Paper.setup(this.canvas);
        Paper.project.clear();
        this.drawing(this.state.properties);
        Paper.project.view.scale(0.8);
    }
    
    componentDidUpdate() {
        Paper.setup(this.canvas);
        Paper.project.clear();
        this.drawing(this.state.properties);
        Paper.project.view.scale(0.8);
    }
    handleChange(e) {
        let property = e.target.name;
        if (e.target.type === "checkbox") {
            this.setState({
                key: new Date(),
                properties: {
                    ...this.state.properties,
                    [property]: {
                        ...this.state.properties[property],
                        value: e.target.checked
                    }
                }
            });
        } else {
            this.setState({
                key: new Date(),
                properties: {
                    ...this.state.properties,
                    [property]: {
                        ...this.state.properties[property],
                        value: parseInt(e.target.value)
                    }
                }
            });
        }
    }
    drawing(props) {
        //draw here
        let cir = new Paper.Path.Circle(Paper.view.center, props.size.value);
        cir.fillColor = props.color.value;
        cir.position.x += props.xOffset.value;
        cir.position.y += props.yOffset.value;
        cir.strokeColor = "red";
        cir.strokeWidth = props.strokeSize.value;
    }
    render() {
        return (
            <div
                style={{
                    padding: "10px",
                    margin: "10px",
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-evenly",
                    flexDirection: "row",
                    alignItems: "center"
                }}
            >

                <canvas
                    onClick={() => this.setState({ key: new Date() })}
                    style={{ backgroundColor: this.state.properties.bgColor }}
                    ref={ref => (this.canvas = ref)}
                    key={this.state.key}
                    width={window.innerWidth < 500 ? window.innerWidth - 50 : 500}
                    height={window.innerWidth < 500 ? window.innerWidth - 50 : 500}
                    id="myCanvas"
                    className="backgroundCanvas"
                />
            </div>
        );
    }
}

export default Drawing;
