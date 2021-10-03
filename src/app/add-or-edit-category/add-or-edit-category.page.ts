import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {shareReplay} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {ICategory, ManageCategoriesService} from '../shared/services/manage-categories/manage-categories.service';
import {NgForm} from '@angular/forms';
import {TRANSACTION_TYPE} from '../shared/services/transaction-service/transaction.service';
import {LoaderService} from '../shared/services/loader/loader.service';
import {Subscription} from 'rxjs';
import {UsersService} from '../shared/services/users/users.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-add-or-edit-category',
  templateUrl: './add-or-edit-category.page.html',
  styleUrls: ['./add-or-edit-category.page.scss'],
})
export class AddOrEditCategoryPage implements OnInit, OnDestroy {
  @ViewChild('sampleForm') sampleForm: NgForm;
  defaultHref = `/manage-categories`;
  icons$ = this.http.get<{ name: string }[]>('./assets/icons-list.json').pipe(
    shareReplay()
  );
  type: TRANSACTION_TYPE = 'expenses';
  id = '';
  action = 'Add new';
  isEdit = false;
  defaultCategory: ICategory;
  subscription: Subscription;

  constructor(
    public http: HttpClient,
    public route: ActivatedRoute,
    public loader: LoaderService,
    public router: Router,
    public location: Location,
    public usersService: UsersService,
    public categoriesService: ManageCategoriesService,
  ) {
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.isEdit = false;
    this.type = this.route.snapshot.paramMap.get('type') === 'expenses' ? 'expenses' : 'income';
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdit = true;
      this.action = 'Update';
      this.getDataForUpdate();
    } else {
      this.action = 'Add New';
    }
  }

  getDataForUpdate() {
    setTimeout(() => {
      this.defaultCategory = this.categoriesService.getCategoryId(this.id);
      if (this.defaultCategory && this.sampleForm) {
        this.sampleForm.resetForm({
          name: this.defaultCategory.name,
          icon: {name: this.defaultCategory.icon},
          description: this.defaultCategory.description,
        });
      } else {
        this.subscription = this.categoriesService.categoriesChanged$.subscribe(() => {
          this.defaultCategory = this.categoriesService.getCategoryId(this.id);
          if (this.defaultCategory && this.sampleForm) {
            this.sampleForm.resetForm({
              name: this.defaultCategory.name,
              icon: {name: this.defaultCategory.icon},
              description: this.defaultCategory.description,
            });
            // console.log(this.defaultCategory);
          }
        });
      }
    }, 500);
  }

  displayFn(icon: { name: string }): string {
    return icon && icon.name ? icon.name : '';
  }

  async saveCategory(sampleForm: NgForm) {
    try {
      if (this.isEdit) {
        await this.categoriesService.updateCategory(
          {
            ...this.defaultCategory,
            name: sampleForm.value.name,
            description: sampleForm.value.description,
            icon: sampleForm.value.icon.name,
            type: this.type,
            uid: this.loader.user.providerData[0].uid,
          },
          this.defaultCategory.isDefault
        );
        // await this.router.navigate(['manage-categories']);
        // this.location.back();
      } else {
        await this.categoriesService.addCategory(
          {
            name: sampleForm.value.name,
            description: sampleForm.value.description,
            icon: sampleForm.value.icon.name,
            type: this.type,
            uid: this.loader.user.providerData[0].uid,
          },
          false
        );
        // await this.router.navigate(['manage-categories']);
        // this.location.back();
      }
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
      // await this.router.navigate(['manage-categories']);
      // this.location.back();
      sampleForm.resetForm({});
    } catch (e) {
      alert(e.message);
    }
  }
}
