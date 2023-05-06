import { Alert } from "@mui/material";

export function Error() {
  return (
    <Alert severity="error" sx={{ width: "100%" }}>
      An error occured, please try again later 😔
    </Alert>
  );
}
