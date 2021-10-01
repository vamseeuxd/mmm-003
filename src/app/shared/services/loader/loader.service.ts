import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {LoadingController} from '@ionic/angular';
import firebase from 'firebase/compat/app';

@Injectable({providedIn: 'root'})
export class LoaderService {
  // eslint-disable-next-line @typescript-eslint/member-ordering
  user: firebase.User;
  public loaderRequestsList: string[] = [];
  private loaderSubject = new BehaviorSubject<boolean>(this.loaderRequestsList.length > 0);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private loading: HTMLIonLoadingElement;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  isLoader: boolean;

  constructor(
    public auth: AngularFireAuth,
    public route: Router,
    public loadingController: LoadingController
  ) {
    this.auth.user.subscribe(value => {
      if (value) {
        this.user = value;
      } else {
        this.user = undefined;
      }
    });
  }

  show(autoHide = true, prefix = ''): string {
    const id = prefix + '+' + new Date().getTime();
    this.loaderRequestsList.push(id);
    this.loaderSubject.next(this.loaderRequestsList.length > 0);
    if (this.loaderRequestsList.length > 0 && !this.loading) {
      this.presentLoading(5000).then(() => {
        document.body.append(document.querySelector('ion-loading'));
      });
    }
    return id;
  }

  showAsync(autoHide = true, prefix = ''): Observable<string> {
    const id = prefix + '+' + new Date().getTime();
    this.loaderRequestsList.push(id);
    this.loaderSubject.next(this.loaderRequestsList.length > 0);
    if (this.loaderRequestsList.length > 0) {
      this.presentLoading(5000).then(() => {
        document.body.append(document.querySelector('ion-loading'));
      });
    }
    return of(id);
  }

  async hide(loaderId: string): Promise<any> | undefined {
    if(this.loaderRequestsList.includes(loaderId)) {
      this.loaderRequestsList = this.loaderRequestsList.filter(id => id !== loaderId);
      this.loaderSubject.next(this.loaderRequestsList.length > 0);
      if (this.loaderRequestsList.length === 0 && this.isLoader && this.loading) {
        await this.loading.dismiss();
        this.loading = null;
        this.isLoader = false;
      }
    }
  }

  private async presentLoading(duration) {
    if (!this.isLoader) {
      this.isLoader = true;
      this.loading = await this.loadingController.create({message: 'Please wait...', duration});
      await this.loading.present();
    }
  }
}
