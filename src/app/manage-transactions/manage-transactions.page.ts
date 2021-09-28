import {Component, OnInit, TemplateRef} from '@angular/core';
import {AlertController, IonItemSliding, ModalController} from '@ionic/angular';
import {TransactionsFormComponent} from './transactions -form/transactions -form.component';
import {
  IPayment,
  ITransaction,
  TRANSACTION_TYPE,
  TransactionService
} from '../shared/services/transaction-service/transaction.service';
import {TransactionsDetailsComponent} from './transactions-details/transactions-details.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-folder',
  templateUrl: './manage-transactions.page.html',
  styleUrls: ['./manage-transactions.page.scss'],
})
export class ManageTransactionsPage implements OnInit {

  dialogRef: MatDialogRef<any>;
  defaultDate: Date;
  selectedPayment: IPayment;
  selectedTransaction: ITransaction;
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

  async showMoreDetail(transaction: ITransaction, selectedDate: Date) {

    const modal = await this.modalController.create({
      component: TransactionsDetailsComponent,
      backdropDismiss: false,
      componentProps: {
        transaction,
        selectedDate,
      }
    });
    return await modal.present();

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

  markAsPaid(markAsPaidTempRef: TemplateRef<any>, payment: IPayment, transaction: ITransaction) {
    this.selectedPayment = payment;
    this.selectedTransaction = transaction;
    this.defaultDate = new Date(payment.dueDate);
    this.dialogRef = this.dialog.open(markAsPaidTempRef);
  }

  async addPayment(sampleForm: NgForm) {
    // dialogRef
    try {
      // eslint-disable-next-line max-len
      await this.transactionService.addPayment(new Date(this.selectedPayment.dueDate), this.selectedTransaction.id, sampleForm.value.paidOn);
      this.dialogRef.close();
    } catch (e) {
    }
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
}
