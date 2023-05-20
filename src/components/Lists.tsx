import SmoothList from "react-smooth-list";
import {
  Participant,
  Room,
  Score,
  participationResponse,
} from "../types/types";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useFetch } from "usehooks-ts";

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
            onClick={() => (window.location.href = `/score/${room.id}`)}
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
  onClick,
  submitterId,
}: {
  participations: participationResponse[];
  onClick?: (participation: participationResponse) => void;
  submitterId?: string;
}) {
  return (
    <>
      {participations.map((item) => (
        <div
          className="card flex"
          key={item.participation.id}
          onClick={() => onClick && onClick(item)}
        >
          <div className="flex-grow">
            <span
              style={{ fontWeight: "bold" }}
            >{`${item.participant.name}`}</span>
          </div>
          <ParticipationScoreList
            participationId={item.participation.id}
            submitterId={submitterId}
          />
          {!submitterId && (
            <>
              {item.participation.deduction && (
                <div className="text-deduction">
                  (-{item.participation.deduction})
                </div>
              )}
              {item?.participation?.score && (
                <div className="text-score">
                  {item.participation.score -
                    (item?.participation?.deduction || 0)}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </>
  );
}

function ParticipationScoreList({
  participationId,
  submitterId,
}: {
  participationId: string;
  submitterId?: string;
}) {
  let { data, error } = useFetch<Array<Score>>(
    `${
      process.env.REACT_APP_API_URL
    }/score?participation_id=${participationId}${
      submitterId ? `&submitter_id=${submitterId}` : ``
    }`
  );

  if (error) {
    return <></>;
  }
  if (!data) {
    return <div>...</div>;
  }
  return (
    <div>
      {data
        .sort((a, b) => a.value - b.value)
        .map((score) => score.value)
        .join(", ")}
    </div>
  );
}
