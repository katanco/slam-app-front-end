import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useTimer } from "../hooks/useTimer";

const formatTime = (timer: number) => {
  const getSeconds = `0${timer % 60}`.slice(-2);
  const getMinutes = `0${Math.floor(timer / 60) % 60}`.slice(-2);

  return `${getMinutes} : ${getSeconds}`;
};

export const Timer = ({
  participationId,
  setParticipationId,
  setOpen,
  participationNotes
}: {
  participationId: string;
  setParticipationId: React.Dispatch<React.SetStateAction<string>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  participationNotes?: string
}) => {
  const {
    timer,
    isActive,
    isPaused,
    handleStart,
    handlePause,
    handleResume,
    handleReset,
  } = useTimer(0);

  const [notes, setNotes] = useState(participationNotes);

  let handleSubmit = async () => {
    try {
      let res = await fetch(
        `${process.env.REACT_APP_API_URL}/participation/${participationId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            notes: notes,
            length: timer,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 200) {
        setParticipationId("");
      } else {
        setOpen(true);
      }
    } catch (err) {
      setOpen(true);
    }
  };

  return (
    <form className="stopwatch-card" onSubmit={handleSubmit}>
      <Stack spacing={1}>
        <h1>{formatTime(timer)}</h1>
        <div className="buttons">
          {!isActive && !isPaused ? (
            <Button onClick={handleStart}>Start</Button>
          ) : isPaused ? (
            <Button onClick={handlePause}>Pause</Button>
          ) : (
            <Button onClick={handleResume}>Resume</Button>
          )}
          <Button onClick={handleReset} disabled={!isActive}>
            Reset
          </Button>
        </div>
        <div>
          <Button style={{ width: "184px" }} type="submit">
            Submit
          </Button>
        </div>
        <TextField
          multiline
          id="performance-notes"
          label="Notes"
          onChange={(event) => setNotes(event.target.value)}
          value={notes}
          variant="filled"
          style={{width: "184px"}}
        />
      </Stack>
    </form>
  );
};