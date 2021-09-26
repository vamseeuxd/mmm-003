import {Component, Input, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {IPayment, ITransaction, TransactionService} from '../../shared/transaction-service/transaction.service';
import * as moment from 'moment';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-transactions-details',
  templateUrl: './transactions-details.component.html',
  styleUrls: ['./transactions-details.component.scss'],
})
export class TransactionsDetailsComponent implements OnInit, OnDestroy {
  @Input() transaction: ITransaction;
  @Input() selectedDate: Date;
  defaultDate: Date;
  dialogRef: MatDialogRef<any>;
  selectedPayment: IPayment;
  subscription: Subscription;

  constructor(
    public modalController: ModalController,
    public alertController: AlertController,
    public transactionService: TransactionService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.subscription = this.transactionService.getTransactions().subscribe(value => {
      value.forEach(value1 => {
        if (this.transaction.id === value1.id && this.transaction.dueDate === value1.dueDate) {
          this.transaction = value1;
        }
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getFormattedDate(dueDate: number): string {
    return moment(dueDate).format('DD-MMMM-yyyy');
  }

  markAsPaid(markAsPaidTempRef: TemplateRef<any>, payment: IPayment) {
    this.selectedPayment = payment;
    this.defaultDate = new Date(payment.dueDate);
    this.dialogRef = this.dialog.open(markAsPaidTempRef);
  }

  async addPayment(sampleForm: NgForm) {
    // dialogRef
    try {
      await this.transactionService.addPayment(new Date(this.selectedPayment.dueDate), this.transaction.id, sampleForm.value.paidOn);
      this.dialogRef.close();
    } catch (e) {
    }
  }

  async makeAsNotPaid(payment: IPayment) {
    const alert = await this.alertController.create({
      header: 'Delete Confirmation',
      message: 'Are you sure! Do you want to delete Payment?',
      buttons: [
        {text: 'No', role: 'cancel', cssClass: 'secondary'},
        {
          text: 'Yes',
          handler: () => {
            this.transactionService.deletePayment(payment.id);
          }
        }
      ]
    });
    await alert.present();
  }
}
