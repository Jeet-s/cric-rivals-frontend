import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBarRef, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss'],
})
export class StartGameComponent implements OnInit {
  roomId = new FormControl(null, [
    Validators.required,
    Validators.min(1000),
    Validators.max(9999),
  ]);

  waitingSnackbar: MatSnackBarRef<any>;

  constructor(
    private socketService: SocketService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.socketService.connect();
    this.socketService.socket.on('error', (error) => {
      this.roomId.enable();
      this._snackBar.open(error, null, {
        duration: 1000,
      });
    });

    this.socketService.socket.on('start-game', (data: CreateGameModel) => {
      this.socketService.roomId = data.roomId;
      console.log('Current User', this.authService.user._id);
      console.log('Start Data', data);
      this.socketService.opponentUserId =
        data.userId != this.authService.user._id
          ? data.userId
          : data.opponentId;
      this.waitingSnackbar?.dismiss();
      this.router.navigate(['/home/playground']);
    });
  }

  createGame() {
    this.socketService.socket.emit('create-game', {
      roomId: this.roomId.value.toString(),
      userId: this.authService.user._id,
    });
    this.roomId.disable();
    this.waitingSnackbar = this._snackBar.open('Waiting for Opponrnt...');
  }

  joinGame() {
    this.socketService.socket.emit('join-game', {
      roomId: this.roomId.value.toString(),
      opponentId: this.authService.user._id,
    });
    this.router.navigate['/home/playground'];
  }
}

interface CreateGameModel {
  roomId: string;
  userId: string;
  opponentId: string;
}
