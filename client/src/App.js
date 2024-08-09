import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "components/HomePage";
import LoginPage from "components/LoginPage";
import RegisterPage from "components/RegisterPage";
import ProfilePage from "components/ProfilePage";
import PostPage from "components/PostPage";
import NewPost from "components/NewPostPage";
import DefaultLayout from "components/DefaultLayout";
import { useSelector } from "react-redux";

function App() {
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<DefaultLayout />}>
          <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/" />} />
          <Route path="/profile/:userId" element={isAuth ? <ProfilePage /> : <Navigate to="/" />} />
          <Route path="/newPost" element={isAuth ? <NewPost /> : <Navigate to="/" />} />
          <Route path="/post/:postId" element={isAuth ? <PostPage /> : <Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
