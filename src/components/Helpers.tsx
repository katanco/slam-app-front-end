import { Alert } from "@mui/material";
import { PuffLoader } from "react-spinners";

export function Error() {
  return (
    <Alert severity="error" sx={{ width: "100%" }}>
      An error occured, please try again later 😔
    </Alert>
  );
}

export function Loader() {
  return (
    <div className="puffloader-container">
      <PuffLoader color="#80DBCE" />
    </div>
  );
}
