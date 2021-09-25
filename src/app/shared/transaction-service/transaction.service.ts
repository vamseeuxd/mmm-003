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
  dueDate: string;
  type: TRANSACTION_TYPE;
  isPaid: boolean;
}

export interface ITransaction {
  name: string;
  startDate: string;
  repeatInterval: number;
  amount: number;
  dates: IDates;
  uid: string;
  noOfInstallments: number;
  type: TRANSACTION_TYPE;
  repeatOption: string;
  id: string;
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
  private readonly dateFormat = 'DD-MMMM-yyyy';
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
        return this.firestore.collection('transactions', ref => {
          this.dataLoaderId = this.loader.show();
          selectedDate.setDate(1);
          selectedDate.setHours(0, 0, 0, 0);
          return ref.where('uid', '==', this.loader.user.providerData[0].uid)
            .where('type', '==', type)
            .where('dates.end', '>=', selectedDate.getTime());
        }).valueChanges({idField: 'id'}).pipe(
          switchMap((transactions: any[]) => {
              selectedDate.setDate(1);
              selectedDate.setHours(0, 0, 0, 0);
              return of(
                transactions.filter(transaction => (transaction.dates.start <= selectedDate.getTime()))
                  .map(transaction => this.getTransaction(transaction))
              );
            }
          ),
          tap(async x => {
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

  getTransactions(): Observable<any[]> {
    return this.transactions$;
  }

  updateSelectedDateType(date: Date) {
    this.selectedDateAction.next(date);
  }

  getSelectedDate(): Observable<Date> {
    return this.selectedDate$;
  }

  private getDueDate(transaction: ITransaction, index: number) {
    const amount: DurationInputArg1 = index * transaction.repeatInterval;
    const unit: DurationInputArg2 = transaction.repeatOption as DurationInputArg2;
    return moment(transaction.startDate).add(amount, unit).format(this.dateFormat);
  }

  private getTransaction(transaction: any): ITransaction {
    return {
      ...transaction,
      dates: this.getDates(transaction),
      startDate: moment(transaction.startDate).format(this.dateFormat),
      payments: this.getPayments(transaction)
    };
  }

  private getDates(transaction: ITransaction): IDates {
    return {
      start: moment(transaction.dates.start).format(this.dateFormat),
      end: moment(transaction.dates.end).format(this.dateFormat),
    };
  }

  private getPayments(transaction: ITransaction): IPayment[] {
    return Array.from(Array(Number(transaction.noOfInstallments)).keys()).map(key => ({
      instalment: ordinalSuffixOf(key + 1),
      dueDate: this.getDueDate(transaction, key),
      type: transaction.type,
      isPaid: false,
    }));
  }


}
