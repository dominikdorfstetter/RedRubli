import {
  TestBed
} from '@angular/core/testing';
import {
  UserService
} from './user.service';
import {
  AngularFireAuthModule
} from '@angular/fire/auth';
import {
  AngularFirestoreModule
} from '@angular/fire/firestore';
import {
  SnackbarService
} from './snackbar.service';
import {
  LoggerService
} from './logger.service';
import {
  MatSnackBarModule,
  MatCardModule
} from '@angular/material';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SnackbarService, LoggerService],
      imports: [AngularFireAuthModule, AngularFirestoreModule, MatSnackBarModule]
    })
  });

  it('should be created', () => {
    const service: UserService = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });
});
