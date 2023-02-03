import fs from 'fs';
import ejs from 'ejs';
import { INotificationTemplate } from '@notification/interfaces/notification.interface';

class NotificationTemplate {
  public notificationMessageTemplate(templateParams: INotificationTemplate): string {
    const { username, message, header } = templateParams;
    return ejs.render(fs.readFileSync(__dirname + '/forgot-password-template.ejs', 'utf-8'), {
      username,
      message,
      header,
      image_url: ''
    });
  }
}

export const notificationTemplate: NotificationTemplate = new NotificationTemplate();
