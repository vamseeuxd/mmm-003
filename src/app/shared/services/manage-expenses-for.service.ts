import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {shareReplay, switchMap, tap} from 'rxjs/operators';
import {LoaderService} from './loader/loader.service';

export interface IExpensesFor {
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
export class ManageExpensesForService {
  tableNameAction: BehaviorSubject<string> = new BehaviorSubject<string>('expensesFor');
  tableName$: Observable<string> = this.tableNameAction.asObservable();
  expensesFor: IExpensesFor[] = [];
  // eslint-disable-next-line @typescript-eslint/member-ordering
  dataLoaderId: string;
  private expensesFor$: Observable<IExpensesFor[]> = combineLatest(
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

        this.dataLoaderId = this.loader.show(true, 'get ExpensesFor');
        // eslint-disable-next-line max-len
        const userExpensesFor$ = this.firestore.collection<IExpensesFor>(
          tableName,
          ref => ref.where('uid', '==', this.loader.user.providerData[0].uid)
        ).valueChanges({idField: 'id'});

        const defaultExpensesFor$ = this.firestore.collection<IExpensesFor>(
          `default-${tableName}`
        ).valueChanges({idField: 'id'});
        return combineLatest([
            defaultExpensesFor$,
            userExpensesFor$
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
  private expensesForChangedAction: BehaviorSubject<Date | boolean> = new BehaviorSubject<Date | boolean>(true);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  expensesForChanged$: Observable<Date | boolean> = this.expensesForChangedAction.asObservable().pipe(shareReplay());

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    public loader: LoaderService,
  ) {
    this.getExpensesFor().subscribe(value => {
      this.expensesFor = value;
      this.expensesForChangedAction.next(false);
    });
  }

  getExpensesForId(id: string): IExpensesFor {
    let expensesforToReturn: IExpensesFor;
    this.expensesFor.forEach(expensesfor => {
      if (id === expensesfor.id) {
        expensesforToReturn = expensesfor;
      }
    });
    return expensesforToReturn;
  }

  async deleteExpensesFor(value: IExpensesFor) {
    const loaderId = this.loader.show(true, 'deleteExpensesFor');
    try {
      let collectionRef = this.firestore.collection<IExpensesFor>(`${this.tableNameAction.value}`);
      if (value.isDefault) {
        collectionRef = this.firestore.collection<IExpensesFor>(`default-${this.tableNameAction.value}`);
      }
      const docRef = collectionRef.ref.doc(value.id);
      await docRef.delete();
      await this.loader.hide(loaderId);
    } catch (e) {
      await this.loader.hide(loaderId);
    }
  }

  async addExpensesFor(value: IExpensesFor, isDefault = false) {
    const loaderId = this.loader.show(true, 'addExpensesFor');
    let collectionRef = this.firestore.collection<IExpensesFor>(`${this.tableNameAction.value}`);
    if (isDefault) {
      collectionRef = this.firestore.collection<IExpensesFor>(`default-${this.tableNameAction.value}`);
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

  async updateExpensesFor(value: IExpensesFor, isDefault = false) {
    const loaderId = this.loader.show(true, 'updateExpensesFor');
    let collectionRef = this.firestore.collection<IExpensesFor>(`${this.tableNameAction.value}`);
    if (isDefault) {
      collectionRef = this.firestore.collection<IExpensesFor>(`default-${this.tableNameAction.value}`);
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

  private getExpensesFor(): Observable<IExpensesFor[]> {
    return this.expensesFor$;
  }

}
