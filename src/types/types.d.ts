enum RoomStatus {
  Pending,
  Sacrificing,
  Ongoing,
  Concluded,
}

export interface Room {
  id: string;
  name: string;
  created: string;
  round_id_current?: string;
  participation_id_current?: string;
  room_status?: RoomStatus;
  round_id_sacrificial?: string;
}

export interface Participant {
  id: string;
  name: string;
  pronouns?: string;
  room_id: string;
  is_sacrifice: boolean;
}

export interface Round {
  id: string;
  round_number: number;
  room_id: string;
}

export interface Score {
  id: string;
  value: number;
  submitter_id?: string;
  participation_id: string;
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

export interface Feedback {
  id: string;
  message: string;
  created: { secs_since_epoch: number; nanos_since_epoch: number };
}

export interface RoomResponse {
  room: Room;
  participants: Participant[];
  rounds: Round[];
}

export interface RoundResponse {
  round: Round;
  participations: participationResponse[];
}

export interface participationResponse {
  participation: Participation;
  participant: Participant;
}
