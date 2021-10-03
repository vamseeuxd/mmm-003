import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {shareReplay, switchMap, tap} from 'rxjs/operators';
import {LoaderService} from '../loader/loader.service';

export interface IPayer {
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
export class ManagePayerService {
  tableNameAction: BehaviorSubject<string> = new BehaviorSubject<string>('payers');
  tableName$: Observable<string> = this.tableNameAction.asObservable();
  payers: IPayer[] = [];
  // eslint-disable-next-line @typescript-eslint/member-ordering
  dataLoaderId: string;
  private payers$: Observable<IPayer[]> = combineLatest(
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

        this.dataLoaderId = this.loader.show(true, 'get Payer');
        // eslint-disable-next-line max-len
        const userPayers$ = this.firestore.collection<IPayer>(
          tableName,
          ref => ref.where('uid', '==', this.loader.user.providerData[0].uid)
        ).valueChanges({idField: 'id'});

        const defaultPayers$ = this.firestore.collection<IPayer>(
          `default-${tableName}`
        ).valueChanges({idField: 'id'});
        return combineLatest([
            defaultPayers$,
            userPayers$
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
  private payersChangedAction: BehaviorSubject<Date | boolean> = new BehaviorSubject<Date | boolean>(true);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  payersChanged$: Observable<Date | boolean> = this.payersChangedAction.asObservable().pipe(shareReplay());

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    public loader: LoaderService,
  ) {
    this.getPayers().subscribe(value => {
      this.payers = value;
      this.payersChangedAction.next(false);
    });
  }

  getPayerId(id: string): IPayer {
    let payerToReturn: IPayer;
    this.payers.forEach(payer => {
      if (id === payer.id) {
        payerToReturn = payer;
      }
    });
    return payerToReturn;
  }

  async deletePayer(value: IPayer) {
    const loaderId = this.loader.show(true, 'deletePayer');
    try {
      let collectionRef = this.firestore.collection<IPayer>(`payers`);
      if (value.isDefault) {
        collectionRef = this.firestore.collection<IPayer>(`default-payers`);
      }
      const docRef = collectionRef.ref.doc(value.id);
      await docRef.delete();
      await this.loader.hide(loaderId);
    } catch (e) {
      await this.loader.hide(loaderId);
    }
  }

  async addPayer(value: IPayer, isDefault = false) {
    const loaderId = this.loader.show(true, 'addPayer');
    let collectionRef = this.firestore.collection<IPayer>(`payers`);
    if (isDefault) {
      collectionRef = this.firestore.collection<IPayer>(`default-payers`);
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

  async updatePayer(value: IPayer, isDefault = false) {
    const loaderId = this.loader.show(true, 'updatePayer');
    let collectionRef = this.firestore.collection<IPayer>(`payers`);
    if (isDefault) {
      collectionRef = this.firestore.collection<IPayer>(`default-payers`);
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

  private getPayers(): Observable<IPayer[]> {
    return this.payers$;
  }

}
