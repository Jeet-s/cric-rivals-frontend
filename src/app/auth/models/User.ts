export interface User {
  _id?: string;
  username: string;
  email: string;
  image: string;
  googleId: string;
  selectedTeam?: UserTeam;
}

export interface UserTeam {
  userId: string;
  teamId: string;
  squad: PlayerOrder[];
  _id?: string;
}

export interface PlayerOrder {
  playerId: string;
  order?: number;
}
