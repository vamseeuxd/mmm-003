import {Component} from '@angular/core';
import {LoaderService} from './shared/services/loader/loader.service';
import {environment} from '../environments/environment';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import {UsersService} from './shared/services/users/users.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  readonly isProduction = environment.production;
  public appPages = [
    {title: 'Manage Transactions', url: '/manage-transactions', icon: 'cash'},
    {title: 'Manage Categories', url: '/manage-categories', icon: 'apps'},
    {title: 'Manage Payee', url: '/manage-payee', icon: 'person-remove'},
    {title: 'Manage Payers', url: '/manage-payers', icon: 'person-add'},
  ];

  /*https://www.quora.com/What-do-payee-payer-mean*/

  constructor(
    public auth: AngularFireAuth,
    public usersService: UsersService,
    public loader: LoaderService) {
    window.loader = loader;
  }

  async logout() {
    await this.auth.signOut();
  }

  async login() {
    const loaderId = this.loader.show(true,'Login');
    try {
      await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      /*if (response && response.user && response.user.uid) {
        await this.router.navigate([this.usersService.pageBeforeLogOut]);
      }*/
      await this.loader.hide(loaderId);
    } catch (e) {
      await this.loader.hide(loaderId);
      console.log(e);
    }
  }
}
