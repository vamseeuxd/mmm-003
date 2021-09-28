import {Component, Inject, Input, OnInit} from '@angular/core';
import {IPayment, ITransaction, TransactionService} from '../../services/transaction-service/transaction.service';
import {NgForm} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-mark-as-paid',
  templateUrl: './mark-as-paid.component.html',
  styleUrls: ['./mark-as-paid.component.scss'],
})
export class MarkAsPaidComponent implements OnInit {
  @Input() selectedPayment: IPayment;
  @Input() defaultDate: Date;
  @Input() transaction: ITransaction;

  constructor(
    public dialogRef: MatDialogRef<MarkAsPaidComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedPayment: IPayment; defaultDate: Date; transaction: ITransaction },
    public dialog: MatDialog,
    public transactionService: TransactionService,
  ) {
    this.selectedPayment = data.selectedPayment;
    this.defaultDate = data.defaultDate;
    this.transaction = data.transaction;
  }

  ngOnInit() {
  }

  async addPayment(sampleForm: NgForm) {
    // dialogRef
    try {
      await this.transactionService.addPayment(new Date(this.selectedPayment.dueDate), this.transaction.id, sampleForm.value.paidOn);
      this.dialogRef.close();
    } catch (e) {
    }
  }

}
