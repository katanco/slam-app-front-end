import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RoundResponse } from "../types/types";
import { Loader } from "./Helpers";
import { ParticipationList } from "./Lists";
import useWebSocket from "react-use-websocket";
import { Score } from "./Score";
import { useIsFirstRender } from "usehooks-ts";

export function RoomJudge({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  let { roomId } = useParams();
  let [participationId, setParticipationId] = useState("");
  let [data, setData] = useState<RoundResponse>();

  const fetchData = async () => {
    try {
      setData(undefined)
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/room/${roomId}/current`
      );

      if (!response.ok) {
        setOpen(true);
      }

      const data = await response.json();
      setData(data);
    } catch (error) {
      setOpen(true);
    }
  };

  if (useIsFirstRender()) {
    fetchData();
  }

  const socketUrl = `${process.env.REACT_APP_API_URL?.replace(
    "http",
    "ws"
  )}/ws`;
  const onOpen = () => {
    console.log("opened");
  };
  const onMessage = (event: MessageEvent<any>) => {
    console.log(event);

    if (event.data === "round advanced") {
      fetchData();
    }
  };

  const { sendMessage } = useWebSocket(socketUrl, {
    onMessage: onMessage,
    onOpen: onOpen,
  });

  if (!data) return <Loader />;

  if (participationId) {
    return (
      <Score
        participationId={participationId}
        setOpen={setOpen}
        setParticipationId={setParticipationId}
      />
    );
  }
  return (
    <Fragment>
      <h2>Round {data.round.round_number}</h2>
      <ParticipationList
        participations={data.participations}
        onClick={(participation) =>
          setParticipationId(participation.participation.id)
        }
      />
    </Fragment>
  );
}
