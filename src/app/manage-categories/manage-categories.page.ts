import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoaderService} from '../shared/services/loader/loader.service';
import {ICategory, ManageCategoriesService} from '../shared/services/manage-categories/manage-categories.service';
import {AlertController, IonItemSliding} from '@ionic/angular';
import {UsersService} from '../shared/services/users/users.service';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.page.html',
  styleUrls: ['./manage-categories.page.scss'],
})
export class ManageCategoriesPage {

  loaded = false;

  constructor(
    public http: HttpClient,
    public loader: LoaderService,
    public usersService: UsersService,
    public alertController: AlertController,
    public categoriesService: ManageCategoriesService,
  ) {
    this.categoriesService.categoriesChanged$.pipe(delay(1000)).subscribe(() => {
      this.loaded = true;
    });
  }

  async deleteCategory(category: ICategory, sliding: IonItemSliding) {
    await sliding.close();
    const alert = await this.alertController.create({
      header: 'Delete Confirmation',
      message: `Are you sure! <br>Do you want to delete Category?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Yes',
          handler: () => {
            this.categoriesService.deleteCategory(category);
          }
        }
      ]
    });

    await alert.present();
  }
}
