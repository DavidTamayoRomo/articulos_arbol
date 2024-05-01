import { TestBed } from '@angular/core/testing';

import { AuthKeycloakGuard } from './auth-keycloak.guard';

describe('AuthKeycloakGuard', () => {
  let guard: AuthKeycloakGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthKeycloakGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
