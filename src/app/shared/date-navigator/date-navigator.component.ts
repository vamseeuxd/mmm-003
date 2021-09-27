import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {MatDatepicker} from '@angular/material/datepicker';

@Component({
  selector: 'app-date-navigator',
  templateUrl: './date-navigator.component.html',
  styleUrls: ['./date-navigator.component.scss']
})
export class DateNavigatorComponent implements OnInit {
  @Input() selectedDate = new Date(window.getServerTime());
  @Output() selectedDateChange: EventEmitter<Date> = new EventEmitter<Date>();
  readonly todayDate = new Date(window.getServerTime());
  timeOutRef: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  navigateSelectedDate(command: 'y--' | 'y++' | 'm--' | 'm++') {
    const date = moment(this.selectedDate);
    switch (command) {
      case 'y--':
        date.subtract(1, 'year');
        break;
      case 'y++':
        date.add(1, 'year');
        break;
      case 'm--':
        date.subtract(1, 'month');
        break;
      case 'm++':
        date.add(1, 'month');
        break;
    }
    this.selectedDate = date.toDate();
    this.selectedDate.setDate(1);
    this.selectedDate.setHours(0, 0, 0, 0);
    if (this.timeOutRef) {
      clearTimeout(this.timeOutRef);
    }
    this.timeOutRef = setTimeout(() => {
      clearTimeout(this.timeOutRef);
      this.timeOutRef = null;
      this.selectedDateChange.emit(this.selectedDate);
    }, 1000);
  }

  chosenMonthHandler($event: Date, picker: MatDatepicker<any>) {
    this.selectedDate = new Date($event.getFullYear(), $event.getMonth(), 1);
    console.log(this.selectedDate);
    this.selectedDateChange.emit(this.selectedDate);
    picker.close();
  }

}
