import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {shareReplay} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {LoaderService} from '../shared/services/loader/loader.service';
import {UsersService} from '../shared/services/users/users.service';
import {IPayer, ManagePayerService} from '../shared/services/manage-payer.service';

@Component({
  selector: 'app-add-or-edit-payer',
  templateUrl: './add-or-edit-payer.page.html',
  styleUrls: ['./add-or-edit-payer.page.scss'],
})
export class AddOrEditPayerPage implements OnInit, OnDestroy {
  @ViewChild('sampleForm') sampleForm: NgForm;
  defaultHref = `/manage-payers`;
  icons$ = this.http.get<{ name: string }[]>('./assets/icons-list.json').pipe(
    shareReplay()
  );
  id = '';
  action = 'Add new';
  isEdit = false;
  defaultPayer: IPayer;
  subscription: Subscription;

  constructor(
    public http: HttpClient,
    public route: ActivatedRoute,
    public loader: LoaderService,
    public router: Router,
    public usersService: UsersService,
    public payersService: ManagePayerService,
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
      this.defaultPayer = this.payersService.getPayerId(this.id);
      if (this.defaultPayer && this.sampleForm) {
        this.sampleForm.resetForm({
          name: this.defaultPayer.name,
          icon: {name: this.defaultPayer.icon},
          description: this.defaultPayer.description,
        });
      } else {
        this.subscription = this.payersService.payersChanged$.subscribe(() => {
          this.defaultPayer = this.payersService.getPayerId(this.id);
          if (this.defaultPayer && this.sampleForm) {
            this.sampleForm.resetForm({
              name: this.defaultPayer.name,
              icon: {name: this.defaultPayer.icon},
              description: this.defaultPayer.description,
            });
            // console.log(this.defaultPayer);
          }
        });
      }
    }, 500);
  }

  displayFn(icon: { name: string }): string {
    return icon && icon.name ? icon.name : '';
  }

  async savePayer(sampleForm: NgForm) {
    try {
      if (this.isEdit) {
        await this.payersService.updatePayer(
          {
            ...this.defaultPayer,
            name: sampleForm.value.name,
            description: sampleForm.value.description,
            icon: sampleForm.value.icon.name,
            uid: this.loader.user.providerData[0].uid,
          },
          this.defaultPayer.isDefault
        );
        await this.router.navigate([this.defaultHref]);
      } else {
        await this.payersService.addPayer(
          {
            name: sampleForm.value.name,
            description: sampleForm.value.description,
            icon: sampleForm.value.icon.name,
            uid: this.loader.user.providerData[0].uid,
          },
          false
        );
        await this.router.navigate([this.defaultHref]);
      }
      sampleForm.resetForm({});
    } catch (e) {
      alert(e.message);
    }
  }

  async saveAsPayer(sampleForm: NgForm) {
    try {
      await this.payersService.addPayer(
        {
          name: sampleForm.value.name,
          description: sampleForm.value.description,
          icon: sampleForm.value.icon.name,
          uid: this.loader.user.providerData[0].uid,
        },
        true
      );
      await this.router.navigate([this.defaultHref]);
      sampleForm.resetForm({});
    } catch (e) {
      alert(e.message);
    }
  }
}
