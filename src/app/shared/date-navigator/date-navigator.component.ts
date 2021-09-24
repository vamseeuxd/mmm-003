import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {MatDatepicker} from '@angular/material/datepicker';

@Component({
  selector: 'app-date-navigator',
  templateUrl: './date-navigator.component.html',
  styleUrls: ['./date-navigator.component.scss']
})
export class DateNavigatorComponent implements OnInit {
  readonly todayDate = new Date(window.getServerTime());
  @Input() selectedDate = new Date(window.getServerTime());
  @Output() selectedDateChange: EventEmitter<Date> = new EventEmitter<Date>();

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
    this.selectedDateChange.emit(this.selectedDate);
  }

  chosenMonthHandler($event: Date, picker: MatDatepicker<any>) {
    this.selectedDate = new Date($event.getFullYear(), $event.getMonth(), 1);
    console.log(this.selectedDate);
    this.selectedDateChange.emit(this.selectedDate);
    picker.close();
  }

}
