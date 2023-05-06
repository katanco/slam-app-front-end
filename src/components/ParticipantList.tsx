import SmoothList from "react-smooth-list";
import { Participant } from "../types/types";

export function ParticipantList({
  participants,
}: {
  participants: Participant[];
}) {
  return (
    <SmoothList>
      {participants.map((participant, index) => (
        <div
          className="card"
          key={participant.id}
          style={{ display: "flex", alignContent: "space-between" }}
        >
          <div style={{ flexGrow: 1, fontWeight: "bold" }}>
            {`${index + 1}: ${participant.name}`}
          </div>
          <div style={{ fontStyle: "italic" }}>{participant.pronouns}</div>
        </div>
      ))}
    </SmoothList>
  );
}
