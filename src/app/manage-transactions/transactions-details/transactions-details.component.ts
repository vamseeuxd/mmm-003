import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ITransaction} from '../../shared/transaction-service/transaction.service';

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

}
