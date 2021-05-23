import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserTeam } from 'src/app/auth/models/User';
import { Team } from 'src/app/shared/models/Team';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = environment.baseUrl + '/api/';

  constructor(private http: HttpClient) {}

  getTeamsList(): Observable<Team[]> {
    return this.http.get<Team[]>(this.baseUrl + 'teams/all');
  }

  saveUserTeam(team: Team): Observable<UserTeam> {
    return this.http.post<UserTeam>(this.baseUrl + 'teams/user', team);
  }
}
