import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectTeamComponent } from './select-team/select-team.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [SelectTeamComponent],
  imports: [CommonModule, FlexLayoutModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
