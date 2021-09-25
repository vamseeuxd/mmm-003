import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {LoadingController} from '@ionic/angular';
import firebase from 'firebase/compat/app';

@Injectable({providedIn: 'root'})
export class LoaderService {
  // eslint-disable-next-line @typescript-eslint/member-ordering
  user: firebase.User;
  private loaderRequestsList: number[] = [];
  private loaderSubject = new BehaviorSubject<boolean>(this.loaderRequestsList.length > 0);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  showLoader$ = this.loaderSubject.asObservable();
  private loading: HTMLIonLoadingElement;

  constructor(
    public auth: AngularFireAuth,
    public route: Router,
    private snackBar: MatSnackBar,
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

  show(): number {
    const id = new Date().getTime();
    this.loaderRequestsList.push(id);
    this.loaderSubject.next(this.loaderRequestsList.length > 0);
    if (this.loaderRequestsList.length > 0) {
      this.presentLoading();
    }
    return id;
  }

  showAsync(): Observable<number> {
    const id = new Date().getTime();
    this.loaderRequestsList.push(id);
    this.loaderSubject.next(this.loaderRequestsList.length > 0);
    if (this.loaderRequestsList.length > 0) {
      this.presentLoading();
    }
    return of(id);
  }

  async hide(loaderId: number): Promise<any> | undefined {
    this.loaderRequestsList = this.loaderRequestsList.filter(id => id !== loaderId);
    this.loaderSubject.next(this.loaderRequestsList.length > 0);
    if (this.loaderRequestsList.length === 0 && this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }

  private async presentLoading() {
    if (!this.loading) {
      this.loading = await this.loadingController.create({message: 'Please wait...', duration: null});
    }
    await this.loading.present();
  }
}
