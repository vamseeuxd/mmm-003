import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {LoaderService} from '../loader/loader.service';
import {shareReplay, switchMap, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

export interface ITaxDeduction {
  id?: string | null;
  icon: string;
  uid?: string;
  description: string;
  name: string;
  isDefault?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ManageTaxDeductionService {
  tableNameAction: BehaviorSubject<string> = new BehaviorSubject<string>('taxDeductions');
  tableName$: Observable<string> = this.tableNameAction.asObservable();
  lastAddedId = '';
  taxDeductions: ITaxDeduction[] = [];
  // eslint-disable-next-line @typescript-eslint/member-ordering
  dataLoaderId: string;
  private taxDeductions$: Observable<ITaxDeduction[]> = combineLatest(
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

        this.dataLoaderId = this.loader.show(true, 'get TaxDeduction');
        // eslint-disable-next-line max-len
        const userTaxDeductions$ = this.firestore.collection<ITaxDeduction>(
          tableName,
          ref => ref.where('uid', '==', this.loader.user.providerData[0].uid)
        ).valueChanges({idField: 'id'});

        const defaultTaxDeductions$ = this.firestore.collection<ITaxDeduction>(
          `default-${tableName}`
        ).valueChanges({idField: 'id'});
        return combineLatest([
            defaultTaxDeductions$,
            userTaxDeductions$
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
  private taxDeductionsChangedAction: BehaviorSubject<Date | boolean> = new BehaviorSubject<Date | boolean>(true);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  taxDeductionsChanged$: Observable<Date | boolean> = this.taxDeductionsChangedAction.asObservable().pipe(shareReplay());

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    public http: HttpClient,
    public loader: LoaderService,
  ) {
    this.getTaxDeductions().subscribe(value => {
      this.taxDeductions = value;
      this.taxDeductionsChangedAction.next(false);
    });
    /*this.http.get<any[]>('./assets/tax-deduction.json').subscribe(value => {
      // console.log(value);
      const collectionRef = this.firestore.collection<ITaxDeduction>(`default-${this.tableNameAction.value}`);
      const batch = collectionRef.ref.firestore.batch();
      value.forEach(value1 => {
        const docRef = collectionRef.ref.doc();
        batch.set(docRef, value1);
      });
      batch.commit().then(value1 => {
        debugger;
      }).catch(reason => {
        debugger;
      });
    });*/
  }

  getTaxDeductionId(id: string): ITaxDeduction {
    let taxDeductionToReturn: ITaxDeduction;
    this.taxDeductions.forEach(taxDeduction => {
      if (id === taxDeduction.id) {
        taxDeductionToReturn = taxDeduction;
      }
    });
    return taxDeductionToReturn;
  }

  async deleteTaxDeduction(value: ITaxDeduction) {
    const loaderId = this.loader.show(true, 'deleteTaxDeduction');
    try {
      let collectionRef = this.firestore.collection<ITaxDeduction>(`${this.tableNameAction.value}`);
      if (value.isDefault) {
        collectionRef = this.firestore.collection<ITaxDeduction>(`default-${this.tableNameAction.value}`);
      }
      const docRef = collectionRef.ref.doc(value.id);
      await docRef.delete();
      await this.loader.hide(loaderId);
    } catch (e) {
      await this.loader.hide(loaderId);
    }
  }

  async addTaxDeduction(value: ITaxDeduction, isDefault = false) {
    const loaderId = this.loader.show(true, 'addTaxDeduction');
    let collectionRef = this.firestore.collection<ITaxDeduction>(`${this.tableNameAction.value}`);
    if (isDefault) {
      collectionRef = this.firestore.collection<ITaxDeduction>(`default-${this.tableNameAction.value}`);
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

  async updateTaxDeduction(value: ITaxDeduction, isDefault = false) {
    const loaderId = this.loader.show(true, 'updateTaxDeduction');
    let collectionRef = this.firestore.collection<ITaxDeduction>(`${this.tableNameAction.value}`);
    if (isDefault) {
      collectionRef = this.firestore.collection<ITaxDeduction>(`default-${this.tableNameAction.value}`);
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

  private getTaxDeductions(): Observable<ITaxDeduction[]> {
    return this.taxDeductions$;
  }

}
