
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Feed from "./pages/Feed";
import Profile from "./pages/Profile";

import Explore from "./pages/Explore";
import Search from "./pages/Search";

import CreateProject from "./pages/CreateProject";
import CreateStory from "./pages/CreateStory";

import ProjectDetail from "./pages/ProjectDetail";

import EditProfile from "./pages/EditProfile";

import Live from "./pages/Live";
import WatchLive from "./pages/WatchLive";

import Chat from "./pages/Chat";

import ProtectedRoute
from "./components/ProtectedRoute";

function App() {

  return (

    <Routes>

      {/* PUBLIC */}

      <Route
        path="/login"
        element={
          <Login />
        }
      />

      <Route
        path="/register"
        element={
          <Register />
        }
      />

      {/* DEFAULT */}

      <Route
        path="/"
        element={
          <Navigate
            to="/feed"
          />
        }
      />

      {/* PROTECTED */}

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

      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <Explore />
          </ProtectedRoute>
        }
      />
      <Route
  path="/projects/edit/:id"
  element={
    <EditProject />
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
        path="/create"
        element={
          <ProtectedRoute>
            <CreateProject />
          </ProtectedRoute>
        }
      />

      <Route
        path="/story/create"
        element={
          <ProtectedRoute>
            <CreateStory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <ProjectDetail />
          </ProtectedRoute>
        }
      />
      < Route  
      path="/project/edit/:id" 
      elemetnt = {
        <ProtectedRoute>
         <EditProject/>
        </ProtectedRoute>
      }
        />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/:userId"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />

      <Route
        path="/live"
        element={
          <ProtectedRoute>
            <Live />
          </ProtectedRoute>
        }
      />
      <Route
      path = "/project/edit/:id"
      element = {
       <ProtectedRoutes>
        <Delete/>
      </ProtectedRoutes>
      }
      />

      <Route
        path="/watch/:room"
        element={
          <ProtectedRoute>
            <WatchLive />
          </ProtectedRoute>
        }
      />

    </Routes>

  );

}

export default App;