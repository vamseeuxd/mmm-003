import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {switchMap, tap, window} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {ModalController} from '@ionic/angular';
import {TransactionsFormComponent} from './transactions -form/transactions -form.component';
import * as moment from 'moment';
import {ordinalSuffixOf} from '../shared/utils/utils';
import {LoaderService} from '../shared/loader/loader.service';

@Component({
  selector: 'app-folder',
  templateUrl: './manage-expenses.page.html',
  styleUrls: ['./manage-expenses.page.scss'],
})
export class ManageExpensesPage implements OnInit {
  public folder: string;
  selectedDate: Date = new Date();
  /*data$: Observable<ITransaction[]>;*/
  typeFilterAction: BehaviorSubject<'expenses' | 'income'> = new BehaviorSubject<'expenses' | 'income'>('expenses');
  typeFilter$: Observable<'expenses' | 'income'> = this.typeFilterAction.asObservable();
  startFilterAction: BehaviorSubject<number> = new BehaviorSubject<number>(8);
  startFilter$: Observable<number> = this.startFilterAction.asObservable();
  endFilterAction: BehaviorSubject<number> = new BehaviorSubject<number>(9);
  endFilter$: Observable<number> = this.endFilterAction.asObservable();
  dataLoaderId = 0;
  data$ = combineLatest([this.startFilter$, this.endFilter$, this.typeFilter$]).pipe(
    switchMap(
      // eslint-disable-next-line max-len
      ([start, end, type]) => this.firestore.collection('transactions', ref => {
        // .................
        this.dataLoaderId = this.loader.show();
        return ref.where('type', '==', type);
      }).valueChanges({idField: 'id'}).pipe(
        switchMap(transactions => of(
          transactions.map((transaction: any) => ({
            ...transaction,
            startDate: moment(transaction.startDate).format('DD-MMM-yyyy'),
            payments: Array.from(Array(Number(transaction.noOfInstallments)).keys()).map(key => ({
              instalment: ordinalSuffixOf(key + 1),
              // eslint-disable-next-line max-len
              dueDate: moment(transaction.startDate).add(key * transaction.repeatInterval, transaction.repeatOption).format('DD-MMM-yyyy'),
              isPaid: false,
            }))
          }))
        )),
        tap(x => {
          this.loader.hide(this.dataLoaderId);
        })
      )
    )
  );

  constructor(
    private activatedRoute: ActivatedRoute,
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

}
