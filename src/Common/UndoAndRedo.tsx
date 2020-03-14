import * as Paper from 'paper';
import EventHub from "./Observer";
//记录鼠标按下时的canvas的数据
let last: string | null;
/**
 * 页面发生改变之前（鼠标按下之前），时需要执行的函数
 * @constructor
 */
const PageChangeBefore = () => {
    //导出鼠标按下之后的canvas图层，便于当鼠标释放之后，对比页面是否发生改变
    last = Paper.project.exportJSON()
}
/**
 * 页面发生改变之后（鼠标释放之后），需要执行的函数
 * @constructor
 */
const PageChangeAfter = () => {
    let history: string[] | null = JSON.parse(localStorage.getItem("history"));
    //判断history数组是否存在
    if (!history) {
        history = [];
    }
    //判断页面是否发生更改
    if (last === Paper.project.exportJSON()) {
        return
    }
    // 每次页面改变都要确保重做的栈为空
    localStorage.setItem("future", JSON.stringify([]))
    // 如果history数组中的数量达到了10，则删除索引为0
    if (history.length > 9) {
        history.splice(0, 1)
    }
    // 压入页面改变之前的页面
    history.push(last);
    // 将新的数组替换掉之前的history
    localStorage.setItem("history", JSON.stringify(history))

}
/**
 * 重做需要执行的代码
 * @constructor
 */
const Redo = () => {
    let future: string[] | null = JSON.parse(localStorage.getItem("future"));
    let history: string[] | null = JSON.parse(localStorage.getItem("history"));
    //当重做栈为空时，不执行重操作
    if (future && future.length !== 0) {
        //将当前页面当如history数组中
        history.push(Paper.project.exportJSON());
        //清空页面
        Paper.project.clear();
        //导入json
        Paper.project.importJSON(future.pop());
        //将修改后的数组存放至本地中
        localStorage.setItem("history", JSON.stringify(history));
        localStorage.setItem("future", JSON.stringify(future));
        //发送执行redo的消息
        EventHub.emit('redo', null)
    }
}
/**
 * 撤销操作需要执行的代码
 * @constructor
 */
const Undo = () => {
    let future: string[] | null = JSON.parse(localStorage.getItem("future"));
    let history: string[] | null = JSON.parse(localStorage.getItem("history"));
    // history存在且不为空
    if (history && history.length !== 0) {
        //压入当前页面
        future.push(Paper.project.exportJSON());
        //清空页面
        Paper.project.clear();
        //导入json
        Paper.project.importJSON(history.pop());
        //将修改后的数组存放至本地中
        localStorage.setItem("future", JSON.stringify(future));
        localStorage.setItem("history", JSON.stringify(history));
        //发送执行redo的消息
        EventHub.emit('undo', null)
    }
}

export {
    PageChangeBefore,
    PageChangeAfter,
    Undo,
    Redo
}
