import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {switchMap, tap, window} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {ModalController} from '@ionic/angular';
import {TransactionsFormComponent} from './transactions -form/transactions -form.component';
import * as moment from 'moment';
import {ordinalSuffixOf} from '../shared/utils/utils';

@Component({
  selector: 'app-folder',
  templateUrl: './manage-expenses.page.html',
  styleUrls: ['./manage-expenses.page.scss'],
})
export class ManageExpensesPage implements OnInit {
  public folder: string;
  /*data$: Observable<ITransaction[]>;*/
  startFilterAction: BehaviorSubject<number> = new BehaviorSubject<number>(8);
  startFilter$: Observable<number> = this.startFilterAction.asObservable().pipe(
    tap(
      x => {
        console.log('Start Change', x);
      }
    )
  );
  endFilterAction: BehaviorSubject<number> = new BehaviorSubject<number>(9);
  endFilter$: Observable<number> = this.endFilterAction.asObservable().pipe(
    tap(
      x => {
        console.log('End Change', x);
      }
    )
  );

  data$ = combineLatest([this.startFilter$, this.endFilter$]).pipe(
    switchMap(
      // eslint-disable-next-line max-len
      ([start, end]) => this.firestore.collection('transactions', ref => ref.where('type', '==', 'expenses')).valueChanges({idField: 'id'}).pipe(
        switchMap(transactions => of(
          transactions.map((transaction: any) => ({
            ...transaction,
            startDate: moment(transaction.startDate).format('DD-MMM-yyyy'),
            payments: Array.from(Array(Number(transaction.noOfInstallments)).keys()).map(key => ({
              instalment: ordinalSuffixOf(key + 1),
              dueDate: moment(transaction.startDate).add(key * transaction.repeatInterval, transaction.repeatOption).format('DD-MMM-yyyy'),
              isPaid: false,
            }))
          }))
        ))
      )
    )
  );
  private dataLoaderId = 0;


  constructor(
    private activatedRoute: ActivatedRoute,
    public modalController: ModalController,
    private firestore: AngularFirestore
  ) {
    console.log(moment);
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    // @ts-ignore
    if (window.loader) {
      // @ts-ignore
      this.dataLoaderId = window.loader.show();
    }
    // this.addNewExpenses();
  }

  async addNewExpenses() {
    const modal = await this.modalController.create({
      component: TransactionsFormComponent,
      backdropDismiss: false,
    });
    return await modal.present();
  }

}
