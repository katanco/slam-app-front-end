import "./App.css";
import Roomlist from "./components/Roomlist";
import { RoomDetail } from "./components/RoomDetail";
import NewRoom from "./components/NewRoom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

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
              <Route index element={<Roomlist />} />
              <Route path="room">
                <Route path="new" element={<NewRoom />} />
                <Route path=":roomId" element={<RoomDetail />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
