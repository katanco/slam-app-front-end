import { Dispatch, SetStateAction, useState } from "react";
import { useParams } from "react-router-dom";
import useRefreshableFetch from "../hooks/useReloadableFetch";
import { RoundResponse, participationResponse } from "../types/types";
import { Error, Loader } from "./Helpers";
import { ParticipationList } from "./Lists";
import useWebSocket from "react-use-websocket";
import { LoadingButton } from "@mui/lab";
import QRCode from "react-qr-code";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import { Fab } from "@mui/material";
import { ChevronLeft, QrCode } from "@mui/icons-material";
import { Congratulations } from "./Congratulations";

export function RoomScorekeep({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  let { roomId } = useParams();
  let [closed, setClosed] = useState(false);
  let [loading, setLoading] = useState(false);
  let [advancing, setAdvancing] = useState<participationResponse[]>([]);
  let [nonAdvancing, setNonAdvancing] = useState<participationResponse[]>([]);
  let [displayQR, setDisplayQR] = useState(false);

  let { data, error, refresh } = useRefreshableFetch<RoundResponse>(
    `${process.env.REACT_APP_API_URL}/room/${roomId}/current`
  );

  const socketUrl = `${process.env.REACT_APP_API_URL?.replace(
    "http",
    "ws"
  )}/ws`;
  const onOpen = () => {
    console.log("opened");
  };
  const onMessage = (event: MessageEvent<any>) => {
    console.log(event);

    if (event.data === "round advanced" || "score submitted") {
      refresh();
    }
  };

  const { sendMessage } = useWebSocket(socketUrl, {
    onMessage: onMessage,
    onOpen: onOpen,
  });

  if (error) return <Error />;

  if (!data) return <Loader />;

  let handleClose = () => {
    if (data?.participations) {
      let sorted = data.participations.sort(
        (a, b) => (b.participation.score || 0) - (a.participation.score || 0)
      );
      const middleIndex = Math.ceil(sorted.length / 2);
      setAdvancing(sorted.slice(0, middleIndex));
      setNonAdvancing(sorted.slice(middleIndex, sorted.length));
      setClosed(true);
    }
  };

  let handleAdvance = async () => {
    setLoading(true);
    try {
      const advancingParticipants = advancing.map((item) => item.participant);
      let res = await fetch(
        `${process.env.REACT_APP_API_URL}/room/${roomId}/advance`,
        {
          method: "POST",
          body: JSON.stringify(advancingParticipants),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      if (res.status === 201) {
        sendMessage("round advanced");
        window.location.reload();
      } else {
        setOpen(true);
      }
    } catch (err) {
      setLoading(false);
      setOpen(true);
    }
  };

  let handleDragEnd = (result: DropResult) => {
    // ugh do this better
    if (
      result.destination?.droppableId === "nonAdvancing" &&
      result.source.droppableId === "advancing"
    ) {
      const participationResponse = advancing.find(
        (item) => item.participation.id === result.draggableId
      );
      if (participationResponse) {
        setAdvancing(
          advancing.filter(
            (item) => item.participation.id !== result.draggableId
          )
        );
        nonAdvancing.push(participationResponse);
        setNonAdvancing(nonAdvancing);
      }
    } else if (
      result.destination?.droppableId === "advancing" &&
      result.source.droppableId === "nonAdvancing"
    ) {
      const participationResponse = nonAdvancing.find(
        (item) => item.participation.id === result.draggableId
      );
      if (participationResponse) {
        setNonAdvancing(
          nonAdvancing.filter(
            (item) => item.participation.id !== result.draggableId
          )
        );
        advancing.push(participationResponse);
        setAdvancing(advancing);
      }
    } else if (
      result.destination?.droppableId === "advancing" &&
      result.source.droppableId === "advancing"
    ) {
      const advancingArray = Array.from(advancing);
      const [removed] = advancingArray.splice(result.source.index, 1);
      advancingArray.splice(result.destination.index, 0, removed);
      setAdvancing(advancingArray);
    } else if (
      result.destination?.droppableId === "nonAdvancing" &&
      result.source.droppableId === "nonAdvancing"
    ) {
      const advancingArray = Array.from(nonAdvancing);
      const [removed] = advancingArray.splice(result.source.index, 1);
      advancingArray.splice(result.destination.index, 0, removed);
      setNonAdvancing(advancingArray);
    }
  };

  if (displayQR) {
    return (
      <>
        <Fab
          className="fab"
          color="primary"
          onClick={() => setDisplayQR(false)}
        >
          <ChevronLeft />
        </Fab>
        <div className="qrcode-container flex-grow flex-column flex-justify-center">
          <QRCode
            value={`${window.location.origin}/score/${roomId}`}
            bgColor="#141414"
            fgColor="#80DBCE"
          />
        </div>
      </>
    );
  } else if (data.participations.length === 1) {
    return (
      <Congratulations name={data.participations[0].participant.name}/>
    );
  } else if (!closed) {
    return (
      <>
        <h2>Round {data.round.round_number}</h2>

        <Fab className="fab" color="primary" onClick={() => setDisplayQR(true)}>
          <QrCode />
        </Fab>
        <div>
          <LoadingButton
            loading={loading}
            variant="outlined"
            onClick={handleClose}
          >
            Close Round
          </LoadingButton>
        </div>
        <ParticipationList
          participations={data.participations}
        />
      </>
    );
  }
  return (
    <>
      <h2>Round {data.round.round_number} Closed</h2>
      <div>
        <LoadingButton
          loading={loading}
          variant="outlined"
          onClick={handleAdvance}
        >
          {advancing.length > 1 ? "Start Next Round" : "Finish!"}
        </LoadingButton>
      </div>
      <h3>drag to rearrange as needed</h3>
      <h3>Advancing</h3>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="advancing">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {advancing.map((item, index) => (
                <Draggable
                  key={item.participation.id}
                  draggableId={item.participation.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="card"
                    >
                      <div className="flex-grow">{item.participant.name}</div>
                      <div>{item.participation.score}</div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <h3>Non-Advancing</h3>
        <Droppable droppableId="nonAdvancing">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {nonAdvancing.map((item, index) => (
                <Draggable
                  key={item.participation.id}
                  draggableId={item.participation.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="card"
                    >
                      <div className="flex-grow">{item.participant.name}</div>
                      <div>{item.participation.score}</div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
