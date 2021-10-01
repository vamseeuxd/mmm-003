import {Component, OnInit} from '@angular/core';
import {shareReplay} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {ManageCategoriesService} from '../shared/services/manage-categories/manage-categories.service';
import {NgForm} from '@angular/forms';
import {TRANSACTION_TYPE} from '../shared/services/transaction-service/transaction.service';
import {LoaderService} from '../shared/services/loader/loader.service';

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
  type: TRANSACTION_TYPE = 'expenses';
  id = '';
  action = 'Add new';

  constructor(
    public http: HttpClient,
    public route: ActivatedRoute,
    public loader: LoaderService,
    public categoriesService: ManageCategoriesService,
  ) {
  }

  ngOnInit() {
    this.type = this.route.snapshot.paramMap.get('type') === 'expenses' ? 'expenses' : 'income';
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

  async saveCategory(sampleForm: NgForm) {
    try {
      await this.categoriesService.addCategory(
        {
          name: sampleForm.value.name,
          description: sampleForm.value.description,
          icon: sampleForm.value.icon,
          type: this.type,
          uid: this.loader.user.providerData[0].uid,
        },
        false
      );
      sampleForm.resetForm({});
    } catch (e) {
      alert(e.message);
    }
  }

  async saveAsCategory(sampleForm: NgForm) {
    try {
      await this.categoriesService.addCategory(
        {
          name: sampleForm.value.name,
          description: sampleForm.value.description,
          icon: sampleForm.value.icon.name,
          type: this.type,
          uid: this.loader.user.providerData[0].uid,
        },
        true
      );
      sampleForm.resetForm({});
    } catch (e) {
      alert(e.message);
    }
  }
}
