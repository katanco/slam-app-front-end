import { Fragment } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "usehooks-ts";
import { RoundResponse } from "../types/types";
import { Error, Loader } from "./Helpers";
import { ParticipationList } from "./Lists";
import { Button } from "@mui/material";

export function RoundDetail() {
  let { roundId } = useParams();
  let { roomId } = useParams();

  const { data, error } = useFetch<RoundResponse>(
    `${process.env.REACT_APP_API_URL}/round/${roundId}`
  );

  if (error) return <Error />;

  if (!data) return <Loader />;

  return (
    <Fragment>
      <h2>Round {data.round.round_number}</h2>
      <Button variant="outlined">Advance</Button>
      <ParticipationList participations={data.participations} />
    </Fragment>
  );
}
