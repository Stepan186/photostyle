export abstract class BaseNotificationChannel {
    abstract notify(notifiable: any, notification: any): void | Promise<void>;
}