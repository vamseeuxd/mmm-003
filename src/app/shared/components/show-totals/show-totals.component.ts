import {Component, Input, OnInit} from '@angular/core';
import {ITransaction, TransactionService} from '../../services/transaction-service/transaction.service';

@Component({
  selector: 'app-show-totals',
  templateUrl: './show-totals.component.html',
  styleUrls: ['./show-totals.component.scss'],
})
export class ShowTotalsComponent implements OnInit {

  @Input() isPaid = true;
  @Input() isPending = true;
  @Input() noOfPaid = 0;
  @Input() noOfPending = 0;
  @Input() noOfAll = 0;
  @Input() sumOfPaid = 0;
  @Input() sumOfPending = 0;
  @Input() sumOfAll = 0;

  constructor(
    public transactionService: TransactionService,
  ) {
  }

  ngOnInit() {
    this.transactionService.transactionsChanged$.subscribe(() => {
      const transactions = this.transactionService.transactions;
      if (transactions && transactions.length > 0) {
        this.noOfAll = ([].concat.apply([], transactions.map(t => t.transactions))).length;
        this.noOfPaid = ([].concat.apply([], transactions.map(t => t.transactions))).filter(t => t.isPaid).length;
        this.noOfPending = ([].concat.apply([], transactions.map(t => t.transactions))).filter(t => !t.isPaid).length;
        this.sumOfAll = this.getTotals(this.transactionService.transactions);
        this.sumOfPaid = this.getPaidTotals(this.transactionService.transactions);
        this.sumOfPending = this.getNotPaidTotals(this.transactionService.transactions);
      } else {
        this.noOfAll = 0;
        this.noOfPaid = 0;
        this.noOfPending = 0;
        this.sumOfAll = 0;
        this.sumOfPaid = 0;
        this.sumOfPending = 0;
      }
    });
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

  updateFilter($event: any) {
    switch ($event.detail.value) {
      case 'all':
        this.isPaid = true;
        this.isPending = true;
        break;
      case 'paid':
        this.isPaid = true;
        this.isPending = false;
        break;
      case 'pending':
        this.isPaid = false;
        this.isPending = true;
        break;
    }
  }
}
