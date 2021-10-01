import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {LoaderService} from '../loader/loader.service';

// eslint-disable-next-line @typescript-eslint/naming-convention
export type USER_ROLES = 'admin' | 'user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  role: USER_ROLES = 'user';
  pageBeforeLogOut = 'manage-transactions';

  constructor(
    private auth: AngularFireAuth,
    private loader: LoaderService,
    private firestore: AngularFirestore,
  ) {
    this.auth.user.subscribe(user => {
      this.role = 'user';
      if (user && user.providerData && user.providerData.length > 0 && user.providerData[0] && user.providerData[0].uid) {
        const loaderId = this.loader.show(true, 'role');
        this.firestore.doc(`users/${user.providerData[0].uid}`).valueChanges().subscribe((value: any) => {
          // console.log('this.role', this.role, value);
          if (!value) {
            // @ts-ignore
            this.firestore.collection<any>(`users`).doc(user.providerData[0].uid).set({
              ...user.providerData[0],
              role: 'user'
            }).then(() => {
              setTimeout(async ()=>{
                await this.loader.hide(loaderId);
              },500);
            });
          } else {
            setTimeout(async ()=>{
              await this.loader.hide(loaderId);
              this.role = value.role;
            },500);
          }
          // sub.unsubscribe();
        });
      }
    });
  }
}
