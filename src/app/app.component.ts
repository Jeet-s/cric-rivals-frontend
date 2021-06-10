import { Component, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
} from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoadingService } from './shared/services/loading.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private so: ScreenOrientation,
    platform: Platform,
    public loadingService: LoadingService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    platform.ready().then(() => {
      StatusBar.hide();
      this.so.lock(this.so.ORIENTATIONS.LANDSCAPE);
    });
  }

  ngOnInit() {
    this.router.events.subscribe((e: RouterEvent) => {
      this.navigationInterceptor(e);
    });

    this.loadingService.shouldLoad().subscribe((res) => {
      console.log('Loading Res', res);
      if (res) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    });
  }

  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      console.log('Navigation Start');
      this.loadingService.startLoading();
    }
    if (event instanceof NavigationEnd) {
      console.log('Navigation End');

      this.loadingService.stopLoading();
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.loadingService.stopLoading();
    }
    if (event instanceof NavigationError) {
      this.loadingService.stopLoading();
    }
  }
}
