import { LoadingButton } from "@mui/lab";
import { FormEvent, Fragment, useState } from "react";
import Picker from "react-mobile-picker";

const optionGroups = {
  first: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  second: [".0", ".1", ".2", ".3", ".4", ".5", ".6", ".7", ".8", ".9"],
};

export function Score({
  participationId,
  setOpen,
  setParticipationId,
  submitterId,
}: {
  participationId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setParticipationId: React.Dispatch<React.SetStateAction<string>>;
  submitterId: string;
}) {
  let [valueGroups, setValueGroups] = useState({
    first: "5",
    second: ".5",
  });
  let [loading, setLoading] = useState(false);

  let handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      let value = Number(valueGroups.first + valueGroups.second);
      if (value > 10) value = 10;
      let res = await fetch(`${process.env.REACT_APP_API_URL}/score`, {
        method: "POST",
        body: JSON.stringify({
          value: value,
          participation_id: participationId,
          submitter_id: submitterId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      if (res.status === 201) {
        setParticipationId("");
      } else {
        setOpen(true);
      }
    } catch (err) {
      setLoading(false);
      setOpen(true);
    }
  };

  const handleChange = (name: string, value: string) => {
    setValueGroups({
      ...valueGroups,
      [name]: value,
    });
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit} className="flex-column">
        <div className="flex-grow flex-column flex-justify-center">
          <Picker
            optionGroups={optionGroups}
            valueGroups={valueGroups}
            onChange={handleChange}
            wheel="natural"
            itemHeight={72}
          />
        </div>
        <div>
          <LoadingButton loading={loading} type="submit" variant="outlined">
            Submit
          </LoadingButton>
        </div>
      </form>
    </Fragment>
  );
}
