import { LoadingButton } from "@mui/lab";
import { Snackbar } from "@mui/material";
import { FormEvent, Fragment, useState } from "react";
import Picker from "react-mobile-picker";
import { useParams } from "react-router-dom";
import { Error } from "./Helpers";

const optionGroups = {
  first: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  second: [".0", ".1", ".2", ".3", ".4", ".5", ".6", ".7", ".8", ".9"],
};

export function ScoreNew() {
  let [valueGroups, setValueGroups] = useState({
    first: "5",
    second: ".0",
  });

  let { participationId } = useParams();
  
  let [submitterId, setSubmitterId] = useState("");
  let [open, setOpen] = useState(false);
  let [loading, setLoading] = useState(false);

  let handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const value = Number(valueGroups.first + valueGroups.second);
      let res = await fetch(`${process.env.REACT_APP_API_URL}/score`, {
        method: "POST",
        body: JSON.stringify({
          value: value,
          participation_id: participationId,
          submitter_id: submitterId
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      if (res.status === 201) {
        window.history.back();
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

  const handleChange = (name: string, value: string) => {
    setValueGroups({
      ...valueGroups,
      [name]: value,
    });
  };

  if (!submitterId) {
    const storedId = localStorage.getItem("submitterId");
    if (storedId)
    setSubmitterId(storedId)
    else {
      const newId = Math.random().toString(36).slice(2, 7);
      localStorage.setItem("submitterId", newId);
    }
  }

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <Picker
          optionGroups={optionGroups}
          valueGroups={valueGroups}
          onChange={handleChange}
          wheel="natural"
          itemHeight={72}
        />
        <LoadingButton loading={loading} type="submit" variant="outlined">
          Submit
        </LoadingButton>
      </form>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Error />
      </Snackbar>
    </Fragment>
  );
}
