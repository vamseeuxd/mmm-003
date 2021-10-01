import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {LoaderService} from '../loader/loader.service';
import {shareReplay, switchMap, tap} from 'rxjs/operators';
import {TRANSACTION_TYPE} from '../transaction-service/transaction.service';

export interface ICategory {
  id?: string | null;
  icon: string;
  uid: string;
  description: string;
  name: string;
  type: TRANSACTION_TYPE;
  isDefault?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class ManageCategoriesService {
  tableNameAction: BehaviorSubject<string> = new BehaviorSubject<string>('categories');
  tableName$: Observable<string> = this.tableNameAction.asObservable();
  categories: ICategory[] = [];
  // eslint-disable-next-line @typescript-eslint/member-ordering
  dataLoaderId: string;
  private categories$: Observable<ICategory[]> = combineLatest(
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

        this.dataLoaderId = this.loader.show(true,'get Category');
        // eslint-disable-next-line max-len
        const userCategories$ = this.firestore.collection<ICategory>(
          tableName,
          ref => ref.where('uid', '==', this.loader.user.providerData[0].uid)
        ).valueChanges({idField: 'id'});

        const defaultCategories$ = this.firestore.collection<ICategory>(
          `default-${tableName}`
        ).valueChanges({idField: 'id'});
        return combineLatest([
            defaultCategories$,
            userCategories$
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
  private categoriesChangedAction: BehaviorSubject<Date | boolean> = new BehaviorSubject<Date | boolean>(true);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  categoriesChanged$: Observable<Date | boolean> = this.categoriesChangedAction.asObservable().pipe(shareReplay());

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    public loader: LoaderService,
  ) {
    this.getCategories().subscribe(value => {
      this.categories = value;
      this.categoriesChangedAction.next(false);
    });
  }

  getCategoryId(id: string): ICategory {
    let categoryToReturn: ICategory;
    this.categories.forEach(category => {
      if (id === category.id) {
        categoryToReturn = category;
      }
    });
    return categoryToReturn;
  }

  async deleteCategory(value: ICategory) {
    const loaderId = this.loader.show(true,'deleteCategory');
    try {
      let collectionRef = this.firestore.collection<ICategory>(`${this.tableNameAction.value}`);
      if (value.isDefault) {
        collectionRef = this.firestore.collection<ICategory>(`default-${this.tableNameAction.value}`);
      }
      const docRef = collectionRef.ref.doc(value.id);
      await docRef.delete();
      await this.loader.hide(loaderId);
    } catch (e) {
      await this.loader.hide(loaderId);
    }
  }

  async addCategory(value: ICategory, isDefault = false) {
    const loaderId = this.loader.show(true,'addCategory');
    let collectionRef = this.firestore.collection<ICategory>(`${this.tableNameAction.value}`);
    if (isDefault) {
      collectionRef = this.firestore.collection<ICategory>(`default-${this.tableNameAction.value}`);
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

  async updateCategory(value: ICategory, isDefault = false) {
    const loaderId = this.loader.show(true,'updateCategory');
    let collectionRef = this.firestore.collection<ICategory>(`${this.tableNameAction.value}`);
    if (isDefault) {
      collectionRef = this.firestore.collection<ICategory>(`default-${this.tableNameAction.value}`);
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

  private getCategories(): Observable<ICategory[]> {
    return this.categories$;
  }

}
