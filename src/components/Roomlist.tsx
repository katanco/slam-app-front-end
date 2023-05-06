import { Fragment } from "react";
import { PuffLoader } from "react-spinners";
import { useFetch } from "usehooks-ts";
import { Room } from "../types/types";
import { Button } from "@mui/material";
import SmoothList from "react-smooth-list";
import { Error } from "./Error";
import { Loader } from "./Loader";

export default function Component() {
  const { data, error } = useFetch<Room[]>(
    `${process.env.PUBLIC_URL}/data/room`
  );

  if (error) return <Error />;

  if (!data) return <Loader />;

  return (
    <Fragment>
      <h1>Slam App</h1>
      <Button
        onClick={() => (window.location.href = `/room/new`)}
        variant="contained"
      >
        Create Room
      </Button>

      <SmoothList>
        {data.map((room) => {
          return (
            <div
              className="card"
              onClick={() => (window.location.href = `/room/${room.id}`)}
              key={room.id}
            >
              <h2>{room.name}</h2>
              <p>{new Date(room.created).toDateString()}</p>
            </div>
          );
        })}
      </SmoothList>
    </Fragment>
  );
}
