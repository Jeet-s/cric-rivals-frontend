import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { SocketService } from '../../services/socket.service';

@Injectable({
  providedIn: 'root',
})
export class StartGameResolverService implements Resolve<any> {
  isSinglePlayer: boolean = false;
  opponentTeamId: string;
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private socketService: SocketService,
    private router: Router
  ) {
    this.isSinglePlayer =
      this.router.getCurrentNavigation().extras.state?.isSinglePlayer;
    this.opponentTeamId =
      this.router.getCurrentNavigation().extras.state?.opponentTeamId;
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return forkJoin({
      myTeam: this.apiService.getUserTeamSquad(this.authService.user._id),
      opponentTeam: this.isSinglePlayer
        ? this.apiService.getTeamSquad(this.opponentTeamId)
        : this.apiService.getUserTeamSquad(this.socketService.opponentUserId),
    });
  }
}
