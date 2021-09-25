import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {TransactionsFormComponent} from './transactions -form/transactions -form.component';
import {TRANSACTION_TYPE, TransactionService} from '../shared/transaction-service/transaction.service';

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
}
