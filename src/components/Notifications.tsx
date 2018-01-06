import * as React from "react";
import * as NotificationSystem from "react-notification-system";
import {notificationDispatcher} from "../index";

export class Notifications extends React.Component<{}, {}> {
    private notificationSystem;

    componentDidMount() {
        this.notificationSystem = this.refs.notificationSystem;
        notificationDispatcher.addHandler(n => this.notificationSystem.addNotification(n));
    }

    render() {
        return <NotificationSystem ref="notificationSystem"/>
    }
}
