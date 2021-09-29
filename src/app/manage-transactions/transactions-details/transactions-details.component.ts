import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {
  IPayment,
  ITransaction,
  TransactionService
} from '../../shared/services/transaction-service/transaction.service';
import * as moment from 'moment';
import {MatDialog} from '@angular/material/dialog';
import {MarkAsPaidComponent} from '../../shared/components/mark-as-paid/mark-as-paid.component';

@Component({
  selector: 'app-transactions-details',
  templateUrl: './transactions-details.component.html',
  styleUrls: ['./transactions-details.component.scss'],
})
export class TransactionsDetailsComponent implements OnInit, OnDestroy {
  @Input() transaction: ITransaction;
  @Input() selectedDate: Date;

  constructor(
    public modalController: ModalController,
    public alertController: AlertController,
    public transactionService: TransactionService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
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
    return payments.filter(p => (p.isPaid === isPaid)).length;
  }
}
