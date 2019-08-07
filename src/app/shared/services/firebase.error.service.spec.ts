import { TestBed } from '@angular/core/testing';

import { FirebaseErrorService } from './firebase.error.service';

describe('Firebase.ErrorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebaseErrorService = TestBed.get(FirebaseErrorService);
    expect(service).toBeTruthy();
  });
});
