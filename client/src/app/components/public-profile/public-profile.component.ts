import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {

  currentUrl;
  message;
  messageClass;
  foundProfile = false;
  email;
  username;
  
  constructor(private authService: AuthService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;

    this.authService.getPublicProfile(this.currentUrl.username).subscribe(data => {
      if(!data.success){
        this.message = 'Username not found';
        this.messageClass ='alert alert-danger';
      } else {
        this.foundProfile = true;
        this.username = data.user.username;
        this.email = data.user.email;
      }
    });
  }
}
