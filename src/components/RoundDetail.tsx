import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "usehooks-ts";
import { Round, RoundResponse, participationResponse } from "../types/types";
import { Error, Loader } from "./Helpers";
import { ParticipationList } from "./Lists";
import { Button } from "@mui/material";

export function RoundDetail() {
  let { roomId } = useParams();
  let [closed, setClosed] = useState(false);
  let [open, setOpen] = useState(false);
  let [loading, setLoading] = useState(false);
  let [advancing, setAdvancing] = useState<participationResponse[]>([]);
  let [nonAdvancing, setNonAdvancing] = useState<participationResponse[]>([]);

  const { data, error } = useFetch<RoundResponse>(
    `${process.env.REACT_APP_API_URL}/room/${roomId}/current`
  );

  if (error) return <Error />;

  if (!data) return <Loader />;

  let handleClose = () => {
    if (data.participations) {
      let sorted = data.participations.sort(
        (a, b) => (b.participation.score || 0) - (a.participation.score || 0)
      );
      const middleIndex = Math.ceil(sorted.length / 2);
      setAdvancing(sorted.slice(0, middleIndex));
      setNonAdvancing(sorted.slice(-middleIndex));
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
      let resJson: Round = await res.json();
      setLoading(false);
      if (res.status === 201) {
        window.location.reload();
      } else {
        setOpen(true);
      }
    } catch (err) {
      setLoading(false);
      setOpen(true);
    }
  };
  if (!closed) {
    return (
      <Fragment>
        <h2>Round {data.round.round_number}</h2>
        <div>
          <Button variant="outlined" onClick={handleClose}>
            Close Round
          </Button>
        </div>
        <ParticipationList participations={data.participations} />
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <h2>Round {data.round.round_number} Closed</h2>
        <div>
          <Button variant="outlined" onClick={handleAdvance}>
            Start Next Round
          </Button>
        </div>
        <h3>Advancing</h3>
        <ParticipationList participations={advancing} />
        <h3>Non-Advancing</h3>
        <ParticipationList participations={nonAdvancing} />
      </Fragment>
    );
  }
}
