import { Room } from "./types.d";
export interface Room {
  id: string;
  name: string;
  created: string;
}

export interface Participant {
  id: string;
  name: string;
  pronouns?: string;
  roomId: string;
}

export interface RoomResponse {
  room: Room;
  participants: Participant[];
}
