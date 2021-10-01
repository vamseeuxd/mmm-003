import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoaderService} from '../shared/services/loader/loader.service';
import {UsersService} from '../shared/services/users/users.service';
import {AlertController, IonItemSliding} from '@ionic/angular';
import {delay} from 'rxjs/operators';
import {IPayee, ManagePayeeService} from '../shared/services/manage-payee/manage-payee.service';

@Component({
  selector: 'app-manage-payee',
  templateUrl: './manage-payee.page.html',
  styleUrls: ['./manage-payee.page.scss'],
})
export class ManagePayeePage {

  loaded = false;

  constructor(
    public http: HttpClient,
    public loader: LoaderService,
    public usersService: UsersService,
    public alertController: AlertController,
    public payeesService: ManagePayeeService,
  ) {
    this.payeesService.payeesChanged$.pipe(delay(1000)).subscribe(() => {
      this.loaded = true;
    });
  }

  async deletePayee(payee: IPayee, sliding: IonItemSliding) {
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
            this.payeesService.deletePayee(payee);
          }
        }
      ]
    });

    await alert.present();
  }

}
