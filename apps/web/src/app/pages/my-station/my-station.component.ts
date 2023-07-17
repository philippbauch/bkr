import { CommonModule } from '@angular/common';
import { Component, HostBinding, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { Order, Result, Station, Team, TeamUtils } from '@bkr/api-interface';

import {
  ButtonComponent,
  EmptyComponent,
  LoadingComponent,
} from '../../components';
import { ChevronRightIconComponent } from '../../icons/mini';
import { AuthService, StationService, TeamService } from '../../services';

type ResultWithTeam = Result & { team: Team };

@Component({
  selector: 'bkr-my-station',
  standalone: true,
  imports: [
    ButtonComponent,
    ChevronRightIconComponent,
    CommonModule,
    EmptyComponent,
    LoadingComponent,
    RouterModule,
  ],
  templateUrl: './my-station.component.html',
  styleUrls: ['./my-station.component.scss'],
})
export class MyStationComponent {
  @HostBinding('class.page') page = true;

  readonly TeamUtils = TeamUtils;

  readonly loading = toSignal(this.teamService.loading$, {
    initialValue: false,
  });
  readonly stationId = toSignal(this.authService.sub$, { initialValue: null });

  readonly stations = toSignal(this.stationService.stations$, {
    initialValue: [] as Station[],
  });
  readonly teams = toSignal(this.teamService.teams$, {
    initialValue: [] as Team[],
  });

  readonly checkedInTeams = computed(() => {
    return this.teams().filter((team) =>
      team.results.some(
        (result) => result.stationId === this.stationId() && !result.checkOut
      )
    );
  });

  readonly results = computed(() => {
    const station = this.stations().find(
      (station) => station.id === this.stationId()
    );

    if (!station) {
      return [];
    }

    return (
      station.results
        // Only show results that have checked out
        .filter((result) => result.checkOut)
        // Find the team for each result
        .map((result) => ({
          ...result,
          team: this.teams().find((team) => team.id === result.teamId),
        }))
        // Filter out results that don't have a team
        .filter(
          (result): result is ResultWithTeam =>
            typeof result.team !== 'undefined'
        )
        // Sort results by points
        .sort((a, b) =>
          station.order === Order.ASC
            ? a.points - b.points
            : b.points - a.points
        )
    );
  });

  constructor(
    private readonly authService: AuthService,
    private readonly stationService: StationService,
    private readonly teamService: TeamService
  ) {}
}
