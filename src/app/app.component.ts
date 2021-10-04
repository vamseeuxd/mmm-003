import {Component, OnDestroy} from '@angular/core';
import {LoaderService} from './shared/services/loader/loader.service';
import {environment} from '../environments/environment';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import {UsersService} from './shared/services/users/users.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {PromptUpdateServiceService} from './shared/services/service-worker/prompt-update-service/prompt-update-service.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {
  readonly isProduction = environment.production;
  userSubscription: Subscription;
  public appPages = [
    {title: 'Manage Transactions', url: '/manage-transactions', icon: 'cash'},
    {title: 'Manage Categories', url: '/manage-categories', icon: 'apps'},
    {title: 'Manage Payees', url: '/manage-payee', icon: 'person-remove'},
    {title: 'Manage Payers', url: '/manage-payers', icon: 'person-add'},
    {title: 'Manage Expenses For', url: '/manage-expenses-for', icon: 'people'},
    {title: 'Tax Deductions', url: '/manage-tax-deduction', icon: 'grid'},
  ];

  /*https://www.quora.com/What-do-payee-payer-mean*/

  constructor(
    public auth: AngularFireAuth,
    public usersService: UsersService,
    public router: Router,
    public promptUpdateServiceService: PromptUpdateServiceService,
    public loader: LoaderService) {
    window.loader = loader;
    this.userSubscription = this.auth.user.subscribe(async value => {
      if (value) {
        // await this.router.navigate([this.usersService.pageBeforeLogOut]);
      }else {
        await this.router.navigate(['login']);
      }
    });
  }

  ngOnDestroy(): void {
    if(this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  async logout() {
    await this.auth.signOut();
    await this.router.navigate(['login']);
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
