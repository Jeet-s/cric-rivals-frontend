import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ManageTeamComponent } from './manage-team/manage-team.component';
import { MatIconModule } from '@angular/material/icon';
import { StartGameComponent } from './start-game/start-game.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PlaygroundComponent } from './playground/playground.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatchResultComponent } from './match-result/match-result.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    FlexLayoutModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressBarModule,
  ],
  declarations: [
    HomePage,
    ManageTeamComponent,
    StartGameComponent,
    PlaygroundComponent,
    MatchResultComponent,
  ],
})
export class HomePageModule {}
