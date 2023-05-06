import { FormEvent, Fragment, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "usehooks-ts";
import { Participant, RoomResponse } from "../types/types";
import { TextField, Autocomplete, Stack, Button } from "@mui/material";
import { ParticipantList } from "./ParticipantList";
import { Error } from "./Error";
import { Loader } from "./Loader";

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
  const form = useRef<HTMLFormElement | null>(null);

  let handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      let res = await fetch(`${process.env.PUBLIC_URL}/data/participant`, {
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
      if (res.status === 201) {
        setName("");
        setPronouns("");
        data?.participants.push(resJson);
      } else {
        alert("An error occured");
      }
    } catch (err) {
      console.log(err);
    }
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
    `${process.env.PUBLIC_URL}/data/room/${roomId}`
  );

  if (error) return <Error />;

  if (!data) return <Loader />;

  return (
    <Fragment>
      <h1>{data.room.name}</h1>
      <p>{new Date(data.room.created).toDateString()}</p>
      {data.participants.length < 8 && (
        <form ref={form} onSubmit={handleSubmit}>
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
            <Button type="submit" variant="outlined">
              Add
            </Button>
          </Stack>
        </form>
      )}
      {data.participants.length >= 8 && (
        <Fragment>
          <p>Room Full</p>
          <Button onClick={shuffleArray} variant="outlined">
            Shuffle List
          </Button>{" "}
        </Fragment>
      )}
      <ParticipantList participants={data.participants} />
    </Fragment>
  );
}
