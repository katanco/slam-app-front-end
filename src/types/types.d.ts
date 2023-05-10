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
  room_id: string;
}

export interface Round {
  id: string;
  round_number: number;
  room_id: string;
}

export interface Participation {
  id: string;
  performance_notes?: string;
  performance_length_in_seconds?: number;
  deduction?: number;
  score?: number;
  performance_order: number;
  round_id: string;
  participant_id: string;
}

export interface RoomResponse {
  room: Room;
  participants: Participant[];
  rounds: Round[];
}

export interface RoundResponse {
  round: Round;
  participations: Participation[];
}