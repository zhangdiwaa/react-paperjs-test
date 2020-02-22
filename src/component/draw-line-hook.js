import React, {useEffect} from "react";
import Paper from "paper";

const Line = () => {
    let myCanvas = null;

    //画线
    let line = null;
    let lineTool = null;
    let mouseTool = null;

    useEffect(() => {
        console.log(myCanvas)
        Paper.setup(myCanvas);
        Paper.project.clear();

        mouseTool = new Paper.Tool();
        lineTool = new Paper.Tool();
        lineTool.onMouseDown = (e) => {
            line = new Paper.Path();
            line.strokeColor = '#000';
            line.add(e.point);
        };

        lineTool.onMouseDrag = (e) => {
            line.removeSegment(1);
            line.add(e.point);
        }

        lineTool.onMouseUp = (e) => {
            line.removeSegment(1);
            line.add(e.point);
            mouseTool.activate()
        }
        mouseTool.activate()
    });

    return (
        <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "space-evenly",
            flexDirection: "row",
            alignItems: "center"
        }}>
            <table>
                <tbody>
                <tr>
                    <td style={{textAlign: 'center'}}>
                        <a href='#' onClick={() => {
                            lineTool.activate()
                        }}>点击画直线</a>
                    </td>
                </tr>
                <tr>
                    <td>
                        <canvas
                            style={{border: "1px solid #000", height: "500px", width: "500px"}}
                            ref={ref => {
                                myCanvas = ref
                            }} id='myCanvas'/>
                    </td>
                </tr>
                </tbody>
            </table>


        </div>
    )
}

export default Line
