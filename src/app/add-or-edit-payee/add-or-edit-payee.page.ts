import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {shareReplay} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {LoaderService} from '../shared/services/loader/loader.service';
import {UsersService} from '../shared/services/users/users.service';
import {IPayee, ManagePayeeService} from '../shared/services/manage-payee/manage-payee.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-add-or-edit-payee',
  templateUrl: './add-or-edit-payee.page.html',
  styleUrls: ['./add-or-edit-payee.page.scss'],
})
export class AddOrEditPayeePage implements OnInit, OnDestroy {
  @ViewChild('sampleForm') sampleForm: NgForm;
  defaultHref = `/manage-payee`;
  icons$ = this.http.get<{ name: string }[]>('./assets/icons-list.json').pipe(
    shareReplay()
  );
  id = '';
  action = 'Add new';
  isEdit = false;
  defaultPayee: IPayee;
  subscription: Subscription;

  constructor(
    public http: HttpClient,
    public route: ActivatedRoute,
    public loader: LoaderService,
    public router: Router,
    public location: Location,
    public usersService: UsersService,
    public payeesService: ManagePayeeService,
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
      this.defaultPayee = this.payeesService.getPayeeId(this.id);
      if (this.defaultPayee && this.sampleForm) {
        this.sampleForm.resetForm({
          name: this.defaultPayee.name,
          icon: {name: this.defaultPayee.icon},
          description: this.defaultPayee.description,
        });
      } else {
        this.subscription = this.payeesService.payeesChanged$.subscribe(() => {
          this.defaultPayee = this.payeesService.getPayeeId(this.id);
          if (this.defaultPayee && this.sampleForm) {
            this.sampleForm.resetForm({
              name: this.defaultPayee.name,
              icon: {name: this.defaultPayee.icon},
              description: this.defaultPayee.description,
            });
          }
        });
      }
    }, 500);
  }

  displayFn(icon: { name: string }): string {
    return icon && icon.name ? icon.name : '';
  }

  async savePayee(sampleForm: NgForm) {
    try {
      if (this.isEdit) {
        await this.payeesService.updatePayee(
          {
            ...this.defaultPayee,
            name: sampleForm.value.name,
            description: sampleForm.value.description,
            icon: sampleForm.value.icon.name,
            uid: this.loader.user.providerData[0].uid,
          },
          this.defaultPayee.isDefault
        );
        // await this.router.navigate([this.defaultHref]);
        this.location.back();
      } else {
        await this.payeesService.addPayee(
          {
            name: sampleForm.value.name,
            description: sampleForm.value.description,
            icon: sampleForm.value.icon.name,
            uid: this.loader.user.providerData[0].uid,
          },
          false
        );
        // await this.router.navigate([this.defaultHref]);
        this.location.back();
      }
      sampleForm.resetForm({});
    } catch (e) {
      alert(e.message);
    }
  }

  async saveAsPayee(sampleForm: NgForm) {
    try {
      await this.payeesService.addPayee(
        {
          name: sampleForm.value.name,
          description: sampleForm.value.description,
          icon: sampleForm.value.icon.name,
          uid: this.loader.user.providerData[0].uid,
        },
        true
      );
      // await this.router.navigate([this.defaultHref]);
      this.location.back();
      sampleForm.resetForm({});
    } catch (e) {
      alert(e.message);
    }
  }
}
