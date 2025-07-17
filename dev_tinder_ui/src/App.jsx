import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "../component/Body.jsx";
import Feed from "../component/Feed.jsx";
import { Outlet } from "react-router-dom";
import Login from "../component/Login.jsx";
import Profile from "../component/Profile.jsx";
import { Provider } from "react-redux";
import appStore from "./utils/store.js";
import EditProfile from "../component/EditProfile.jsx";
import RequestsReceived from "../component/RequestsRecieved.jsx";
import Connections from "../component/Connections.jsx";
import SignUp from "../component/SignUp.jsx";
import SocketManager from "../component/SocketManager.jsx";
function App() {
  return (
    <>
      <Provider store={appStore}>
        <SocketManager />
        <BrowserRouter basename="/">
          <Routes>
            {/* Public routes (no Body wrapper) */}
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />

            {/* Protected routes (wrapped in <Body /> which includes Navbar and auth check) */}
            <Route path="/" element={<Body />}>
              <Route index element={<Feed />} />
              <Route path="profile" element={<Profile />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="Requests-Recieved" element={<RequestsReceived />} />
              <Route path="connections" element={<Connections />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
