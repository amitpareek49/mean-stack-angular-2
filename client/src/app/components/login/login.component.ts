import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  message;
  messageClass;
  processing = false;
  previousURL;


  form;

  constructor(private authService: AuthService, private formBuilder: FormBuilder,
              private router: Router, private authGuard: AuthGuard) {
    this.createForm();
   }

   createForm () {
    this.form = this.formBuilder.group({
      username : ['', Validators.required],
      password : ['', Validators.required]
    });
   }

   enableForm() {
     this.form.controls['username'].enable();
     this.form.controls['password'].enable();
   }

   disableForm() {
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
   }

   onLoginSubmit() {
     this.processing = true;
     this.disableForm();

     const user = {
       username: this.form.get('username').value,
       password: this.form.get('password').value
     }

     this.authService.login(user).subscribe(data => {
       if(!data.success) {
         this.message = data.message;
         this.messageClass = 'alert alert-danger';
         this.processing = false;
         this.enableForm();
       } else {
         this.messageClass = 'alert alert-success';
         this.message = data.message;
         this.authService.storeUserData(data.token, data.user);
         setTimeout(() => {
           if(this.previousURL){
            this.router.navigate([this.previousURL]);
           } else {
            this.router.navigate(['/dashboard']);
           }
         }, 2000)
       }
     })
   }

  ngOnInit() {
   if(this.authGuard.redirectUrl){
    this.messageClass = 'alert alert-danger';
    this.message = 'You must be logged in to view this page';
    this.previousURL = this.authGuard.redirectUrl;
    this.authGuard.redirectUrl = undefined;
   }
  }

}
