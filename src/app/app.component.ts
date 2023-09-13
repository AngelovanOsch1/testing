import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { year } from './enums/enums';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  monthlyPayment: boolean = false;

  constructor(private fb: FormBuilder,  private snackBar: MatSnackBar,) {
    this.loanForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postal: ['', [Validators.required]],
      yearIncome: ['', [Validators.required]],
      yearIncomePartner: new FormControl(),
      hasPartner: new FormControl(false),
      hasDebts: new FormControl(false),
      calculatedMortgage: new FormControl(),
      year: ['', [Validators.required]],
      goingToLend: ['', [Validators.required]],
      payAMonth: [''],
    });  }

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
    const postal = this.loanForm.get('postal')?.value;

    if(postal.includes(9679 || 9681 || 9682)) {
      this.snackBar.open(
        'Hypotheken die worden aangevraagd voor postcode gebieden 9679, 9681 of 9682 worden niet geaccepteerd. Dit is in verband met het aardbevingsgebied en dalende woningwaarde.',
        '',
        {
          duration: 10000,
        }
      );
      return;
    }

    const monthlyIncome = this.loanForm.get('yearIncome')?.value;
    const monthlyIncomePartner = this.loanForm.get(
      'yearIncomePartner'
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
  }

  countMonthlyPayment() {
    const year = this.loanForm.get('year')?.value;
    const interest = year / 100;
    const totalInterest = interest / 12;

    const goingToLend = this.loanForm.get('goingToLend')?.value;

    const monthlyPayment = goingToLend * totalInterest;
    this.loanForm.controls['payAMonth'].setValue(monthlyPayment);
    this.monthlyPayment = true;

  }

  getError(name: string) {
    const field = this.loanForm.get(name);
    if (field!.touched || !field!.pristine) {
      let error: string;
      if (field!.hasError('required')) {
        error = 'required';
      }
      return error! as string;
    }
    return '';
  }
}
