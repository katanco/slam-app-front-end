import { FormEvent, Fragment, useState } from "react";
import Picker from "react-mobile-picker";

const optionGroups = {
  first: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  second: [".0", ".1", ".2", ".3", ".4", ".5", ".6", ".7", ".8", ".9"],
};

export function ScoreNew() {
  let [valueGroups, setValueGroups] = useState({
    first: "5",
    second: "0",
  });

  const availableValues = [
    { id: "first", label: ".", min: 1, max: 10 },
    { id: "second", label: "", min: 0, max: 9 },
  ];

  let [open, setOpen] = useState(false);
  let [loading, setLoading] = useState(false);

  let handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      // post score
      setLoading(false);
      if (true) {
        setValueGroups({
          first: "5",
          second: "0",
        });
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

  return (
    <Fragment>
      <Picker
        optionGroups={optionGroups}
        valueGroups={valueGroups}
        onChange={handleChange}
        wheel="natural"
        itemHeight={72}
      />
    </Fragment>
  );
}
