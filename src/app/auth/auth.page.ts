import { Component, OnInit } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LoadingService } from '../shared/services/loading.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  constructor(
    private authService: AuthService,
    private googlePlus: GooglePlus,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {}

  login() {
    this.googlePlus
      .login({})
      .then((user) => {
        console.log(user);
        this.loadingService.startLoading();
        this.authService.login({
          email: user.email,
          googleId: user.userId,
          image: user.imageUrl,
          username: user.displayName,
        });
      })
      .catch((err) => console.log('err', err));
  }
}
