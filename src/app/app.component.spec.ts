import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox'; // Import MatCheckboxModule
import { year } from './enums/enums';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [FormBuilder, { provide: MatSnackBar, useClass: MatSnackBar }],
      imports: [MatCheckboxModule], // Include MatCheckboxModule in the imports
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should set postal error when postal code includes 9679 or 9681 or 9682', () => {
    component.loanForm.get('postal')!.setValue('9681');
    component.count();

    expect(component.loanForm.get('postal')!.hasError('postalError')).toBe(
      true
    );
  });

  it('should calculate mortgage', () => {
    component.loanForm.get('postal')!.setValue('12345');
    component.loanForm.get('yearIncome')!.setValue(5000);
    component.loanForm.get('hasPartner')!.setValue(true);
    component.loanForm.get('yearIncomePartner')!.setValue(3000);
    component.loanForm.get('hasDebts')!.setValue(true);
    component.hasDebtsNumber = 75;

    component.count();

    expect(component.loanForm.get('postal')!.hasError('postalError')).toBe(
      false
    );

    expect(component.totalLoan).toBe(25500);
    expect(component.loanForm.get('calculatedMortgage')!.value).toBe(25500);
  });

  it('should calculate monthly payment and set form control values when form is valid', () => {
    component.loanForm.get('firstName')!.setValue('UserName');
    component.loanForm.get('lastName')!.setValue('UserLastName');
    component.loanForm.get('city')!.setValue('UserCity');
    component.loanForm.get('postal')!.setValue('UserPostal');
    component.loanForm.get('yearIncome')!.setValue('12345');

    component.loanForm.get('year')!.setValue(year.TWENTYYEARS);
    component.loanForm.get('goingToLend')!.setValue(10000);

    component.countMonthlyPayment();

    expect(component.loanForm.get('payAMonth')!.value).toBe(25);
  });

  it('should mark all form controls as touched when form is invalid', () => {
    component.loanForm.get('year')!.setValue(null);
    component.loanForm.get('calculatedMortgage')!.setValue(100000);
    component.loanForm.get('goingToLend')!.setValue(10);

    spyOn(component.loanForm, 'markAllAsTouched');

    component.countMonthlyPayment();

    expect(component.loanForm.markAllAsTouched).toHaveBeenCalled();
  });
});
