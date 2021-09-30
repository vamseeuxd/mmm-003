import {Component, OnInit} from '@angular/core';
import {shareReplay} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-add-or-edit-category',
  templateUrl: './add-or-edit-category.page.html',
  styleUrls: ['./add-or-edit-category.page.scss'],
})
export class AddOrEditCategoryPage implements OnInit {
  defaultHref = `/manage-categories`;
  icons$ = this.http.get<{ name: string }[]>('./assets/icons-list.json').pipe(
    shareReplay()
  );
  type = 'Expenses';
  id = '';
  action = 'Add new';

  constructor(
    public http: HttpClient,
    public route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.type = this.route.snapshot.paramMap.get('type');
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.action = 'Update';
    } else {
      this.action = 'Add New';
    }
  }

  displayFn(icon: { name: string }): string {
    return icon && icon.name ? icon.name : '';
  }

}
