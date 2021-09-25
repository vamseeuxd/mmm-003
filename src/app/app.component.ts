import {Component} from '@angular/core';
import {LoaderService} from './shared/loader/loader.service';
import {environment} from '../environments/environment';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  readonly isProduction = environment.production;
  public appPages = [
    {title: 'Inbox', url: '/folder/Inbox', icon: 'mail'},
    {title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane'},
    {title: 'Favorites', url: '/folder/Favorites', icon: 'heart'},
    {title: 'Archived', url: '/folder/Archived', icon: 'archive'},
    {title: 'Trash', url: '/folder/Trash', icon: 'trash'},
    {title: 'Spam', url: '/folder/Spam', icon: 'warning'},
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    public auth: AngularFireAuth,
    public loader: LoaderService) {
    window.loader = loader;
  }

  async logout() {
    await this.auth.signOut();
  }

  async login() {
    const loaderId = window.loader.show();
    try {
      await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      /*if (response && response.user && response.user.uid) {
        await this.router.navigate([this.usersService.pageBeforeLogOut]);
      }*/
      await window.loader.hide(loaderId);
    } catch (e) {
      await window.loader.hide(loaderId);
      console.log(e);
    }
  }
}
