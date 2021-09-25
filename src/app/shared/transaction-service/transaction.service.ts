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
                (selectedDate.getTime() >= transaction.dates.start || selectedDate.getTime() <= transaction.dates.end) ||
                (lastDate.getTime() >= transaction.dates.start || lastDate.getTime() <= transaction.dates.end)
              )
                .forEach(transaction => {
                  this.getInstalmentsWithDueDate(transaction, selectedDate, lastDate)
                    .forEach((ind, index) => {
                      transactionsToReturn.push(this.getTransaction(transaction, selectedDate, ind.instalment, ind.dueDate));
                    });
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
      case 'day':
        const dayDate1 = moment(transaction.startDate);
        const dayDate2 = moment(selectedDate);
        dayDate2.add(weekOrDayCount * transaction.repeatInterval, transaction.repeatOption);
        const dayDate = Math.floor(dayDate2.diff(dayDate1, transaction.repeatOption, true)) + 1;
        return isSuffix ? ordinalSuffixOf(weekOrDayCount + 1) : dayDate;
        break;
      case 'week':
        const weekDate1 = moment(transaction.startDate);
        const weekDate2 = moment(selectedDate);
        weekDate2.add(weekOrDayCount * transaction.repeatInterval, transaction.repeatOption);
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

  private getTransaction(transaction: any, selectedDate: Date, installment: string, dueDate: string = null): ITransaction {
    return {
      ...transaction,
      installment,
      dates: this.getDates(transaction),
      startDate: moment(transaction.startDate).format(this.dateFormat),
      dueDate: dueDate ? dueDate : this.getDueDate(transaction, Number(this.getInstalment(transaction, selectedDate)) - 1),
      payments: this.getPayments(transaction)
    };
  }

}
