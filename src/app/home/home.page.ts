import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger('start', [
      state(
        'initial',
        style({
          height: '200px',
          width: '220px',
          'clip-path':
            'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          opacity: 0.8,
        })
      ),
      state(
        'start',
        style({
          height: '100vh',
          width: '100vw',
          'clip-path':
            'polygon(0 0, 100% 0, 100% 50%, 100% 100%, 0 100%, 0% 50%)',
          opacity: 0,
        })
      ),
      transition('initial => start', [animate('0.3s')]),
    ]),
    trigger('manageTeam', [
      state(
        'initial',
        style({
          height: '60px',
          width: '332px',
          'clip-path':
            'polygon(16% 0, 84% 0, 100% 66%, 100% 100%, 0 100%, 0 66%)',
          opacity: 0.8,
        })
      ),
      state(
        'start',
        style({
          height: '100vh',
          width: '100vw',
          'clip-path':
            'polygon(0 0, 100% 0, 100% 50%, 100% 100%, 0 100%, 0% 50%)',
          opacity: 0,
        })
      ),
      transition('initial => start', [animate('0.3s')]),
    ]),
  ],
})
export class HomePage {
  isStarted: boolean = false;
  isManageTeamClicked: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.socketService.connect();
  }

  start() {
    this.isStarted = true;
    let self = this;

    console.log(this.authService.user);

    if (!this.authService.user.selectedTeam) {
      this.router.navigate(['/select-team']);
      return;
    }

    setTimeout(() => {
      self.router.navigate(['/home/start-game']);
      this.isStarted = false;
    }, 300);
  }

  manageTeam() {
    this.isManageTeamClicked = true;
    let self = this;

    if (!this.authService.user.selectedTeam) {
      this.router.navigate(['/select-team']);
      return;
    }

    setTimeout(() => {
      self.router.navigate(['/home/manage-team']);
      this.isManageTeamClicked = false;
    }, 300);
  }
}
