import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Team } from '../models/Team';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-select-team',
  templateUrl: './select-team.component.html',
  styleUrls: ['./select-team.component.scss'],
})
export class SelectTeamComponent implements OnInit {
  teamsList$: Observable<Team[]>;
  selectedTeam: string;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.teamsList$ = this.apiService.getBasicTeamsList();
  }

  continue() {
    this.router.navigateByUrl('/home/manage-team', {
      state: {
        team: this.selectedTeam,
      },
    });
  }
}
