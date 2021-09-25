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
  dueDate?: string;
  repeatInterval: number;
  amount: number;
  installment: number;
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
              const lastDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
              const transactionsToReturn: ITransaction[] = [];
              transactions.filter(transaction =>
                //...................
                (selectedDate.getTime() >= transaction.dates.start && selectedDate.getTime() <= transaction.dates.end) ||
                (lastDate.getTime() >= transaction.dates.start && lastDate.getTime() <= transaction.dates.end)
              )
                .forEach(transaction => {
                  switch (transaction.repeatOption) {
                    case 'week':
                      console.log('-----------------Week Login-----------------');
                      Array.from(Array(transaction.noOfInstallments).keys()).forEach((ind, index) => {
                        console.log('1---->', index);
                        transactionsToReturn.push(this.getTransaction(transaction, selectedDate, index));
                      });
                      break;
                    case 'month':
                      // console.log('-----------------Month Login-----------------');
                      transactionsToReturn.push(this.getTransaction(transaction, selectedDate));
                      break;
                  }
                });
              return of(
                transactionsToReturn
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

  getTransactions(): Observable<ITransaction[]> {
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

  private getInstalment(transaction: any, selectedDate: Date, weekOrDayCount = 0, isSuffix = true): string | number {
    switch (transaction.repeatOption) {
      case 'week':
        const weekDate1 = moment(transaction.startDate);
        const weekDate2 = moment(selectedDate);
        console.log('3---->', weekOrDayCount);
        weekDate2.add(weekOrDayCount, transaction.repeatOption);
        console.log(weekOrDayCount, weekDate2.format('DD-MMMM-yyyy'));
        console.log('######################################');
        const weekDate = Math.floor(weekDate2.diff(weekDate1, transaction.repeatOption, true)) + 1;
        return isSuffix ? ordinalSuffixOf(weekDate) : weekDate;
        break;
      case 'month':
        const monthDate1 = moment(transaction.startDate).set('date', 1);
        const monthDate2 = moment(selectedDate).set('date', 1);
        const monthDate = Math.floor(monthDate2.diff(monthDate1, transaction.repeatOption, true)) + 1;
        return isSuffix ? ordinalSuffixOf(monthDate) : monthDate;
        break;
    }
  }

  private getTransaction(transaction: any, selectedDate: Date, weekOrDayCount = 0): ITransaction {
    console.log('2---->', weekOrDayCount);
    return {
      ...transaction,
      installment: this.getInstalment(transaction, selectedDate, weekOrDayCount),
      dates: this.getDates(transaction),
      startDate: moment(transaction.startDate).format(this.dateFormat),
      dueDate: this.getDueDate(transaction, Number(this.getInstalment(transaction, selectedDate, weekOrDayCount, false)) - 1),
      payments: this.getPayments(transaction)
    };
  }

}
