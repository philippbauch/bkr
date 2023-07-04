import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { Station } from '@bkr/api-interface';

import { ButtonComponent, InputDirective } from '../../components';
import { DatePipe } from '../../pipes';
import {
  AuthService,
  NotificationService,
  StationService,
} from '../../services';

@Component({
  selector: 'bkr-auth',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    DatePipe,
    InputDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  @Input() returnUrl = '/';

  readonly exp = toSignal(this.authService.exp$, { initialValue: null });
  readonly sub = toSignal(this.authService.sub$, { initialValue: null });

  form = new FormGroup({
    code: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });
  loading = false;

  isAuthenticated = toSignal(this.authService.isAuthenticated$);
  isAdmin = toSignal(this.authService.isAdmin$);
  isStation = toSignal(this.authService.isStation$);

  station = computed(() => {
    return this.stations().find((station) => station.id === this.sub()) ?? null;
  });
  stations = toSignal(this.stationService.stations$, {
    initialValue: [] as Station[],
  });

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly stationService: StationService
  ) {}

  handleLogout(): void {
    this.authService.logout();
    this.notificationService.success('Du bist jetzt ausgeloggt.');

    this.router.navigateByUrl('/');
  }

  handleSubmit(event: Event): void {
    event.preventDefault();

    const { code } = this.form.value;

    if (this.form.invalid || !code) {
      return this.form.reset();
    }

    this.loading = true;

    this.authService
      .login(code)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading = false;
          this.form.reset();
          this.notificationService.success('Du bist jetzt eingeloggt.');

          this.router.navigateByUrl(this.returnUrl);
        },
        error: () => {
          this.loading = false;
          this.form.reset();
          this.notificationService.error('Das hat leider nicht geklappt.');
        },
      });
  }
}
