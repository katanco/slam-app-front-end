import SmoothList from "react-smooth-list";
import { Participant, Participation, Room } from "../types/types";
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
            onClick={() => (window.location.href = `/room/${room.id}`)}
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
  participations: Participation[];
}) {
  return (
    <SmoothList>
      {participations
        .sort(
          (item1, item2) => item1.performance_order - item2.performance_order
        )
        .map((item, index) => (
          <div
            className="card flex"
            key={item.id}
            onClick={() => (window.location.href = `/score/${item.id}`)}
          >
            <div className="flex-grow"></div>
            <div>{`${item.performance_order}): ${item.score}`}</div>
          </div>
        ))}
    </SmoothList>
  );
}