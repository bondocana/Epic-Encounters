import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "components/HomePage";
import LoginPage from "components/LoginPage";
import RegisterPage from "components/RegisterPage";
import ProfilePage from "components/ProfilePage";
import PostPage from "components/PostPage";
import NewPost from "components/NewPostPage";
import DefaultLayout from "components/DefaultLayout";
import GuestLayout from "components/GuestLayout";
import AdminDashboard from "components/AdminDashboard";
import { useSelector } from "react-redux";

function App() {
  const isAuth = Boolean(useSelector((state) => state.token));
  const isAdmin = Boolean(useSelector((state) => state.isAdmin));

  return (
    <>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400&display=swap');
      </style>

      <BrowserRouter>
        <Routes>
          <Route
            element={isAuth ? <Navigate to="/home" /> : <GuestLayout />}
            path="/"
          >
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route
            element={isAuth ? <DefaultLayout /> : <Navigate to="/" />}
            path="/"
          >
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/newPost" element={<NewPost />} />
            <Route path="/post/:postId" element={<PostPage />} />
            <Route
              path="/admin"
              element={isAdmin ? <AdminDashboard /> : <Navigate to="/home" />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
