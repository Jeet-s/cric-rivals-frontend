import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from 'src/app/home/models/BaseDataClass';
import { environment } from 'src/environments/environment';
import { Team } from '../models/Team';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = environment.baseUrl + '/api/';

  constructor(private http: HttpClient) {}

  getBasicTeamsList(): Observable<Team[]> {
    return this.http.get<Team[]>(this.baseUrl + 'teams/all/basic');
  }

  getUserTeamSquad(userId: string): Observable<Team> {
    return this.http.get<Team>(this.baseUrl + `teams/user/${userId}`);
  }

  getTeamSquad(teamId: string): Observable<Team> {
    return this.http.get<Team>(this.baseUrl + `teams/${teamId}`);
  }
}
