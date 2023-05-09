import { FormEvent, Fragment, useState } from "react";
import { Room } from "../types/types";
import { TextField, Stack, Snackbar } from "@mui/material";
import { Add } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Error } from "./Helpers";

export function RoomNew() {
  let [name, setName] = useState("");
  let [open, setOpen] = useState(false);
  let [loading, setLoading] = useState(false);

  let handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      let res = await fetch(`${process.env.REACT_APP_API_URL}/room`, {
        method: "POST",
        body: JSON.stringify({
          name: name,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      let resJson: Room = await res.json();
      setLoading(false);
      if (res.status === 201) {
        window.location.href = `/${resJson.id}`;
      } else {
        setOpen(true);
      }
    } catch (err) {
      setLoading(false);
      setOpen(true);
    }
  };

  const handleClose = (event: any, reason: string) => {
    if (reason !== "clickaway") setOpen(false);
  };

  return (
    <Fragment>
      <h1>New Event</h1>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            id="add-participant-name"
            label="Room Name"
            variant="standard"
            onChange={(event) => setName(event.target.value)}
            value={name}
            required
          />
          <LoadingButton
            loading={loading}
            type="submit"
            variant="outlined"
            endIcon={<Add />}
          >
            Create Room
          </LoadingButton>
        </Stack>
      </form>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Error />
      </Snackbar>
    </Fragment>
  );
}
