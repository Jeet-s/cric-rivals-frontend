import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Team } from 'src/app/shared/models/Team';
import {
  Player,
  PlayerCategoryEnum,
  PlayerTypeEnum,
} from '../models/BaseDataClass';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-manage-team',
  templateUrl: './manage-team.component.html',
  styleUrls: ['./manage-team.component.scss'],
})
export class ManageTeamComponent implements OnInit {
  allTeams: Team[]; //api
  selectedTeam: Team;
  currentTeamIndex = 0;

  squad: Player[];

  isEditMode: boolean = false;

  focusedInXi: Player;
  focusedInSquad: Player;

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.apiService.getTeamsList().subscribe((teams) => {
      this.allTeams = teams;

      if (this.authService.user.selectedTeam) {
        let userTeam = this.allTeams.find(
          (x) => x._id == this.authService.user.selectedTeam.teamId
        );
        userTeam.squad = userTeam.squad.map((p) => {
          p.order = this.authService.user.selectedTeam.squad.find(
            (x) => x.playerId == p._id
          ).order;

          return p;
        });
        this.selectedTeam = userTeam;
      } else if (window.history.state?.team) {
        this.selectedTeam = this.allTeams.find(
          (x) => x._id == window.history.state?.team
        );

        this.saveTeam();
      }

      console.log(this.selectedTeam);

      this.squad = this.selectedTeam.squad.sort((a, b) => {
        return (a.order || 12) - (b.order || 12);
      });
    });
  }

  prevTeam() {
    this.selectedTeam = this.allTeams[--this.currentTeamIndex];
    this.squad = this.selectedTeam.squad.sort((a, b) => {
      return (a.order || 12) - (b.order || 12);
    });
  }

  nextTeam() {
    this.selectedTeam = this.allTeams[++this.currentTeamIndex];
    this.squad = this.selectedTeam.squad.sort((a, b) => {
      return (a.order || 12) - (b.order || 12);
    });
  }

  getPlayerCategoryColor(category: PlayerCategoryEnum) {
    switch (category) {
      case PlayerCategoryEnum.Gold:
        return 'rgba(255, 215, 0, 0.7)';
      case PlayerCategoryEnum.Silver:
        return 'rgb(192, 192, 192, 0.7)';
      case PlayerCategoryEnum.Bronze:
        return 'rgb(205, 127, 50, 0.7)';
    }
  }

  getPlayerTypeIcon(player: Player) {
    if (player.isWicketKeeper) return '/assets/wicketkeeper.png';
    switch (player.type) {
      case PlayerTypeEnum.Batsman:
        return '/assets/bat.png';
      case PlayerTypeEnum.Bowler:
        return '/assets/ball.png';
      case PlayerTypeEnum.Allrounder:
        return '/assets/bat-ball.png';
    }
  }

  getArray(n: number) {
    return new Array(n);
  }

  getPlayingEleven() {
    return this.selectedTeam?.squad
      .filter((x) => x.order)
      .sort((a, b) => {
        return (a.order || 12) - (b.order || 12);
      });
  }

  getRemainingPlayers() {
    return this.selectedTeam?.squad
      .filter((x) => !x.order)
      .sort((a, b) => {
        return (a.order || 12) - (b.order || 12);
      });
  }

  focusFromXi(player: Player) {
    if (this.focusedInSquad) {
      this.focusedInSquad.order = player.order;
      player.order = null;
      this.focusedInSquad = null;
    } else if (this.focusedInXi) {
      if (this.focusedInXi._id != player._id) {
        let playerOrder = player.order;
        player.order = this.focusedInXi.order;
        this.focusedInXi.order = playerOrder;
      }
      this.focusedInXi = null;
    } else {
      this.focusedInXi = player;
    }
  }

  focusFromSquad(player: Player) {
    if (this.focusedInXi) {
      player.order = this.focusedInXi.order;
      this.focusedInXi.order = null;
      this.focusedInXi = null;
    } else {
      if (this.focusedInSquad?._id == player._id) {
        this.focusedInSquad = null;
      } else {
        this.focusedInSquad = player;
      }
    }
  }

  saveTeam() {
    this.isEditMode = false;
    this.apiService.saveUserTeam(this.selectedTeam).subscribe((res) => {
      console.log(res);
      this.authService.user.selectedTeam = res;
    });
  }
}
