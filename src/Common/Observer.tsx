import React from "react";

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
    on(eventName, callback) {
        if (!events[eventName]) {
            events[eventName] = []
        }
        events[eventName].push(callback);
    }
}
export default EventHub;
