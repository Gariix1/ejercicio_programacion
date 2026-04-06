import { NgIf } from '@angular/common';
import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import {
  EmployeeFormField,
  EmployeeFormFieldErrors,
  getEmployeeFieldErrorMessage,
  getEmployeeFieldHint,
  getEmployeeFieldSuccessMessage,
} from '../forms/employee-form-errors';

@Component({
  selector: 'app-employee-field-feedback',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="invalid-feedback d-block app-field-feedback" *ngIf="error() as message">{{ message }}</div>
    <div class="valid-feedback d-block app-field-feedback" *ngIf="!error() && success() as message">✓ {{ message }}</div>
    <small class="form-text text-muted d-block app-field-feedback app-field-feedback--hint" *ngIf="!error() && !success() && hint() as message">
      {{ message }}
    </small>
  `,
})
export class EmployeeFieldFeedbackComponent {
  readonly field = input.required<EmployeeFormField>();
  readonly control = input.required<AbstractControl | null>();
  readonly fieldErrors = input<EmployeeFormFieldErrors>({});

  protected error(): string | null {
    return getEmployeeFieldErrorMessage(this.field(), this.control(), this.fieldErrors());
  }

  protected success(): string | null {
    return getEmployeeFieldSuccessMessage(this.field(), this.control(), this.fieldErrors());
  }

  protected hint(): string | null {
    return getEmployeeFieldHint(this.field());
  }
}
