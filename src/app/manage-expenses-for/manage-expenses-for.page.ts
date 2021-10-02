import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoaderService} from '../shared/services/loader/loader.service';
import {UsersService} from '../shared/services/users/users.service';
import {AlertController, IonItemSliding} from '@ionic/angular';
import {delay} from 'rxjs/operators';
import {IExpensesFor, ManageExpensesForService} from '../shared/services/manage-expenses-for.service';

@Component({
  selector: 'app-manage-expenses-for',
  templateUrl: './manage-expenses-for.page.html',
  styleUrls: ['./manage-expenses-for.page.scss'],
})
export class ManageExpensesForPage {

  loaded = false;

  constructor(
    public http: HttpClient,
    public loader: LoaderService,
    public usersService: UsersService,
    public alertController: AlertController,
    public expensesForService: ManageExpensesForService,
  ) {
    this.expensesForService.expensesForChanged$.pipe(delay(1000)).subscribe(() => {
      this.loaded = true;
    });
  }

  async deleteExpensesFor(payee: IExpensesFor, sliding: IonItemSliding) {
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
            this.expensesForService.deleteExpensesFor(payee);
          }
        }
      ]
    });

    await alert.present();
  }

}
