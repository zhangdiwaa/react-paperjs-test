import React from "react";
import * as paper from 'paper';

/**
 * 页面发生改变时需要执行的函数
 * @constructor
 */
export const PageChange = () => {
    let history: string[] | null = JSON.parse(localStorage.getItem("history"));
    localStorage.setItem("future", JSON.stringify([]))
    if (!history) {
        history = [paper.project.exportJSON()];
        localStorage.setItem("history", JSON.stringify(history))
    } else {
        // console.log("pageChange");
        if (history.length > 10) {
            history.splice(0, 1)
        }
        history.push(paper.project.exportJSON());
        localStorage.setItem("history", JSON.stringify(history))
    }
}
/**
 * 重做需要执行的代码
 * @constructor
 */
export const Redo = () => {
    let future: string[] | null = JSON.parse(localStorage.getItem("future"));
    let history: string[] | null = JSON.parse(localStorage.getItem("history"));
    if (future && future.length != 0) {
        history.push(paper.project.exportJSON());
        paper.project.clear();
        let last = future.pop();
        paper.project.importJSON(last);
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
        future.push(paper.project.exportJSON());
        localStorage.setItem("future", JSON.stringify(future));
        paper.project.clear();
        let last = history.pop();
        // console.log(history.length);
        paper.project.importJSON(last);
        localStorage.setItem("history", JSON.stringify(history));
    }
}
