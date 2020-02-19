import React from "react";
import Paper from "paper";

class Drawing extends React.Component {

    

    componentDidMount() {
        console.log("componentDidMount", this.canvas)
        Paper.setup(this.canvas);
        Paper.project.clear();
        this.drawing();
        Paper.project.view.scale(0.8);
    }
    
    componentDidUpdate() {
        console.log("componentDidMount", this.canvas)
        Paper.setup(this.canvas);
        Paper.project.clear();
        this.drawing();
        Paper.project.view.scale(0.8);
    }
    
    drawing(props) {
        //draw here
        let cir = new Paper.Path.Circle(Paper.view.center, 20);
        cir.strokeColor = "red";
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
                /* 这个ref很关键 */
                    ref={ref => (this.canvas = ref)}
                    style={{ border: "1px solid #000", height: "500px", width: "500px"}}
                    id="myCanvas"
                    className="backgroundCanvas"
                />
            </div>
        );
    }
}

export default Drawing;
