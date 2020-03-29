import React, {useEffect} from "react";
import Paper, {PaperScope} from "paper";

const MimiMap = () => {

    let MiniCanvas = null;

    useEffect(() => {
        Paper.setup(MiniCanvas);
        var path1 = new paper.Path.Line({
            from: [20, 20],
            to: [80, 80],
            strokeColor: 'black'
        });
        let path2: paper.Path.Circle = new paper.Path.Circle({
            center: [80,50],
            radius: 30,
            strokeColor: "black"
        })
        
    });

    return (
        
        <canvas style={{ height: "100%", width: "100%"}}
         ref={ref => {
         MiniCanvas = ref
         }} id='MiniCanvas'/>
    )
    
}

export default MimiMap
