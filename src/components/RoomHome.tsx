import { Fragment } from "react";
import { useFetch } from "usehooks-ts";
import { Room } from "../types/types";
import { Button } from "@mui/material";
import { Error, Loader } from "./Helpers";
import { RoomList } from "./Lists";

export function RoomHome() {
  const { data, error } = useFetch<Room[]>(
    `${window.location.origin}/data/room`
  );

  if (error) return <Error />;

  if (!data) return <Loader />;

  return (
    <Fragment>
      <h1>slam.gay</h1>
      <Button
        onClick={() => (window.location.href = `/new`)}
        variant="contained"
      >
        Create Event
      </Button>

      <RoomList rooms={data} />
    </Fragment>
  );
}
