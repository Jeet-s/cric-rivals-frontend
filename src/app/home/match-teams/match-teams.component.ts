import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-match-teams',
  templateUrl: './match-teams.component.html',
  styleUrls: ['./match-teams.component.scss'],
})
export class MatchTeamsComponent implements OnInit {
  opponentTeamId: string = '6096fc610550fa17946ef271';

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/home/playground'], {
        state: {
          isSinglePlayer: true,
          opponentTeamId: this.opponentTeamId,
        },
      });
    }, 3000);
  }
}
