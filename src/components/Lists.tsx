import SmoothList from "react-smooth-list";
import { Participant, Room, participationResponse } from "../types/types";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

export function ParticipantList({
  participants,
  onDelete,
}: {
  participants: Participant[];
  onDelete: (participant: Participant) => {};
}) {
  return (
    <SmoothList>
      {participants.map((participant, index) => (
        <div className="card flex" key={participant.id}>
          <div className="flex-grow">
            <span style={{ fontWeight: "bold" }}>{`${index + 1}: ${
              participant.name
            }`}</span>
            {participant.pronouns && (
              <span
                style={{ fontStyle: "italic" }}
              >{` (${participant.pronouns})`}</span>
            )}
          </div>
          <div>
            <IconButton
              onClick={(event) => {
                event.stopPropagation();
                onDelete(participant);
              }}
              color="error"
            >
              <Delete />
            </IconButton>
          </div>
        </div>
      ))}
    </SmoothList>
  );
}

export function RoomList({
  rooms,
  onDelete,
}: {
  rooms: Room[];
  onDelete: (room: Room) => {};
}) {
  return (
    <SmoothList>
      {rooms.map((room) => {
        return (
          <div
            className="card flex"
            onClick={() => (window.location.href = `/live/${room.id}`)}
            key={room.id}
          >
            <div className="flex-grow">
              <h2>{room.name}</h2>
              <p>{new Date(room.created).toDateString()}</p>
            </div>
            <div>
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(room);
                }}
                color="error"
              >
                <Delete />
              </IconButton>
            </div>
          </div>
        );
      })}
    </SmoothList>
  );
}

export function ParticipationList({
  participations,
}: {
  participations: participationResponse[];
}) {
  return (
    <SmoothList>
      {participations
        .sort(
          (item1, item2) => item1.participation.performance_order - item2.participation.performance_order
        )
        .map((item, index) => (
          <div
            className="card flex"
            key={item.participation.id}
            onClick={() => (window.location.href = `/score/${item.participation.id}`)}
          >
            <div className="flex-grow" ><span style={{fontWeight: "bold"}}>{`${item.participant.name}`}</span></div>
            <div>{item.participation.score}</div>
          </div>
        ))}
    </SmoothList>
  );
}