import { RemoveTool } from "./PaperTools";

/**
 * name ToolFreeLayout
 * desc 自由布局
 */
//目前尚有bug待修复
export const ToolFreeLayout = () => {
    RemoveTool()
    let tool: paper.Tool = new paper.Tool()
    tool.minDistance = 3;
    tool.maxDistance = 3;//设置曲线最短距离
    let Group:paper.Group=new paper.Group()//存放要布局的图元
    let children=[]
    for(let i=0;i<20;i++){//生成20个随机大小的矩形
        children.push(new paper.Path.Rectangle({
            from: new paper.Point(100,100),
            to: new paper.Point(Math.ceil(Math.random()*100)+110,Math.ceil(Math.random()*100+110)),
            strokeColor: "black",
            name: 'Rectangle'
        }))
    }
    for(let i=0;i<20;i++){//给矩形添加包围盒，并且随机给每个矩形偏移值
        let shape=children[i].toShape()
        let size=shape.size
        shape.remove()
        children[i].data.radius=Math.pow(size.width*size.width+size.height*size.height,0.5)
        children[i].data.offset=Math.random()*200-100
    }
    Group.addChildren(children)
    let path: paper.Path;
    //每当鼠标按下就新建一条路径
    tool.onMouseDown = (event: paper.ToolEvent) => {
        path = new paper.Path({
            strokeColor: "black",
            name: 'Path'
        })
    }
    tool.onMouseDrag = (event: paper.ToolEvent) => {
        path.add(event.point)
    }
    tool.onMouseUp = (event: paper.ToolEvent) => {
        getProperPath(path,Group)//将所画路径和要布局的图元传进getProperPath中进行布局计算
    }
}

const getProperPath=function(path:paper.Path,group:any)
{
    //获取合适的自由布局
    //定义常量：LARGE为1，表示放大倍数大
    //PROPER为2
    //SMALL为3
    let maxFactor=0
    let minFactor=0
    group.children.forEach((item)=>{
        maxFactor+=item.data.radius*2
    })
    minFactor=maxFactor/path.length*0.65//获取最小的缩放因子，不建议修改
    maxFactor=maxFactor/path.length*1.35//获取最大的缩放因子，不建议修改
    let middle=maxFactor
    getProperPointNumber(path,middle)//获取缩放因子之后，对Path进行点的添加或删除，使其适应缩放大小
    let flag=1
    let lastFlag=1
    let lastMiddle=maxFactor
    while(true){
        flag=freeLayoutCalculation(path.clone().scale(middle),group,false)//布局计算，将缩放后的path，group和，apply传入；apply为false，因为只是计算
        if(2==flag ||lastFlag!=flag)
        break
        lastFlag=flag
        if(flag==1)
        maxFactor=middle
        lastMiddle=middle
        middle=(maxFactor+minFactor)/2
    }
    if(flag==2){
        path.scale((middle+maxFactor)/2)
    }else{
        path.scale((lastMiddle+maxFactor)/2)
    }
    freeLayoutCalculation(path,group,true)//此处apply为true，则会实际改变图元的位置
}

const freeLayoutCalculation=function(path:any,group:any,apply:boolean){
    //自由布局计算，假设该算法必定会求出一个布局
    let index=0
    let i
    let lastCircleCenter:paper.Point=getCircleCenter(path.curves[0].point1,path.curves[1].point1,path.curves[1].point2,group.children[0].data.offset)
    if(apply){
        group.children[index].rotate(lastCircleCenter.subtract(path.curves[1].point1).angle,group.children[index].position)//将图元旋转到与路径垂直,待改进
        group.children[index].set({//改变图元的位置
            position:lastCircleCenter
        })
        //辅助线，方便看清旋转的角度
        let newp=new paper.Path({
            strokeColor: "black",
            name: 'Segment'
        })
        newp.add(lastCircleCenter)
        newp.add(path.curves[1].point1)
    }
    index++
    for(i=1;i<path.curves.length-1;i++){
        let circleCenter:paper.Point=getCircleCenter(path.curves[i].point1,path.curves[i+1].point1,path.curves[i+1].point2,group.children[index].data.offset)
        if(lastCircleCenter.getDistance(circleCenter)>=(group.children[index-1].data.radius+group.children[index].data.radius)*0.85){
            if(apply){
                group.children[index].rotate(circleCenter.subtract(path.curves[i+1].point1).angle,group.children[index].position)
                group.children[index].set({
                    position:circleCenter
                })
                //辅助线，方便看清旋转的角度
                let newp=new paper.Path({
                    strokeColor: "black",
                    name: 'Segment'
                })
                newp.add(circleCenter)
                newp.add(path.curves[i+1].point1)
            }
            index++
            lastCircleCenter=circleCenter
            i+=5 //步数建议在5~10
        }
        if(index>=group.children.length)
        break
    }
    if(!apply){
        if(index<group.children.length){
            path.remove()
            return 3
        }
        else if(path.curves.length-i>=5){
            path.remove()
            return 1
        }
        else{
            path.remove()
            return 2
        }
    }
}

