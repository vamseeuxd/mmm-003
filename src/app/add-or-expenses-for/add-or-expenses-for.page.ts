import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {shareReplay} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {LoaderService} from '../shared/services/loader/loader.service';
import {UsersService} from '../shared/services/users/users.service';
import {IExpensesFor, ManageExpensesForService} from '../shared/services/manage-expenses-for.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-add-or-edit-expenses-for',
  templateUrl: './add-or-expenses-for.page.html',
  styleUrls: ['./add-or-expenses-for.page.scss'],
})
export class AddOrExpensesForPage implements OnInit, OnDestroy {
  @ViewChild('sampleForm') sampleForm: NgForm;
  defaultHref = `/manage-expenses-for`;
  icons$ = this.http.get<{ name: string }[]>('./assets/icons-list.json').pipe(
    shareReplay()
  );
  id = '';
  action = 'Add new';
  isEdit = false;
  defaultExpensesFor: IExpensesFor;
  subscription: Subscription;

  constructor(
    public http: HttpClient,
    public route: ActivatedRoute,
    public loader: LoaderService,
    public router: Router,
    public location: Location,
    public usersService: UsersService,
    public expensesForService: ManageExpensesForService,
  ) {
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.isEdit = false;
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
      this.defaultExpensesFor = this.expensesForService.getExpensesForId(this.id);
      if (this.defaultExpensesFor && this.sampleForm) {
        this.sampleForm.resetForm({
          name: this.defaultExpensesFor.name,
          icon: {name: this.defaultExpensesFor.icon},
          description: this.defaultExpensesFor.description,
        });
      } else {
        this.subscription = this.expensesForService.expensesForChanged$.subscribe(() => {
          this.defaultExpensesFor = this.expensesForService.getExpensesForId(this.id);
          if (this.defaultExpensesFor && this.sampleForm) {
            this.sampleForm.resetForm({
              name: this.defaultExpensesFor.name,
              icon: {name: this.defaultExpensesFor.icon},
              description: this.defaultExpensesFor.description,
            });
            // console.log(this.defaultExpensesFor);
          }
        });
      }
    }, 500);
  }

  displayFn(icon: { name: string }): string {
    return icon && icon.name ? icon.name : '';
  }

  async saveExpensesFor(sampleForm: NgForm) {
    try {
      if (this.isEdit) {
        await this.expensesForService.updateExpensesFor(
          {
            ...this.defaultExpensesFor,
            name: sampleForm.value.name,
            description: sampleForm.value.description,
            icon: sampleForm.value.icon.name,
            uid: this.loader.user.providerData[0].uid,
          },
          this.defaultExpensesFor.isDefault
        );
        await this.router.navigate([this.defaultHref]);
        // this.location.back();
      } else {
        await this.expensesForService.addExpensesFor(
          {
            name: sampleForm.value.name,
            description: sampleForm.value.description,
            icon: sampleForm.value.icon.name,
            uid: this.loader.user.providerData[0].uid,
          },
          false
        );
        await this.router.navigate([this.defaultHref]);
        // this.location.back();
      }
      sampleForm.resetForm({});
    } catch (e) {
      alert(e.message);
    }
  }

  async saveAsExpensesFor(sampleForm: NgForm) {
    try {
      await this.expensesForService.addExpensesFor(
        {
          name: sampleForm.value.name,
          description: sampleForm.value.description,
          icon: sampleForm.value.icon.name,
          uid: this.loader.user.providerData[0].uid,
        },
        true
      );
      await this.router.navigate([this.defaultHref]);
      // this.location.back();
      sampleForm.resetForm({});
    } catch (e) {
      alert(e.message);
    }
  }
}
