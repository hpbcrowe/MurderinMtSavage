export class Notification {
  constructor(
    public notificationId: number,
    public applicationUserId: number,
    public notificationType: string,
    public message: string,
    public referenceId?: number,
    public isRead: boolean = false,
    public createdDate?: Date
  ) {}
}