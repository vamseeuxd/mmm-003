import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {LoaderService} from '../loader/loader.service';
import {shareReplay, switchMap, tap} from 'rxjs/operators';

export interface IPayee {
  id?: string | null;
  icon: string;
  uid: string;
  description: string;
  name: string;
  isDefault?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ManagePayeeService {
  tableNameAction: BehaviorSubject<string> = new BehaviorSubject<string>('payees');
  tableName$: Observable<string> = this.tableNameAction.asObservable();
  payees: IPayee[] = [];
  // eslint-disable-next-line @typescript-eslint/member-ordering
  dataLoaderId: string;
  private payees$: Observable<IPayee[]> = combineLatest(
    [
      this.loader.auth.user,
      this.tableName$
    ]
  ).pipe(
    switchMap(
      ([user, tableName]) => {
        if (!user) {
          return of([]);
        }

        this.dataLoaderId = this.loader.show(true, 'get Payee');
        // eslint-disable-next-line max-len
        const userPayees$ = this.firestore.collection<IPayee>(
          tableName,
          ref => ref.where('uid', '==', this.loader.user.providerData[0].uid)
        ).valueChanges({idField: 'id'});

        const defaultPayees$ = this.firestore.collection<IPayee>(
          `default-${tableName}`
        ).valueChanges({idField: 'id'});
        return combineLatest([
            defaultPayees$,
            userPayees$
          ]
        );
      }
    ),
    switchMap(
      ([defaultOptions, userOptions]) => of(
        [
          ...(defaultOptions ? defaultOptions.map(d => ({...d, isDefault: true})) : []),
          ...(userOptions ? userOptions.map(d => ({...d, isDefault: false})) : [])
        ]
      )
    ),
    shareReplay(),
    tap(async () => {
      await this.loader.hide(this.dataLoaderId);
    })
  );
  private payeesChangedAction: BehaviorSubject<Date | boolean> = new BehaviorSubject<Date | boolean>(true);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  payeesChanged$: Observable<Date | boolean> = this.payeesChangedAction.asObservable().pipe(shareReplay());

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    public loader: LoaderService,
  ) {
    this.getPayees().subscribe(value => {
      this.payees = value;
      this.payeesChangedAction.next(false);
    });
  }

  getPayeeId(id: string): IPayee {
    let payeeToReturn: IPayee;
    this.payees.forEach(payee => {
      if (id === payee.id) {
        payeeToReturn = payee;
      }
    });
    return payeeToReturn;
  }

  async deletePayee(value: IPayee) {
    const loaderId = this.loader.show(true, 'deletePayee');
    try {
      let collectionRef = this.firestore.collection<IPayee>(`${this.tableNameAction.value}`);
      if (value.isDefault) {
        collectionRef = this.firestore.collection<IPayee>(`default-${this.tableNameAction.value}`);
      }
      const docRef = collectionRef.ref.doc(value.id);
      await docRef.delete();
      await this.loader.hide(loaderId);
    } catch (e) {
      await this.loader.hide(loaderId);
    }
  }

  async addPayee(value: IPayee, isDefault = false) {
    const loaderId = this.loader.show(true, 'addPayee');
    let collectionRef = this.firestore.collection<IPayee>(`${this.tableNameAction.value}`);
    if (isDefault) {
      collectionRef = this.firestore.collection<IPayee>(`default-${this.tableNameAction.value}`);
    }
    const docRef = collectionRef.ref.doc();
    const uid = this.loader.user.providerData[0].uid;
    delete value.id;
    delete value.isDefault;
    try {
      await docRef.set({
        ...value,
        uid
      });
      await this.loader.hide(loaderId);
    } catch (e) {
      await this.loader.hide(loaderId);
    }
  }

  async updatePayee(value: IPayee, isDefault = false) {
    const loaderId = this.loader.show(true, 'updatePayee');
    let collectionRef = this.firestore.collection<IPayee>(`${this.tableNameAction.value}`);
    if (isDefault) {
      collectionRef = this.firestore.collection<IPayee>(`default-${this.tableNameAction.value}`);
    }
    const docRef = collectionRef.ref.doc(value.id);
    const uid = this.loader.user.providerData[0].uid;
    delete value.id;
    delete value.isDefault;
    try {
      await docRef.update({
        ...value,
        uid
      });
      await this.loader.hide(loaderId);
    } catch (e) {
      await this.loader.hide(loaderId);
    }
  }

  private getPayees(): Observable<IPayee[]> {
    return this.payees$;
  }

}
