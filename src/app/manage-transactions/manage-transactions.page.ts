import {Component, OnInit} from '@angular/core';
import {IonItemSliding, ModalController} from '@ionic/angular';
import {TransactionsFormComponent} from './transactions -form/transactions -form.component';
import {ITransaction, TRANSACTION_TYPE, TransactionService} from '../shared/transaction-service/transaction.service';
import {TransactionsDetailsComponent} from './transactions-details/transactions-details.component';

@Component({
  selector: 'app-folder',
  templateUrl: './manage-transactions.page.html',
  styleUrls: ['./manage-transactions.page.scss'],
})
export class ManageTransactionsPage implements OnInit {

  constructor(
    public modalController: ModalController,
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
}
