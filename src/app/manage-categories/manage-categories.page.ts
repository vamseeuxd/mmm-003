import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {shareReplay} from 'rxjs/operators';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.page.html',
  styleUrls: ['./manage-categories.page.scss'],
})
export class ManageCategoriesPage implements OnInit {

  icons$ = this.http.get<{name: string}[]>('./assets/icons-list.json').pipe(
    /*map((value) => {
      console.log(value);
      return value.map(d=>d.name);
    }),*/
    shareReplay()
  );

  constructor(public http: HttpClient) {
  }

  ngOnInit() {
  }

  displayFn(icon: {name: string}): string {
    return icon && icon.name ? icon.name : '';
  }

}
