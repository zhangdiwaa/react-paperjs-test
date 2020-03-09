import * as Paper from 'paper';
import EventHub from "./Observer";

/**
 * 页面发生改变时需要执行的函数
 * @constructor
 */
const PageChange = () => {
    let history: string[] | null = JSON.parse(localStorage.getItem("history"));
    localStorage.setItem("future", JSON.stringify([]))
    if (!history) {
        let current = Paper.project.exportJSON()
        history = [];
        localStorage.setItem("history", JSON.stringify(history))
    } else {
        let last = history[history.length - 1];
        if (last === Paper.project.exportJSON()) {
            return
        }
        // console.log("pageChange");
        if (history.length > 10) {
            history.splice(0, 1)
        }
        history.push(Paper.project.exportJSON());
        localStorage.setItem("history", JSON.stringify(history))
    }
}
//清空localStorage
localStorage.setItem("history", JSON.stringify([]))
localStorage.setItem("future", JSON.stringify([]))
// 当观察者收到mouseDownBefore的操作之后，执行PageChange方法
EventHub.on('mouseDownBefore', PageChange)
/**
 * 重做需要执行的代码
 * @constructor
 */
export const Redo = () => {
    let future: string[] | null = JSON.parse(localStorage.getItem("future"));
    let history: string[] | null = JSON.parse(localStorage.getItem("history"));
    if (future && future.length != 0) {
        history.push(Paper.project.exportJSON());
        Paper.project.clear();
        let last = future.pop();
        Paper.project.importJSON(last);
        localStorage.setItem("history", JSON.stringify(history));
        localStorage.setItem("future", JSON.stringify(future));
    }
}
/**
 * 撤销操作需要执行的代码
 * @constructor
 */
export const Undo = () => {
    let future: string[] | null = JSON.parse(localStorage.getItem("future"));
    let history: string[] | null = JSON.parse(localStorage.getItem("history"));
    if (!future) {
        future = [];
    }
    if (history && history.length != 0) {
        // if (future.length == 0) {
        //     history.pop()
        // }
        future.push(Paper.project.exportJSON());
        localStorage.setItem("future", JSON.stringify(future));
        Paper.project.clear();
        let last = history.pop();
        // console.log(history.length);
        Paper.project.importJSON(last);
        localStorage.setItem("history", JSON.stringify(history));
    }
}
