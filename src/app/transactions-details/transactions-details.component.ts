import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {IPayment, ITransaction, TransactionService} from '../shared/services/transaction-service/transaction.service';
import * as moment from 'moment';
import {MatDialog} from '@angular/material/dialog';
import {MarkAsPaidComponent} from '../shared/components/mark-as-paid/mark-as-paid.component';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-transactions-details',
  templateUrl: './transactions-details.component.html',
  styleUrls: ['./transactions-details.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      state('in', style({opacity: 1})),
      transition(':enter', [style({opacity: '0'}), animate('.5s ease-out', style({opacity: '1'}))]),
      transition(':leave', [style({opacity: '1'}), animate('.5s ease-out', style({opacity: '0'}))]),
    ]),
  ],
})
export class TransactionsDetailsComponent implements OnInit, OnDestroy {
  @Input() transaction: ITransaction;
  @Input() selectedDate: Date;
  defaultHref = `/manage-transactions`;
  transactionsChangedSubscription: Subscription;

  constructor(
    public modalController: ModalController,
    public alertController: AlertController,
    public transactionService: TransactionService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
  ) {
  }

  reduceAddCallBack(a: number, b: number): number {
    return a + b;
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    const transactionId = this.route.snapshot.paramMap.get('transactionId');
    const dueDate = this.route.snapshot.paramMap.get('dueDate');
    this.transactionsChangedSubscription = this.transactionService.transactionsChanged$.subscribe(() => {
      this.transaction = this.transactionService.getTransactionById(transactionId, Number(dueDate));
    });
  }

  ngOnDestroy() {
    if (this.transactionsChangedSubscription) {
      this.transactionsChangedSubscription.unsubscribe();
    }
  }

  getFormattedDate(dueDate: number): string {
    return moment(dueDate).format('DD-MMMM-yyyy');
  }

  markAsPaid(selectedPayment: IPayment, transaction: ITransaction) {
    this.dialog.open(MarkAsPaidComponent, {data: {selectedPayment, transaction}});
  }

  async makeAsNotPaid(payment: IPayment) {
    const alert = await this.alertController.create({
      header: 'Delete Confirmation',
      message: 'Are you sure! Do you want to delete Payment?',
      buttons: [
        {text: 'No', role: 'cancel', cssClass: 'secondary'},
        {
          text: 'Yes',
          handler: () => {
            this.transactionService.deletePayment(payment.id);
          }
        }
      ]
    });
    await alert.present();
  }

  getNoOfPayment(payments: IPayment[], isPaid: boolean) {
    const returnValue = payments.filter(p => (p.isPaid === isPaid)).length;
    return returnValue > 9 ? returnValue : ('0' + returnValue);
  }
}
