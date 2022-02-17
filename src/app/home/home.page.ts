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
})
export class HomePage {
  isStarted: boolean = false;
  isManageTeamClicked: boolean = false;

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit(): void {}

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

  startSinglePlayer() {
    let self = this;

    if (!this.authService.user.selectedTeam) {
      this.router.navigate(['/select-team']);
      return;
    }

    // setTimeout(() => {
    //   self.router.navigate(['/home/match-teams']);
    //   this.isStarted = false;
    // }, 300);

    setTimeout(() => {
      this.router.navigate(['/home/playground'], {
        state: {
          isSinglePlayer: true,
          opponentTeamId: '6096fc610550fa17946ef271',
        },
      });
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
