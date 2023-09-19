import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { year } from './enums/enums';
import { MatSnackBar } from '@angular/material/snack-bar';
import { onlyNumbersAsyncValidator } from './CustomValidators';

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
  totalLoan: number = 0;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.loanForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postal: ['', [Validators.required]],
      yearIncome: ['', [Validators.required], [onlyNumbersAsyncValidator()]],
      yearIncomePartner: [''],
      hasPartner: new FormControl(false),
      hasDebts: new FormControl(false),
      calculatedMortgage: new FormControl(),
      year: ['', [Validators.required]],
      goingToLend: ['', [Validators.required]],
      payAMonth: [''],
    });
  }

  ngOnInit(): void {
    this.loanForm.get('hasPartner')!.valueChanges.subscribe((value) => {
      if (value) {
        this.hasPartner = true;
        this.loanForm.controls['yearIncomePartner'].addValidators(
          Validators.required
        );
      } else {
        this.hasPartner = false;
        this.loanForm.controls['yearIncomePartner'].clearValidators();
        this.loanForm.controls['yearIncomePartner'].updateValueAndValidity();
      }
    });

    this.loanForm.get('yearIncomePartner')!.valueChanges.subscribe((value) => {
      if (value) {
        const isNumber = /^[0-9]*$/.test(value);
        if (!isNumber) {
          this.loanForm.controls['yearIncomePartner'].setErrors({
            onlyNumbers: true,
          });
        }
      }
    });

    this.loanForm.get('hasDebts')!.valueChanges.subscribe((value) => {
      if (value) {
        this.hasDebtsNumber = 75;
      } else {
        this.hasDebtsNumber = 0;
      }
    });

    this.loanForm.get('goingToLend')!.valueChanges.subscribe((value) => {
      if (value > this.totalLoan) {
        this.loanForm.controls['goingToLend'].setErrors({
          tooHighInput: true,
        });
      }

      if (value) {
        const isNumber = /^[0-9]*$/.test(value);
        if (!isNumber) {
          this.loanForm.controls['goingToLend'].setErrors({
            onlyNumbers: true,
          });
        }
      }
    });
  }

  count() {
    const postal = this.loanForm.get('postal')?.value;

    const allowedPostalCodes = ['9679', '9681', '9682'];

    const foundPostal = allowedPostalCodes.find((code) =>
      postal.includes(code)
    );

    if (foundPostal) {
      this.loanForm.controls['postal'].setErrors({
        postalError: true,
      });
      return;
    }

    const monthlyIncome = parseFloat(this.loanForm.get('yearIncome')!.value);

    let totalIncome: number;
    if (this.loanForm.get('hasPartner')!.value) {
      const monthlyIncomePartner = parseFloat(
        this.loanForm.get('yearIncomePartner')!.value
      );
      totalIncome = monthlyIncome + monthlyIncomePartner;
    } else {
      totalIncome = monthlyIncome;
    }

    if (this.loanForm.get('hasDebts')!.value) {
      const tax = totalIncome / 100;
      totalIncome = tax * this.hasDebtsNumber;
    }

    this.totalLoan = totalIncome * 4.25;

    this.loanForm.controls['calculatedMortgage'].setValue(this.totalLoan);
  }

  countMonthlyPayment() {
    if (this.loanForm.invalid) {
      return this.loanForm.markAllAsTouched();
    }

    const year = parseFloat(this.loanForm.get('year')!.value);
    const interest = year / 100;
    const totalInterest = interest / 12;

    const goingToLend = parseFloat(this.loanForm.get('goingToLend')!.value);
    const num = goingToLend / 360;

    const monthlyPayment = goingToLend * totalInterest;
    const finalNum = num + monthlyPayment;

    this.loanForm.controls['payAMonth'].setValue(
      (Math.round(finalNum * 100) / 100).toFixed(2)
    );
    this.monthlyPayment = true;
  }

  getError(name: string) {
    const field = this.loanForm.get(name);
    let error: string;

    if (field!.touched || !field!.pristine) {
      if (field!.hasError('required')) {
        error = 'Dit veld is verplicht';
      }

      if (field!.hasError('postalError')) {
        error =
          'Hypotheken die worden aangevraagd voor postcode gebieden 9679, 9681 of 9682 worden niet geaccepteerd. Dit is in verband met het aardbevingsgebied en dalende woningwaarde.';
      }

      if (field!.hasError('tooHighInput')) {
        error = 'Het is niet mogelijk om meer te lenen dan je bent toegestaan.';
      }

      if (field!.hasError('onlyNumbers')) {
        error = 'Alleen nummers zijn toegestaan in dit veld.';
      }

      return error! as string;
    }
    return '';
  }
}
