import "./styles/App.scss";
import { RoomHome } from "./components/RoomHome";
import { RoomDetail } from "./components/RoomDetail";
import { RoomNew } from "./components/RoomNew";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { RoomScorekeep } from "./components/RoomScorekeep";
import { useState } from "react";
import { SnackError } from "./components/Helpers";
import { RoomJudge } from "./components/RoomJudge";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#80DBCE",
    },
    secondary: {
      main: "#B8B4CA",
    },
  },
});

function App() {
  let [open, setOpen] = useState(false);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<RoomHome setOpen={setOpen} />} />
              <Route path="new" element={<RoomNew setOpen={setOpen}/>} />
              <Route path="new/:roomId" element={<RoomDetail setOpen={setOpen}/>} />
              <Route path="scorekeep/:roomId" element={<RoomScorekeep setOpen={setOpen}/>} />
              <Route path="score/:roomId" element={<RoomJudge setOpen={setOpen}/>} />
            </Route>
          </Routes>
        </BrowserRouter>
        <SnackError open={open} setOpen={setOpen} />
      </div>
    </ThemeProvider>
  );
}

export default App;
