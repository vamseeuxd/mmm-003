import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {LoaderService} from '../shared/services/loader/loader.service';
import {UsersService} from '../shared/services/users/users.service';
import {
  ITaxDeduction,
  ManageTaxDeductionService
} from '../shared/services/manage-tax-deduction/manage-tax-deduction.service';

@Component({
  selector: 'app-add-or-edit-tax-deduction',
  templateUrl: './add-or-edit-tax-deduction.page.html',
  styleUrls: ['./add-or-edit-tax-deduction.page.scss'],
})
export class AddOrEditTaxDeductionPage implements OnInit, OnDestroy {
  @ViewChild('sampleForm') sampleForm: NgForm;
  defaultHref = `/manage-tax-deduction`;
  id = '';
  action = 'Add new';
  isEdit = false;
  defaultTaxDeduction: ITaxDeduction;
  subscription: Subscription;

  constructor(
    public http: HttpClient,
    public route: ActivatedRoute,
    public loader: LoaderService,
    public router: Router,
    public usersService: UsersService,
    public taxDeductionsService: ManageTaxDeductionService,
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
      this.defaultTaxDeduction = this.taxDeductionsService.getTaxDeductionId(this.id);
      if (this.defaultTaxDeduction && this.sampleForm) {
        this.sampleForm.resetForm({
          name: this.defaultTaxDeduction.name,
          icon: this.defaultTaxDeduction.icon,
          description: this.defaultTaxDeduction.description,
        });
      } else {
        this.subscription = this.taxDeductionsService.taxDeductionsChanged$.subscribe(() => {
          this.defaultTaxDeduction = this.taxDeductionsService.getTaxDeductionId(this.id);
          if (this.defaultTaxDeduction && this.sampleForm) {
            this.sampleForm.resetForm({
              name: this.defaultTaxDeduction.name,
              icon: this.defaultTaxDeduction.icon,
              description: this.defaultTaxDeduction.description,
            });
            // console.log(this.defaultTaxDeduction);
          }
        });
      }
    }, 500);
  }

  displayFn(icon: { name: string }): string {
    return icon && icon.name ? icon.name : '';
  }

  async saveTaxDeduction(sampleForm: NgForm) {
    try {
      if (this.isEdit) {
        await this.taxDeductionsService.updateTaxDeduction(
          {
            ...this.defaultTaxDeduction,
            name: sampleForm.value.name,
            description: sampleForm.value.description,
            icon: sampleForm.value.icon.name,
            uid: this.loader.user.providerData[0].uid,
          },
          this.defaultTaxDeduction.isDefault
        );
        await this.router.navigate([this.defaultHref]);
      } else {
        await this.taxDeductionsService.addTaxDeduction(
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

  async saveAsTaxDeduction(sampleForm: NgForm) {
    try {
      await this.taxDeductionsService.addTaxDeduction(
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
