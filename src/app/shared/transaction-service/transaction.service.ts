import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {LoaderService} from '../loader/loader.service';
import {switchMap, tap} from 'rxjs/operators';
import * as moment from 'moment';
import {DurationInputArg1, DurationInputArg2} from 'moment';
import {ordinalSuffixOf} from '../utils/utils';

// eslint-disable-next-line @typescript-eslint/naming-convention
export type TRANSACTION_TYPE = 'expenses' | 'income';

export interface IDates {
  start: string;
  end: string;
}

export interface IPayment {
  instalment: string;
  dueDateString: string;
  dueDate: number;
  type: TRANSACTION_TYPE;
  isPaid: boolean;
}

export type RepeatOption = 'never' | 'day' | 'week' | 'month' | 'year';

export interface ITransactionDoc {
  name: string;
  type: 'expenses' | 'income';
  id?: string;
  amount: number;
  startDate: number | Date;
  endDate: number | Date;
  dates?: { start: number | Date; end: number | Date };
  repeatInterval: number;
  repeatOption: RepeatOption;
  noOfInstallments: number;
}

export interface ITransaction {
  name: string;
  startDate: string;
  dueDate?: string;
  isPaid?: boolean;
  repeatInterval: number;
  amount: number;
  installment: string;
  dates: IDates;
  uid: string;
  noOfInstallments: number;
  type: TRANSACTION_TYPE;
  repeatOption: RepeatOption;
  id: string;
  fireStoreDoc: ITransactionDoc;
  payments: IPayment[];
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private transactionTypeAction: BehaviorSubject<TRANSACTION_TYPE> = new BehaviorSubject<TRANSACTION_TYPE>('expenses');
  private selectedTransactionType$: Observable<TRANSACTION_TYPE> = this.transactionTypeAction.asObservable();
  private selectedDateAction: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());
  private selectedDate$: Observable<Date> = this.selectedDateAction.asObservable();
  private dataLoaderId: number;
  private readonly dateFormat = 'DD-MMM-yyyy';
  private transactions$: Observable<ITransaction[]> = combineLatest([
    this.selectedDate$,
    this.selectedTransactionType$,
    this.loader.auth.user
  ]).pipe(
    switchMap(
      ([selectedDate, type, user]) => {
        if (!user) {
          return of([]);
        }
        return this.firestore.collection<ITransactionDoc>('transactions', ref => {
          this.dataLoaderId = this.loader.show();
          selectedDate.setDate(1);
          selectedDate.setHours(0, 0, 0, 0);
          return ref.where('uid', '==', this.loader.user.providerData[0].uid)
            .where('type', '==', type)
            .where('dates.end', '>=', selectedDate.getTime());
        }).valueChanges({idField: 'id'}).pipe(
          switchMap((transactions: ITransactionDoc[]) => {
              selectedDate.setDate(1);
              selectedDate.setHours(0, 0, 0, 0);
              const lastDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
              const transactionsToReturn: ITransaction[] = [];
              transactions.filter(transaction =>
                (selectedDate.getTime() >= transaction.dates.start || selectedDate.getTime() <= transaction.dates.end) ||
                (lastDate.getTime() >= transaction.dates.start || lastDate.getTime() <= transaction.dates.end)
              )
                .forEach(transaction => {
                  this.getInstalmentsWithDueDate(transaction, selectedDate, lastDate)
                    .forEach((option) => {
                      transactionsToReturn.push(
                        this.getTransaction(
                          transaction,
                          option.instalment,
                          this.loader.user.providerData[0].uid,
                          option.dueDate)
                      );
                    });
                });
              return of(
                transactionsToReturn
              );

            }
          ),
          tap(async () => {
            await this.loader.hide(this.dataLoaderId);
          })
        );
      }
    )
  );

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    public loader: LoaderService,
  ) {
  }

  updateSelectedTransactionType(type: TRANSACTION_TYPE) {
    this.transactionTypeAction.next(type);
  }

  getSelectedTransactionType(): Observable<TRANSACTION_TYPE> {
    return this.selectedTransactionType$;
  }

  getTransactions(): Observable<ITransaction[]> {
    return this.transactions$;
  }

  updateSelectedDateType(date: Date) {
    this.selectedDateAction.next(date);
  }

  getSelectedDate(): Observable<Date> {
    return this.selectedDate$;
  }

  async addPayment(dueDate: Date, transactionId: string, paidOn: Date) {
    const loaderId = this.loader.show();
    try {
      await this.firestore.collection('payments').add(
        {
          transactionId,
          uid: this.loader.user.providerData[0].uid,
          dueDate: dueDate.getTime(),
          paidOn: paidOn.getTime()
        }
      );
      await this.loader.hide(loaderId);
    } catch (e) {
      await this.loader.hide(loaderId);
    }
  }

  private getInstalmentsWithDueDate(transaction: any, selectedDate: Date, lastDate: Date) {
    return Array.from(Array(transaction.noOfInstallments).keys()).map((index) => {
      const dueDate = moment(transaction.dates.start);
      dueDate.add((index * transaction.repeatInterval), transaction.repeatOption);
      return ({
        instalment: ordinalSuffixOf(index + 1),
        dueDate
      });
    }).filter(data => {
      const startDate = moment(selectedDate.getTime());
      const endDate = moment(lastDate.getTime());
      return data.dueDate.isBetween(startDate, endDate, undefined, '[]');
    }).map(data => ({
      instalment: data.instalment,
      dueDate: data.dueDate.format(this.dateFormat)
    }));
  }

  private getDueDate(transaction: ITransactionDoc, index: number): moment.Moment {
    const amount: DurationInputArg1 = index * transaction.repeatInterval;
    const unit: DurationInputArg2 = transaction.repeatOption as DurationInputArg2;
    const returnValue = moment(transaction.dates.start).add(amount, unit);
    returnValue.add(amount, unit);
    return returnValue;
  }

  private getDates(transaction: ITransactionDoc): IDates {
    return {
      start: moment(transaction.dates.start).format(this.dateFormat),
      end: moment(transaction.dates.end).format(this.dateFormat),
    };
  }

  private getPayments(transaction: ITransactionDoc): IPayment[] {
    return Array.from(Array(Number(transaction.noOfInstallments)).keys()).map(key => ({
      instalment: ordinalSuffixOf(key + 1),
      dueDate: this.getDueDate(transaction, key).toDate().getTime(),
      dueDateString: this.getDueDate(transaction, key).format(this.dateFormat),
      type: transaction.type,
      isPaid: false,
    }));
  }

  private getTransaction(fireStoreDoc: ITransactionDoc, installment: string, uid: string, dueDate: string = null): ITransaction {
    return {
      amount: fireStoreDoc.amount,
      id: fireStoreDoc.id,
      name: fireStoreDoc.name,
      noOfInstallments: fireStoreDoc.noOfInstallments,
      repeatInterval: fireStoreDoc.repeatInterval,
      repeatOption: fireStoreDoc.repeatOption,
      type: fireStoreDoc.type,
      fireStoreDoc,
      uid,
      installment,
      dates: this.getDates(fireStoreDoc),
      startDate: moment(fireStoreDoc.startDate).format(this.dateFormat),
      dueDate,
      payments: this.getPayments(fireStoreDoc)
    };
  }

}