const getProperPointNumber=function(path:any,factor:number){//增删path的点，如果点不够，则添加点
    let scaleTimes:number=Math.floor(Math.log2(factor))
    scaleTimes=scaleTimes>=4?4:scaleTimes //为了性能，限制缩放次数
    if(scaleTimes==0)//如果缩放次数为0，即为不用添加点就可以
    return ;
    let isEnlarge:boolean=scaleTimes>0?true:false
    for(let i=0;i<Math.abs(scaleTimes);i++)
    changePointNumber(path,isEnlarge)
}

const changePointNumber=function(path:any,isEnlarge:boolean){
    //新建一个Path来暂存更改
    let newPath:paper.Path=new paper.Path({
        strokeColor: "black",
        name: 'Path',
    })
    let i
    if(isEnlarge){//判断是否缩小和放大，放大则是两个点之间新增一个中点；缩小则是取点步长为2
        for(i=0;i<path.curves.length;i++){
            newPath.add(path.curves[i].point1)
            newPath.add(path.curves[i].point1.clone().add(path.curves[i].point2).divide(2))
        }
    }else{
        for(i=0;i<path.curves.length;i+=2){
            newPath.add(path.curves[i].point1)
        }
    }
    //应用更改
    path.copyContent(newPath)
    path.copyAttributes(newPath)
    newPath.remove()
}

const getCircleCenter=function(point1:paper.Point,point2:paper.Point,point3:paper.Point,radius:number){
    /*求法线点及法线长度*/
    let factor:paper.Point=new paper.Point(point1.y-point3.y,point3.x-point1.x)
    let r=point1.clone().getDistance(point3.clone())
    let circleCenter:paper.Point
    circleCenter=point2.clone().add(factor.clone().multiply(radius).divide(r))
    //console.log(circleCenter.subtract(point2))
    return circleCenter
}

const isIntersects=function(item:any,group:paper.Group,index:number){
    /**判断是否交叠 */
    for(let i=index;i>=0;i--){
        if(item.intersects(group.children[i]))
        return true
    }
    return false
}





// const getAuxiliaryPoint=function(point1:paper.Point,point2:paper.Point,point3:paper.Point){
//     /**求三点的圆心和半径 */
//     let A=point1.x*(point2.y-point3.y)
//     -point1.y*(point2.x-point3.x)
//     +point2.x*point3.y
//     -point3.x*point2.y;
//     let B=(point1.x*point1.x+point1.y*point1.y)*(point3.y-point2.y)
//     +(point2.x*point2.x+point2.y*point2.y)*(point1.y-point3.y)
//     +(point3.x*point3.x+point3.y*point3.y)*(point2.y-point1.y);
//     let C=(point1.x*point1.x+point1.y*point1.y)*(point2.x-point3.x)
//     +(point2.x*point2.x+point2.y*point2.y)*(point3.x-point1.x)
//     +(point3.x*point3.x+point3.y*point3.y)*(point1.x-point2.x);
//     let D=(point1.x*point1.x+point1.y*point1.y)*(point3.x*point2.y-point3.y*point2.x)
//     +(point2.x*point2.x+point2.y*point2.y)*(point1.x*point3.y-point1.y*point3.x)
//     +(point3.x*point3.x+point3.y*point3.y)*(point2.x*point1.y-point2.y*point1.x);
//     let x=-B/(2*A);
//     let y=-C/(2*A);
//     let temp=(B*B+C*C-4*A*D)/(4*A*A);
//     let r=Math.sqrt(temp);
//     // new paper.Path.Circle({
//     //     center: new paper.Point(x,y),
//     //     radius: r,
//     //     strokeColor: "red",
//     //     name: 'Circle'
//     // })
//     return [new paper.Point(x,y),r]
// }

/*
const freeLayoutCalculationInPath=function(path:any,group:any,apply:boolean){
    //自由布局计算，所求圆心在曲线内
    let index=0
    let i
    let lastCircleCenter:paper.Point=path.curves[0].point1
    group.children[index++].set({
        position:lastCircleCenter
    })
    for(i=1;i<path.curves.length-1;i++){
        if(lastCircleCenter.getDistance(path.curves[i].point1)>=(group.children[index].data.radius+group.children[index].data.radius)*0.8){
            apply?group.children[index++].set({
                position:path.curves[i].point1
            }):index++
            // if(isIntersects(group.children[index-1],group,index-1)){
            //     index--
            //     continue
            // }
            lastCircleCenter=path.curves[i].point1
            i+=Math.floor(group.children[index-1].bounds.width/2)
        }
        if(index>=group.children.length)
        break
    }
    if(!apply){
        if(index<group.children.length){
            path.remove()
            return 3
        }
        else if(path.curves.length-i>=5){
            path.remove()
            return 1
        }
        else{
            path.remove()
            return 2
        }
    }
}
*/

