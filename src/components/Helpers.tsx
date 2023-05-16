import { Alert, Snackbar } from "@mui/material";
import { PuffLoader } from "react-spinners";

export function Error() {
  return (
    <Alert severity="error" sx={{ width: "100%" }}>
      An error occured, please try again later 😔
    </Alert>
  );
}

export function SnackError({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
      <Alert severity="error" sx={{ width: "100%" }}>
        An error occured, please try again later 😔
      </Alert>
    </Snackbar>
  );
}

export function Loader() {
  return (
    <div className="puffloader-container">
      <PuffLoader color="#80DBCE" />
    </div>
  );
}
