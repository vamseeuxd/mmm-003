import {Component, Input, OnInit} from '@angular/core';
import {ITransaction} from '../../services/transaction-service/transaction.service';

@Component({
  selector: 'app-show-totals',
  templateUrl: './show-totals.component.html',
  styleUrls: ['./show-totals.component.scss'],
})
export class ShowTotalsComponent implements OnInit {
  @Input() transactions: { date: string; transactions: ITransaction[] }[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  getTotals() {
    return [].concat.apply([], this.transactions.map(t => t.transactions)).map(t => t.amount).reduce((prev, next) => prev + next);
  }

  getPaidTotals() {
    return [].concat.apply([], this.transactions.map(t => t.transactions))
      .filter(t => t.isPaid)
      .map(t => t.amount).reduce((prev, next) => prev + next);
  }

  getNotPaidTotals() {
    return [].concat.apply([], this.transactions.map(t => t.transactions))
      .filter(t => !t.isPaid)
      .map(t => t.amount).reduce((prev, next) => prev + next);
  }
}
