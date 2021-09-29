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
    if (transactions && transactions.length > 0) {
      return ([].concat.apply([], transactions.map(t => t.transactions)).map(t => t.amount).reduce((prev, next) => prev + next));
    } else {
      return 0;
    }

  }

  getPaidTotals(transactions: { date: string; transactions: ITransaction[] }[]) {
    if (transactions && transactions.length > 0) {
      const paidTransactions = [].concat.apply([], transactions.map(t => t.transactions)).filter(t => t.isPaid);
      if (paidTransactions && paidTransactions.length > 0) {
        return paidTransactions.map(t => t.amount).reduce((prev, next) => prev + next);
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  getNotPaidTotals(transactions: { date: string; transactions: ITransaction[] }[]) {
    if (transactions && transactions.length > 0) {
      const paidTransactions = [].concat.apply([], transactions.map(t => t.transactions)).filter(t => !t.isPaid);
      if (paidTransactions && paidTransactions.length > 0) {
        return paidTransactions.map(t => t.amount).reduce((prev, next) => prev + next);
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }
}
