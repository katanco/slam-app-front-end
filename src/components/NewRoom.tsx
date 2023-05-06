import { FormEvent, Fragment, useRef, useState } from "react";
import { Room } from "../types/types";
import { TextField, Stack, Snackbar, Alert } from "@mui/material";
import { Add } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

export default function Component() {
  let [name, setName] = useState("");
  let [open, setOpen] = useState(false);
  let [loading, setLoading] = useState(false);
  const form = useRef<HTMLFormElement | null>(null);

  let handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      let res = await fetch(`${process.env.PUBLIC_URL}/data/room`, {
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
        window.location.href = `${process.env.PUBLIC_URL}/room/${resJson.id}`;
      } else {
        setOpen(true);
      }
    } catch (err) {
      setLoading(false);
      setOpen(true);
    }
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Fragment>
      <h1>New Room</h1>
      <form ref={form} onSubmit={handleSubmit}>
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
        <Alert severity="error" sx={{ width: "100%" }}>
          An error occured, please try again later 😔
        </Alert>
      </Snackbar>
    </Fragment>
  );
}
