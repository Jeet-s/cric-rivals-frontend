import { Injectable } from '@angular/core';
import * as socketClient from 'socket.io-client';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: socketClient.Socket;

  roomId: string;
  opponentUserId: string;

  constructor(private authService: AuthService) {}

  connect() {
    this.socket = socketClient.io(
      environment.baseUrl + `?userId=${this.authService.user._id}`
    );
    // console.log(this.socket.id)
    this.socket.on('connect', (e) => {
      console.table(this.socket.id);
    });
    return this.socket;
  }
}
