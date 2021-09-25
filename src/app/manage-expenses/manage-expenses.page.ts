import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {switchMap, tap, window} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {ModalController} from '@ionic/angular';
import {TransactionsFormComponent} from './transactions -form/transactions -form.component';
import * as moment from 'moment';
import {LoaderService} from '../shared/loader/loader.service';
import {ordinalSuffixOf} from '../shared/utils/utils';
import {AngularFireAuth} from '@angular/fire/compat/auth';

@Component({
  selector: 'app-folder',
  templateUrl: './manage-expenses.page.html',
  styleUrls: ['./manage-expenses.page.scss'],
})
export class ManageExpensesPage implements OnInit {
  public folder: string;
  typeFilterAction: BehaviorSubject<'expenses' | 'income'> = new BehaviorSubject<'expenses' | 'income'>('expenses');
  typeFilter$: Observable<'expenses' | 'income'> = this.typeFilterAction.asObservable();
  selectedDateAction: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());
  selectedDate$: Observable<Date> = this.selectedDateAction.asObservable();
  dataLoaderId = 0;
  data$ = combineLatest([this.selectedDate$, this.typeFilter$, this.loader.auth.user]).pipe(
    switchMap(
      // eslint-disable-next-line max-len
      ([selectedDate, type, user]) => {
        if (!user) {
          return of([]);
        }
        return this.firestore.collection('transactions', ref => {
          this.dataLoaderId = this.loader.show();
          // eslint-disable-next-line max-len
          /* todo: Cloud Firestore Data Modeling (Google I/O'19) : https://www.youtube.com/watch?v=lW7DWV2jST0*/
          /* todo: Firestore Data Modeling - Five Cool Techniques : https://www.youtube.com/watch?v=35RlydUf6xo*/
          /*firebase get documents where today is in between to fields - date range (startDate / endDate)*/
          selectedDate.setDate(1);
          selectedDate.setHours(0, 0, 0, 0);
          /*console.log(moment(1609439400000).format('DD-MMMM-yyyy hh-mm-ss'), '>=', moment(selectedDate).format('DD-MMMM-yyyy hh-mm-ss'));
          console.log(1609439400000, '>=', selectedDate.getTime());*/
          return ref.where('uid', '==', this.loader.user.providerData[0].uid).where('type', '==', type)
            .where('dates.end', '>=', selectedDate.getTime());
        }).valueChanges({idField: 'id'}).pipe(
          switchMap((transactions: any[]) => {
              selectedDate.setDate(1);
              selectedDate.setHours(0, 0, 0, 0);
              //....
              return of(
                transactions.filter(transaction => (transaction.dates.start <= selectedDate.getTime())).map(transaction => ({
                  ...transaction,
                  dates: {
                    start: moment(transaction.dates.start).format('DD-MMMM-yyyy'),
                    end: moment(transaction.dates.end).format('DD-MMMM-yyyy'),
                  },
                  startDate: moment(transaction.startDate).format('DD-MMM-yyyy'),
                  payments: Array.from(Array(Number(transaction.noOfInstallments)).keys()).map(key => ({
                    instalment: ordinalSuffixOf(key + 1),
                    // eslint-disable-next-line max-len
                    dueDate: moment(transaction.startDate).add(key * transaction.repeatInterval, transaction.repeatOption).format('DD-MMM-yyyy'),
                    isPaid: false,
                  }))
                }))
              );
            }
          ),
          tap(x => {
            this.loader.hide(this.dataLoaderId);
          })
        );
      }
    )
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private auth: AngularFireAuth,
    public modalController: ModalController,
    private firestore: AngularFirestore,
    public loader: LoaderService,
  ) {
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    // @ts-ignore
    if (window.loader) {
      // @ts-ignore
      this.dataLoaderId = window.loader.show();
    }
    // this.addNewExpenses('expenses');
  }

  async addNewExpenses(type: 'expenses' | 'income') {
    const modal = await this.modalController.create({
      component: TransactionsFormComponent,
      backdropDismiss: false,
      componentProps: {
        type
      }
    });
    return await modal.present();
  }

  onTypeSegmentChange($event: any) {
    this.typeFilterAction.next(($event.detail.value ? $event.detail.value : 'expenses'));
  }
}
