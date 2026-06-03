import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import CreateProject from "./pages/CreateProject";
import EditProfile from "./pages/EditProfile";
import Search from "./pages/Search";
import ProtectedRoute from "./components/ProtectedRoute";
import Explore from "./pages/Explore";

function App() {
  return (
    <Routes>

      {/* Public */}

      <Route
        path="/login"
        element={<Login />}
      />
      <Route
       path="/profile/edit"
       element={
      <ProtectedRoute>
      <EditProfile />
     </ProtectedRoute>
  }
    />
    <Route
  path="/search"
  element={
    <ProtectedRoute>
      <Search />
    </ProtectedRoute>
  }
/>
      <Route
        path="/register"
        element={<Register />}
      />

      {/* Default */}
      <Route
  path="/explore"
  element={
    <ProtectedRoute>
      <Explore />
    </ProtectedRoute>
  }
/>
      <Route
        path="/"
        element={
          <Navigate
            to="/feed"
          />
        }
      />

      {/* Protected */}

      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/:username"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/create" element={
    <ProtectedRoute>
      <CreateProject />
    </ProtectedRoute>
  }
/>

    </Routes>
  );
}

export default App;