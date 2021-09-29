import {Component, OnInit} from '@angular/core';
import {AlertController, IonItemSliding, ModalController} from '@ionic/angular';
import {TransactionsFormComponent} from './transactions -form/transactions -form.component';
import {
  IPayment,
  ITransaction,
  TRANSACTION_TYPE,
  TransactionService
} from '../shared/services/transaction-service/transaction.service';
import {MatDialog} from '@angular/material/dialog';
import {MarkAsPaidComponent} from '../shared/components/mark-as-paid/mark-as-paid.component';
import {ShowTotalsComponent} from '../shared/components/show-totals/show-totals.component';

@Component({
  selector: 'app-folder',
  templateUrl: './manage-transactions.page.html',
  styleUrls: ['./manage-transactions.page.scss'],
})
export class ManageTransactionsPage implements OnInit {

  hideHeader = false;

  constructor(
    public modalController: ModalController,
    public dialog: MatDialog,
    public alertController: AlertController,
    public transactionService: TransactionService,
  ) {
  }

  ngOnInit() {
  }

  async addNewExpenses(type: TRANSACTION_TYPE) {
    const modal = await this.modalController.create({
      component: TransactionsFormComponent,
      backdropDismiss: false,
      componentProps: {type}
    });
    return await modal.present();
  }

  onTypeSegmentChange($event: any) {
    this.transactionService.updateSelectedTransactionType($event.detail.value ? $event.detail.value : 'expenses');
  }

  async editTransactionClick(transactionSliding: IonItemSliding, transaction: ITransaction, selectedDate: Date) {
    await transactionSliding.close();
    const modal = await this.modalController.create({
      component: TransactionsFormComponent,
      backdropDismiss: false,
      componentProps: {
        transaction,
        selectedDate,
        isEdit: true,
      }
    });
    return await modal.present();
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
