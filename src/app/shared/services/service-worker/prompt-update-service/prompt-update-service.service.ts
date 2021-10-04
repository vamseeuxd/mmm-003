import {Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {AlertController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PromptUpdateServiceService {

  constructor(
    updates: SwUpdate,
    public alertController: AlertController,
  ) {

    updates.available.subscribe(async () => {

      const alert = await this.alertController.create({
        header: 'Software Update',
        message: `New Software Update is available`,
        buttons: [
          {
            text: 'OK',
            handler: () => {
              updates.activateUpdate().then(() => document.location.reload());
            }
          }
        ]
      });

      await alert.present();
    });

    updates.unrecoverable.subscribe(async event => {

      const alert = await this.alertController.create({
        header: 'Software Update',
        message: `An error occurred that we cannot recover from:\\n${event.reason}\\n\\n\` + 'Please reload the page.`,
        buttons: [
          {
            text: 'OK',
            handler: () => {
              // updates.activateUpdate().then(() => document.location.reload());
            }
          }
        ]
      });

      await alert.present();
    });
  }
}
