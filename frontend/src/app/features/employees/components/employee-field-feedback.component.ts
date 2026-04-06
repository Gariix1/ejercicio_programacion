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
    <div class="invalid-feedback d-block" *ngIf="error() as message">{{ message }}</div>
    <div class="valid-feedback d-block" *ngIf="!error() && success() as message">✓ {{ message }}</div>
    <small class="form-text text-muted d-block" *ngIf="!error() && !success() && hint() as message">
      {{ message }}
    </small>
  `,
  styles: [`
    .invalid-feedback,
    .valid-feedback,
    .form-text {
      font-size: 0.84rem;
      line-height: 1.35;
      animation: feedbackFade 180ms ease both;
    }

    .form-text {
      color: var(--text-soft) !important;
    }

    @keyframes feedbackFade {
      from {
        opacity: 0;
        transform: translateY(-2px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
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
