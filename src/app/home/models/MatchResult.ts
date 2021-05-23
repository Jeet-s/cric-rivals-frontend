import { Team } from 'src/app/shared/models/Team';

export interface MatchResult {
  myTeam: Team;
  opponentTeam: Team;
  myScore: number;
  opponentScore: number;
}
