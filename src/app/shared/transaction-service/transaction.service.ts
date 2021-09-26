import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, forkJoin, Observable, of} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {LoaderService} from '../loader/loader.service';
import {switchMap, take, tap} from 'rxjs/operators';
import * as moment from 'moment';
import {DurationInputArg1, DurationInputArg2} from 'moment';
import {ordinalSuffixOf} from '../utils/utils';

// eslint-disable-next-line @typescript-eslint/naming-convention
export type TRANSACTION_TYPE = 'expenses' | 'income';

export interface IDates {
  start: string;
  end: string;
}

/*
dueDate: 1631298600000
id: "4JBRcYGWpAaX2EWfC3xz"
paidOn: 1631298600000
transactionId: "UDIVsLDfyqkPHZqSKZO6"
uid: "102322390323163970849"
*/

export interface IPaymentDoc {
  dueDate: number;
  id: string;
  paidOn: number;
  transactionId: string;
  uid: string;
}

export interface IPayment {
  instalment: string;
  id: string | null;
  dueDateString: string;
  dueDate: number;
  paidOn: number | null;
  transactionId: string;
  paymentDoc?: IPaymentDoc;
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
  payments?: IPaymentDoc[];
}

export interface ITransaction {
  name: string;
  startDate: string;
  dueDate?: number;
  isPaid: boolean;
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
  private payments$: Observable<IPayment[]> = this.firestore.collection<IPayment>('payments').valueChanges({idField: 'id'});
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
          switchMap(x => {
            const xxx: any = {source: of(x)};
            x.forEach(value => {
              xxx[value.id] = this.firestore.collection<IPaymentDoc>('payments', ref => ref.where('transactionId', '==', value.id))
                .valueChanges({idField: 'id'}).pipe(take(1));
            });
            return forkJoin(xxx).pipe(switchMap(
              (value: any) => {
                value.source.forEach(d => {
                  d.payments = value[d.id];
                  delete value[d.id];
                });
                return of(value.source);
              }
            ));
          }),
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
      dueDate: data.dueDate.toDate().getTime()
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
    return Array.from(Array(Number(transaction.noOfInstallments)).keys()).map(key => {
      const dueDate = this.getDueDate(transaction, key);
      console.log(transaction.payments.map(d => d.dueDate).includes(dueDate.toDate().getTime()));
      return ({
        instalment: ordinalSuffixOf(key + 1),
        id: null,
        dueDateString: dueDate.format(this.dateFormat),
        dueDate: dueDate.toDate().getTime(),
        paidOn: null,
        transactionId: transaction.id,
        type: transaction.type,
        isPaid: transaction.payments.map(d => d.dueDate).includes(dueDate.toDate().getTime()),
      });
    });
  }

  private getTransaction(fireStoreDoc: ITransactionDoc, installment: string, uid: string, dueDate: number = null): ITransaction {
    console.log('---------------------------------');
    console.log(fireStoreDoc.payments.map(d => d.dueDate).includes(dueDate));
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
      isPaid: fireStoreDoc.payments.map(d => d.dueDate).includes(dueDate),
      installment,
      dates: this.getDates(fireStoreDoc),
      startDate: moment(fireStoreDoc.startDate).format(this.dateFormat),
      dueDate,
      payments: this.getPayments(fireStoreDoc)
    };
  }

}
