import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoaderService} from '../shared/services/loader/loader.service';
import {UsersService} from '../shared/services/users/users.service';
import {AlertController, IonItemSliding} from '@ionic/angular';
import {delay} from 'rxjs/operators';
import {IPayer, ManagePayerService} from '../shared/services/manage-payer.service';

@Component({
  selector: 'app-manage-payers',
  templateUrl: './manage-payers.page.html',
  styleUrls: ['./manage-payers.page.scss'],
})
export class ManagePayersPage {

  loaded = false;

  constructor(
    public http: HttpClient,
    public loader: LoaderService,
    public usersService: UsersService,
    public alertController: AlertController,
    public payersService: ManagePayerService,
  ) {
    this.payersService.payersChanged$.pipe(delay(1000)).subscribe(() => {
      this.loaded = true;
    });
  }

  async deletePayer(payee: IPayer, sliding: IonItemSliding) {
    await sliding.close();
    const alert = await this.alertController.create({
      header: 'Delete Confirmation',
      message: `Are you sure! <br>Do you want to delete Payee?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Yes',
          handler: () => {
            this.payersService.deletePayer(payee);
          }
        }
      ]
    });

    await alert.present();
  }

}
