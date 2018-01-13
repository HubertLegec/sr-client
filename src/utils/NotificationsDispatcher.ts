import {Notification} from "react-notification-system";

export type NotificationHandler = (notification: Notification) => void;

export enum NotificationLevel {
    ERROR = "error",
    WARNING = "warning",
    SUCCESS = "success",
    INFO = "info"
}

export class NotificationsDispatcher {
    private handlers: NotificationHandler[] = [];

    publishNotification(title: string, message: string, level: NotificationLevel) {
        console.log(`Publish notification, title:  ${title}, message: ${message}`);
        const notification = {
            title,
            level,
            message
        } as Notification;
        this.handlers.forEach(h => h(notification));
    }

    addHandler(handler: NotificationHandler) {
        console.log('add handler');
        this.handlers = [handler];
    }
}