import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { map } from 'rxjs/operators';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { environment } from 'src/environments/environment';
import { __awaiter } from 'tslib';
import { AuthData } from '../models/AuthData';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _token: string;
  private _user: User;

  get token() {
    return this._token;
  }

  set token(val: string) {
    this._token = val;
  }

  get user() {
    return this._user;
  }

  set user(val: User) {
    this._user = val;
  }

  baseUrl: string = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  login(user: User) {
    this.http
      .post<AuthData>(this.baseUrl + '/auth/login', user)
      .subscribe((res) => {
        this.loadingService.stopLoading();
        this.setAuthData(res);
        this.saveAuthDataToStorage();
        if (this.user.selectedTeam) {
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/select-team']);
        }
      });
  }

  async isAuthenticated(): Promise<boolean> {
    await this.getCurrentUser();
    return new Promise((resolve, reject) => {
      resolve(!!this.token);
    });
  }

  async getCurrentUser(): Promise<AuthData> {
    let user = await Plugins.Storage.get({ key: 'authDataCric' });
    console.log('from storage 1', user);
    let authData = JSON.parse(user.value);
    if (authData) {
      this.setAuthData(authData);
      this.saveAuthDataToStorage();
      return new Promise((resolve, reject) => {
        this.http
          .get<AuthData>(this.baseUrl + '/auth/current-user')
          .pipe(
            map((x) => {
              this.setAuthData(x);
              this.saveAuthDataToStorage();
              console.log('from api', x);
              return x;
            })
          )
          .subscribe(
            (_) => {
              resolve(this.getAuthData());
            },
            (_) => {
              resolve(null);
            }
          );
      });
    }
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  }

  private saveAuthDataToStorage() {
    let model: AuthData = {
      user: this.user,
      token: this.token,
    };
    Plugins.Storage.set({
      key: 'authDataCric',
      value: JSON.stringify(model),
    });
  }

  private setAuthData(authData: AuthData) {
    this.token = authData.token;
    this.user = authData.user;
  }

  private getAuthData(): AuthData {
    return {
      token: this.token,
      user: this.user,
    };
  }
}
