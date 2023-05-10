import "./App.css";
import { RoomHome } from "./components/RoomHome";
import { RoomDetail } from "./components/RoomDetail";
import { RoomNew } from "./components/RoomNew";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ScoreNew } from "./components/ScoreNew";
import { RoundDetail } from "./components/RoundDetail";

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
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<RoomHome />} />
              <Route path="new" element={<RoomNew />} />
              <Route path="room/:roomId" element={<RoomDetail />} />
              <Route
                path="room/:roomId/round/:roundId"
                element={<RoundDetail />}
              />
              <Route path="score/:participationId" element={<ScoreNew />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
