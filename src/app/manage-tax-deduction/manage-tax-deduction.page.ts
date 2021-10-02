import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoaderService} from '../shared/services/loader/loader.service';
import {UsersService} from '../shared/services/users/users.service';
import {AlertController, IonItemSliding} from '@ionic/angular';
import {delay} from 'rxjs/operators';
import {
  ITaxDeduction,
  ManageTaxDeductionService
} from '../shared/services/manage-tax-deduction/manage-tax-deduction.service';

@Component({
  selector: 'app-manage-tax-deduction',
  templateUrl: './manage-tax-deduction.page.html',
  styleUrls: ['./manage-tax-deduction.page.scss'],
})
export class ManageTaxDeductionPage {

  loaded = false;
  selectedItem: ITaxDeduction;

  constructor(
    public http: HttpClient,
    public loader: LoaderService,
    public usersService: UsersService,
    public alertController: AlertController,
    public taxDeductionsService: ManageTaxDeductionService,
  ) {
    this.taxDeductionsService.taxDeductionsChanged$.pipe(delay(1000)).subscribe(() => {
      this.loaded = true;
    });
  }

  async deleteTaxDeduction(payee: ITaxDeduction, sliding: IonItemSliding) {
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
            this.taxDeductionsService.deleteTaxDeduction(payee);
          }
        }
      ]
    });

    await alert.present();
  }

}
