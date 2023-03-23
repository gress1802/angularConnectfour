import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() username? : string;
  @Input() password? : string;
    
  constructor( private router : Router, private authService : AuthService ) { }

  ngOnInit() {
   }
  
  login() {
    if( this.username && this.password ) {
      this.authService.login(this.username, this.password).subscribe( () => {
        this.username = '';
        this.password = '';
        this.router.navigateByUrl( '/list/' );
      }, (err) => {
        alert("Invalid username or password");
      });
    }
  }
}
