import {Component, OnInit} from '@angular/core';
import {ITransaction, TransactionService} from '../../services/transaction-service/transaction.service';

@Component({
  selector: 'app-show-totals',
  templateUrl: './show-totals.component.html',
  styleUrls: ['./show-totals.component.scss'],
})
export class ShowTotalsComponent implements OnInit {

  constructor(
    public transactionService: TransactionService,
  ) {
  }

  ngOnInit() {
  }

  getTotals(transactions: { date: string; transactions: ITransaction[] }[]) {
    // eslint-disable-next-line max-len
    return transactions.length ? ([].concat.apply([], transactions.map(t => t.transactions)).map(t => t.amount).reduce((prev, next) => prev + next)) : 0;
  }

  getPaidTotals(transactions: { date: string; transactions: ITransaction[] }[]) {
    return transactions.length ? ([].concat.apply([], transactions.map(t => t.transactions))
      .filter(t => t.isPaid)
      .map(t => t.amount).reduce((prev, next) => prev + next)) : 0;
  }

  getNotPaidTotals(transactions: { date: string; transactions: ITransaction[] }[]) {
    return transactions.length ? ([].concat.apply([], transactions.map(t => t.transactions))
      .filter(t => !t.isPaid)
      .map(t => t.amount).reduce((prev, next) => prev + next)) : 0;
  }
}
