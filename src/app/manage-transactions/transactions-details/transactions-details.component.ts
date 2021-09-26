import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ITransaction} from '../../shared/transaction-service/transaction.service';
import * as moment from 'moment';

@Component({
  selector: 'app-transactions-details',
  templateUrl: './transactions-details.component.html',
  styleUrls: ['./transactions-details.component.scss'],
})
export class TransactionsDetailsComponent implements OnInit {
  @Input() transaction: ITransaction;
  @Input() selectedDate: Date;

  constructor(public modalController: ModalController,) {
  }

  ngOnInit() {
  }

  getFormattedDate(dueDate: number): string {
    return moment(dueDate).format('DD-MMMM-yyyy');
  }
}
