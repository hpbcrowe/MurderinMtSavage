import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationUserLogin } from 'src/app/models/account/application-user-login.model';
import { AccountService } from 'src/app/services/account.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private formBuilder: FormBuilder,
    private meta: Meta,
    private title: Title
  ) {
    if (this.accountService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }

    this.meta.addTags([
      {
        name: 'description',
        content:
          'Crowe Quest Log in Page gives access to users with accounts to write a post or comment',
      },
      { name: 'author', content: 'Ben Crowe / open-source code' },
      {
        name: 'keywords',
        content: 'Genealogy, William, Crowe, Crow, Research, Family History',
      },
    ]);

    this.setTitle('Login');
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(20),
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
    });
  }

  isTouched(field: string) {
    return this.loginForm.get(field)?.touched;
  }

  hasErrors(field: string) {
    return this.loginForm.get(field)?.errors;
  }

  hasError(field: string, error: string) {
    return !!this.loginForm.get(field)?.hasError(error);
  }

  onSubmit() {
    let applicationUserLogin: ApplicationUserLogin = new ApplicationUserLogin(
      this.loginForm.get('username')?.value,
      this.loginForm.get('password')?.value
    );

    this.accountService.login(applicationUserLogin).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }

  public setTitle(newTitle: string) {
    this.title.setTitle(newTitle);
  }
}
