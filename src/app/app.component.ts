import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { year } from './enums/enums';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  hasPartner?: boolean;
  hasDebtsNumber: number = 0;
  loanForm: FormGroup;
  year = year;

  constructor(private fb: FormBuilder) {
    this.loanForm = this.fb.group({
      firstName: new FormControl(),
      lastName: new FormControl(),
      city: new FormControl(),
      postal: new FormControl(),
      monthlyIncome: new FormControl(),
      monthlyIncomePartner: new FormControl(),
      hasPartner: new FormControl(false),
      hasDebts: new FormControl(false),
      calculatedMortgage: new FormControl(),
      year: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.loanForm.get('hasPartner')!.valueChanges.subscribe((value) => {
      if (value) {
        this.hasPartner = true;
      } else {
        this.hasPartner = false;
      }
    });
    this.loanForm.get('hasDebts')!.valueChanges.subscribe((value) => {
      if (value) {
        this.hasDebtsNumber = 75;
      } else {
        this.hasDebtsNumber = 0;
      }
    });
  }

  count() {
    const monthlyIncome = this.loanForm.get('monthlyIncome')?.value;
    const monthlyIncomePartner = this.loanForm.get(
      'monthlyIncomePartner'
    )?.value;
    const monthlyIncomeNumber = parseInt(monthlyIncome);
    let totalIncome;
    if (this.loanForm.get('hasPartner')?.value) {
      const monthlyIncomePartnerNumber = parseInt(monthlyIncomePartner);
      totalIncome = monthlyIncomeNumber + monthlyIncomePartnerNumber;
    } else {
      totalIncome = monthlyIncomeNumber;
    }

    if (this.loanForm.get('hasDebts')?.value) {
      const totalIncomee = totalIncome / 100;
      totalIncome = totalIncomee * this.hasDebtsNumber;
    }

    const totalLoan = totalIncome * 4.25;

    this.loanForm.controls['calculatedMortgage'].setValue(totalLoan);

    const year = this.loanForm.get('year')?.value;

    const test = year / 100;
    const total = test / 12;

    const money = 100000;
    const rip = money * total;
    console.log(
      '🚀 ~ file: app.component.ts:53 ~ AppComponent ~ count ~ total:',
      rip
    );
  }
}
