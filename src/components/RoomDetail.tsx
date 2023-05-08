import { FormEvent, Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "usehooks-ts";
import { Participant, RoomResponse } from "../types/types";
import {
  TextField,
  Autocomplete,
  Stack,
  Button,
  Snackbar,
} from "@mui/material";
import { ParticipantList } from "./Lists";
import { Error, Loader } from "./Helpers";
import { LoadingButton } from "@mui/lab";
import { Add } from "@mui/icons-material";

const pronounOptions = [
  "he/him",
  "she/her",
  "they/them",
  "it/its",
  "xe/xir",
  "ze/zir",
  "fae/faer",
];

export function RoomDetail() {
  let { roomId } = useParams();
  let [name, setName] = useState("");
  let [pronouns, setPronouns] = useState("");
  let [internal, setInternal] = useState(0);

  let [open, setOpen] = useState(false);
  let [loading, setLoading] = useState(false);

  let handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      let res = await fetch(`${window.location.origin}/data/participant`, {
        method: "POST",
        body: JSON.stringify({
          name: name,
          pronouns: pronouns,
          room_id: roomId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      let resJson: Participant = await res.json();
      setLoading(false);
      if (res.status === 201) {
        setName("");
        setPronouns("");
        data?.participants.push(resJson);
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

  let shuffleArray = () => {
    if (data?.participants) {
      let shuffled = data.participants
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
      data.participants = shuffled;
      setInternal(internal + 1);
    }
  };

  const { data, error } = useFetch<RoomResponse>(
    `${window.location.origin}/data/room/${roomId}`
  );

  if (error) return <Error />;

  if (!data) return <Loader />;

  return (
    <Fragment>
      <h1>{data.room.name}</h1>
      <p>{new Date(data.room.created).toDateString()}</p>
      {data.participants.length < 8 && (
        <form onSubmit={handleSubmit}>
          <Stack spacing={1}>
            <TextField
              id="add-participant-name"
              label="Name"
              variant="standard"
              onChange={(event) => setName(event.target.value)}
              value={name}
              required
            />
            <Autocomplete
              options={pronounOptions}
              freeSolo
              disableClearable
              value={pronouns}
              onChange={(event, value) => {
                if (value) setPronouns(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="add-participant-pronouns"
                  label="Pronouns"
                  variant="standard"
                  onChange={(event) => setPronouns(event.target.value)}
                />
              )}
            />
            <LoadingButton
              loading={loading}
              type="submit"
              variant="outlined"
              endIcon={<Add />}
            >
              Add
            </LoadingButton>
          </Stack>
        </form>
      )}
      {data.participants.length >= 8 && (
        <Fragment>
          <p>Room Full</p>
          <Button onClick={shuffleArray} variant="outlined">
            Shuffle List
          </Button>
          <Button onClick={() => alert("coming soon :)")}>Start Event</Button>
        </Fragment>
      )}
      <ParticipantList participants={data.participants} />
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Error />
      </Snackbar>
    </Fragment>
  );
}
