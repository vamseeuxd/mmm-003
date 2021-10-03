import {Component, OnInit} from '@angular/core';
import {AlertController, IonItemSliding, ModalController} from '@ionic/angular';
import {
  IPayment,
  ITransaction,
  TRANSACTION_TYPE,
  TransactionService
} from '../shared/services/transaction-service/transaction.service';
import {MatDialog} from '@angular/material/dialog';
import {MarkAsPaidComponent} from '../shared/components/mark-as-paid/mark-as-paid.component';
import {ShowTotalsComponent} from '../shared/components/show-totals/show-totals.component';
import {delay} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-folder',
  templateUrl: './manage-transactions.page.html',
  styleUrls: ['./manage-transactions.page.scss'],
})
export class ManageTransactionsPage implements OnInit {
  loaded = false;
  hideHeader = false;

  constructor(
    public modalController: ModalController,
    public dialog: MatDialog,
    public router: Router,
    public alertController: AlertController,
    public transactionService: TransactionService,
  ) {
    this.transactionService.transactionsChanged$.pipe(delay(1000)).subscribe(() => {
      this.loaded = true;
    });
  }

  ngOnInit() {
  }

  async addNewExpenses(type: TRANSACTION_TYPE) {
    await this.router.navigate(['add-or-edit-transaction', type]);
  }

  onTypeSegmentChange($event: any) {
    this.transactionService.updateSelectedTransactionType($event.detail.value ? $event.detail.value : 'expenses');
  }

  async editTransactionClick(transactionSliding: IonItemSliding, transaction: ITransaction, selectedDate: Date) {
    console.log(selectedDate);
    await this.router.navigate(['add-or-edit-transaction', transaction.type, transaction.id]);
    await transactionSliding.close();
  }

  async makeAsNotPaid(transaction: ITransaction) {
    const alert = await this.alertController.create({
      header: 'Delete Confirmation',
      message: 'Are you sure! Do you want to delete Payment?',
      buttons: [
        {text: 'No', role: 'cancel', cssClass: 'secondary'},
        {
          text: 'Yes',
          handler: () => {
            this.transactionService.deletePayment(transaction.payment.id);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteTransaction(transaction: ITransaction) {
    const alert = await this.alertController.create({
      header: 'Delete Confirmation',
      // eslint-disable-next-line max-len
      message: `Are you sure! Do you want to Delete ${transaction.type.toLowerCase()} ? <br> <small class="text-danger d-block mt-2 w-100 text-center">Note : all ${transaction.payments.length} payments related to this ${transaction.type.toLowerCase()} also deleted</small>`,
      buttons: [
        {text: 'No', role: 'cancel', cssClass: 'secondary'},
        {
          text: 'Yes',
          handler: () => {
            this.transactionService.deleteTransaction(transaction);
          }
        }
      ]
    });
    await alert.present();
  }

  hideHeaderClick($event: any) {
    this.hideHeader = $event.detail.deltaY > 0;
  }

  markAsPaid(selectedPayment: IPayment, transaction: ITransaction) {
    this.dialog.open(MarkAsPaidComponent, {data: {selectedPayment, transaction}});
  }

  getTransaction(totalsFilter: ShowTotalsComponent, transactions: ITransaction[]): ITransaction[] {
    if (totalsFilter.isPaid && totalsFilter.isPending) {
      return transactions;
    } else if (totalsFilter.isPaid && !totalsFilter.isPending) {
      return transactions.filter(t => t.isPaid);
    } else if (!totalsFilter.isPaid && totalsFilter.isPending) {
      return transactions.filter(t => !t.isPaid);
    }
    return transactions;
  }
}
