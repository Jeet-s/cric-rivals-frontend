import { Player } from 'src/app/home/models/BaseDataClass';

export interface Team {
  _id: string;
  name: string;
  logo: string;
  squad: Player[];
}
