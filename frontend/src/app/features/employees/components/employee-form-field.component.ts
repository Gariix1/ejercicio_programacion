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
    <div class="field-shell">
      <label class="form-label">
        {{ label() }}
        <span class="required-mark" *ngIf="required()"> *</span>
      </label>

      <ng-content></ng-content>

      <app-employee-field-feedback
        [field]="field()"
        [control]="control()"
        [fieldErrors]="fieldErrors()"
      ></app-employee-field-feedback>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .field-shell {
      display: grid;
      gap: 7px;
    }

    .form-label {
      margin: 0;
      color: #5f564d;
      font-size: 0.92rem;
      font-weight: 700;
      line-height: 1.25;
      letter-spacing: 0.01em;
    }

    .required-mark {
      color: #c24f3d;
      font-weight: 700;
    }
  `],
})
export class EmployeeFormFieldComponent {
  readonly label = input.required<string>();
  readonly field = input.required<EmployeeFormField>();
  readonly control = input.required<AbstractControl | null>();
  readonly fieldErrors = input<EmployeeFormFieldErrors>({});
  readonly required = input(false);
}
