import "./App.css";
import { RoomHome } from "./components/RoomHome";
import { RoomDetail } from "./components/RoomDetail";
import { RoomNew } from "./components/RoomNew";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ScoreNew } from "./components/ScoreNew";
import { Score } from "@mui/icons-material";

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
              <Route path="score" element={<ScoreNew />} />
              <Route path=":roomId" element={<RoomDetail />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
