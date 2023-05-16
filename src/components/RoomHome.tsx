import { Fragment, useState } from "react";
import { useFetch } from "usehooks-ts";
import { Room } from "../types/types";
import { Button } from "@mui/material";
import { Error, Loader } from "./Helpers";
import { RoomList } from "./Lists";

export function RoomHome({ setOpen }: { setOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
  let [internal, setInternal] = useState(0);

  const { data, error } = useFetch<Room[]>(
    `${process.env.REACT_APP_API_URL}/room`
  );

  let handleDelete = async (room: Room) => {
    try {
      let res = await fetch(
        `${process.env.REACT_APP_API_URL}/room/${room.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      if (res.status === 200) {
        console.info(res);
        data?.splice(
          data.findIndex((item) => item.id === room.id),
          1
        );
        setInternal(internal + 1);
      } else {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }

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

      <RoomList rooms={data} onDelete={handleDelete} />

    </Fragment>
  );
}
