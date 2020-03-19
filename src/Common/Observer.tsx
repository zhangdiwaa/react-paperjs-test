// import React from "react";

let events = {};
const EventHub = {
    emit(eventName, data) {
        if (!events[eventName]) {
            return;
        }
        events[eventName].forEach(callback => {
            callback.call(null, data);
        })
    },
    on(eventName, callbacks) {
        if (!events[eventName]) {
            events[eventName] = []
        }
        callbacks.forEach(callback=>{
            events[eventName].push(callback);
        })
    }
}
export default EventHub;
