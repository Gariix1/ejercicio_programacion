import { NgIf } from '@angular/common';
import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { EmployeeFieldFeedbackComponent } from './employee-field-feedback.component';
import { EmployeeFormField, EmployeeFormFieldErrors } from '../forms/employee-form-errors';

@Component({
  selector: 'app-employee-form-field',
  standalone: true,
  imports: [NgIf, EmployeeFieldFeedbackComponent],
  template: `
    <div class="app-field-shell">
      <label class="app-field-label">
        {{ label() }}
        <span class="app-required-mark" *ngIf="required()"> *</span>
      </label>

      <ng-content></ng-content>

      <app-employee-field-feedback
        [field]="field()"
        [control]="control()"
        [fieldErrors]="fieldErrors()"
      ></app-employee-field-feedback>
    </div>
  `,
})
export class EmployeeFormFieldComponent {
  readonly label = input.required<string>();
  readonly field = input.required<EmployeeFormField>();
  readonly control = input.required<AbstractControl | null>();
  readonly fieldErrors = input<EmployeeFormFieldErrors>({});
  readonly required = input(false);
}
