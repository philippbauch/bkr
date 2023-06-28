import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { TeamUtils } from '@bkr/api-interface';

import {
  ButtonComponent,
  EmptyComponent,
  LoadingComponent,
} from '../../components';
import {
  AuthService,
  NotificationService,
  ResultService,
  TeamService,
} from '../../services';

@Component({
  selector: 'bkr-check-in',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    EmptyComponent,
    LoadingComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss'],
})
export class CheckInComponent {
  readonly TeamUtils = TeamUtils;

  readonly loading = toSignal(this.teamService.loading$, {
    initialValue: false,
  });
  readonly stationId = toSignal(this.authService.sub$, { initialValue: null });
  readonly teams = toSignal(this.teamService.teams$, { initialValue: [] });

  readonly teamsToCheckIn = computed(() => {
    return this.teams()
      .filter(TeamUtils.isRunning)
      .filter(
        (team) =>
          !team.results.some((result) => result.stationId === this.stationId())
      );
  });

  checkInLoading = signal(false);
  form = new FormGroup({
    selectedTeamId: new FormControl<string>('', Validators.required),
  });

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly resultService: ResultService,
    private readonly router: Router,
    private readonly teamService: TeamService
  ) {}

  handleCheckIn(): void {
    const { selectedTeamId } = this.form.value;
    const stationId = this.stationId();

    if (!stationId || !selectedTeamId) {
      return;
    }

    this.checkInLoading.set(true);

    this.resultService
      .createResult(stationId, selectedTeamId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.checkInLoading.set(false);
          this.notificationService.success('Team wurde eingecheckt.');

          this.router.navigate(['/station']);
        },
        error: () => {
          this.checkInLoading.set(false);
          this.notificationService.error(
            'Team konnte nicht eingecheckt werden.'
          );
        },
      });
  }

  handleSelectTeam(teamId: string): void {
    this.form.patchValue({ selectedTeamId: teamId });
  }
}