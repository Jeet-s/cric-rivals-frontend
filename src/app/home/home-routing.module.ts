import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { ManageTeamComponent } from './manage-team/manage-team.component';
import { MatchResultComponent } from './match-result/match-result.component';
import { MatchTeamsComponent } from './match-teams/match-teams.component';
import { PlaygroundComponent } from './playground/playground.component';
import { StartGameResolverService } from './start-game/services/start-game-resolver.service';
import { StartGameComponent } from './start-game/start-game.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'manage-team',
    component: ManageTeamComponent,
  },
  {
    path: 'start-game',
    component: StartGameComponent,
  },
  {
    path: 'playground',
    component: PlaygroundComponent,
    resolve: { squads: StartGameResolverService },
  },
  {
    path: 'match-result',
    component: MatchResultComponent,
  },
  {
    path: 'match-teams',
    component: MatchTeamsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
