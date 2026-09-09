import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApplicationUserPasswordReset } from 'src/app/models/account/application-user-password-reset.model';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  resetError: string | null = null;
  resetSuccess: string | null = null;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private formBuilder: FormBuilder,
    private meta: Meta,
    private title: Title
  ) {
    this.meta.addTags([
      {
        name: 'description',
        content:
          'Crowe Quest password reset page for verifying your account and choosing a new password.',
      },
      { name: 'author', content: 'Ben Crowe / open-source code' },
      {
        name: 'keywords',
        content: 'Genealogy, William, Crowe, Crow, Research, Family History',
      },
    ]);

    this.setTitle('Reset Password');
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group(
      {
        username: [
          null,
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(20),
          ],
        ],
        email: [
          null,
          [
            Validators.required,
            Validators.pattern(
              /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i
            ),
            Validators.maxLength(30),
          ],
        ],
        password: [
          null,
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(50),
          ],
        ],
        confirmPassword: [null, [Validators.required]],
      },
      {
        validators: this.matchValue,
      }
    );
  }

  formHasError(error: string) {
    return !!this.resetPasswordForm.hasError(error);
  }

  isTouched(field: string) {
    return this.resetPasswordForm.get(field)?.touched;
  }

  hasErrors(field: string) {
    return this.resetPasswordForm.get(field)?.errors;
  }

  hasError(field: string, error: string) {
    return !!this.resetPasswordForm.get(field)?.hasError(error);
  }

  matchValue: ValidatorFn = (fg: AbstractControl) => {
    const password = fg.get('password')?.value;
    const confirmPassword = fg.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { isMatching: true };
  };

  public setTitle(newTitle: string) {
    this.title.setTitle(newTitle);
  }

  onSubmit(): void {
    this.resetError = null;
    this.resetSuccess = null;

    const applicationUserPasswordReset = new ApplicationUserPasswordReset(
      this.resetPasswordForm.get('username')?.value,
      this.resetPasswordForm.get('email')?.value,
      this.resetPasswordForm.get('password')?.value,
      this.resetPasswordForm.get('confirmPassword')?.value
    );

    this.accountService.resetPassword(applicationUserPasswordReset).subscribe({
      next: (message) => {
        this.resetSuccess = message || 'Password reset successfully.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        const httpError = error as HttpErrorResponse;

        if (httpError?.status === 400) {
          this.resetError = 'Unable to reset password. Check your username and email.';
          return;
        }

        const backendMessage =
          typeof httpError?.error === 'string' && httpError.error
            ? httpError.error
            : 'Unable to reset your password right now. Please try again.';

        this.resetError = httpError?.status
          ? `${httpError.status}: ${backendMessage}`
          : backendMessage;
      },
    });
  }
}