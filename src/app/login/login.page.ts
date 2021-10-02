import {Component, OnDestroy} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {UsersService} from '../shared/services/users/users.service';
import {Router} from '@angular/router';
import {LoaderService} from '../shared/services/loader/loader.service';
import firebase from 'firebase/compat/app';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnDestroy {
  userSubscription: Subscription;

  constructor(
    public auth: AngularFireAuth,
    public usersService: UsersService,
    public loader: LoaderService,
    public router: Router,
  ) {
    this.userSubscription = this.auth.user.subscribe(async value => {
      if (value) {
        await this.router.navigate([this.usersService.pageBeforeLogOut]);
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
  }

  async login() {
    const loaderId = this.loader.show();
    try {
      const response = await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      if (response && response.user && response.user.uid) {
        await this.router.navigate([this.usersService.pageBeforeLogOut]);
      }
      await this.loader.hide(loaderId);
    } catch (e) {
      await this.loader.hide(loaderId);
      console.log(e);
    }
  }

}
