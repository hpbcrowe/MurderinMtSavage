import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationUserCreate } from 'src/app/models/account/application-user-create.model';
import { AccountService } from 'src/app/services/account.service';
import { Meta, Title } from '@angular/platform-browser';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private formBuilder: FormBuilder,
    private meta: Meta, 
    private title: Title
  ) {
    this.meta.addTags([
      {name: 'description', content: 'Register Page for Users requesting account'},
      {name: 'author', content: 'Ben Crowe / open-source code'},
      {name: 'keywords', content: 'Genealogy, William, Crowe, Crow, Research, Family History'}

    ]);
    this.setTitle('Home Page/Register');

   }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      fullname: [null, [
        Validators.minLength(10),
        Validators.maxLength(30)
      ]],
      username: [null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20)
      ]],
      email: [null, [
        Validators.required,
        Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i),
        Validators.maxLength(30)
      ]],
      lineOfDescent: [null, [
        Validators.minLength(5)
       
      ]],
      password: [null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(50)
      ]],
      confirmPassword: [null, [
        Validators.required
      ]]
    }, {
      validators: this.matchValue
    });
  }

  formHasError(error: string) {
    return !!this.registerForm.hasError(error);
  }

  isTouched(field: string) {
    return this.registerForm.get(field)?.touched;
  }

  hasErrors(field: string) {
    return this.registerForm.get(field)?.errors;
  }

  hasError(field: string, error: string) {
    return !!this.registerForm.get(field)?.hasError(error);
  }

  //Had to change Type FormGroup to AbstractControl, will need 
  //to verify that this works. this is below fg: AbstractControl
  //was FormGroup
  matchValue: ValidatorFn = (fg: AbstractControl) => {
    const password = fg.get('password')?.value;
    const confirmPassword = fg.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { isMatching: true };
  }

  public setTitle(newTitle: string){
    this.title.setTitle( newTitle);
   }  

  onSubmit(): void {
    let applicationUserCreate: ApplicationUserCreate = new ApplicationUserCreate(
      this.registerForm.get("username")?.value,
      this.registerForm.get("password")?.value,
      this.registerForm.get("email")?.value,
      this.registerForm.get("fullname")?.value,
      this.registerForm.get("lineOfDescent")?.value,
    );

    this.accountService.register(applicationUserCreate).subscribe(() => {
      this.router.navigate(['/dashboard']);
    })
  }
}