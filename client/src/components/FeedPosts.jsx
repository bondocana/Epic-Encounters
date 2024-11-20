import "./styles/feedPosts.css";
import { Search } from "@mui/icons-material";
import { IconButton, InputBase } from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect, useCallback, useState } from "react";
import { setPosts2 } from "../state/authSlice.js";
import locationIcon from "./styles/icons/location-icon.png";
// import Avatar from "@mui/material/Avatar";
// import AvatarGroup from "@mui/material/AvatarGroup";
import { useNavigate } from "react-router-dom";

const FeedPosts = () => {
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const posts2 = useSelector((state) => state.posts2);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Noua stare pentru textul de căutare
  const navigate = useNavigate();

  const truncatedString = (str) => {
    return str.length > 170 ? `${str.substring(0, 170)}...` : str;
  };

  // Funcție pentru a prelua toate categoriile
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3001/categories", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [token]);

  const getPosts = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/date`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      dispatch(setPosts2({ posts2: data }));
    } catch (error) {
      console.error("Error fetching timeline posts:", error);
    }
  }, [token, dispatch]);

  const getPostsByCategory = useCallback(
    async (categoryId) => {
      try {
        const response = await fetch(
          `http://localhost:3001/posts/category/${categoryId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        dispatch(setPosts2({ posts2: data }));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    },
    [token, dispatch]
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (selectedCategoryId) {
      getPostsByCategory(selectedCategoryId);
    }
  }, [selectedCategoryId, getPostsByCategory]);

  const handleCategorySelection = (categoryId) => {
    setSelectedCategoryId(categoryId);
    getPostsByCategory(categoryId);
  };

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  // Funcție pentru a actualiza starea de căutare
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filtrarea postărilor pe baza textului de căutare
  const filteredPosts = searchQuery
    ? posts2.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.locality.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts2;

  return (
    <>
      <div className="filter-menu">
        <div className="search-input">
          <InputBase
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
        <div onClick={getPosts} className="all-posts">
          All Posts
        </div>
        <div className="category-buttons">
          {categories.map((category) => (
            <div
              key={category._id}
              onClick={() => handleCategorySelection(category._id)}
              className="category-button"
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>

      <div className="feed-posts">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((item, index) => (
            <div
              className="post"
              key={index}
              onClick={() => {
                navigate(`/post/${item._id}`);
              }}
            >
              <div
                className="picture"
                style={{
                  backgroundImage: `url(http://localhost:3001/assets/${item.picturePath})`,
                }}
              ></div>
              <div className="info">
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "1000",
                    marginBottom: "15px",
                  }}
                >
                  {item.title}
                  <span
                    style={{
                      color: "#dedede",
                      fontSize: "13px",
                      fontWeight: "100",
                      marginLeft: "20px",
                    }}
                  >
                    <img
                      src={locationIcon}
                      alt=""
                      style={{ height: "12px", width: "12px" }}
                    ></img>
                    {" " + item.locality + ", " + item.county}
                  </span>
                </span>
                <span style={{ color: "white" }}>
                  {truncatedString(item.description)}
                </span>
              </div>
              <div className="date">
                <div>
                  {new Date(item.date.split("/").reverse().join("-")).getDate()}
                </div>
                <div>
                  {new Date(item.date.split("/").reverse().join("-"))
                    .toLocaleString("default", { month: "short" })
                    .toUpperCase()}
                </div>
                <div>
                  {new Date(
                    item.date.split("/").reverse().join("-")
                  ).getFullYear()}
                </div>
              </div>
              {/* <AvatarGroup
              renderSurplus={(surplus) => (
                <span>+{Math.floor(surplus / 1000)}k</span>
              )}
              total={item.attending.length}
            >
              {item.attending.map((person) => (
                <Avatar
                  key={person.id}
                  alt={person.name}
                  src={`/static/images/avatar/${person.id}.jpg`}
                />
              ))}
            </AvatarGroup> */}
            </div>
          ))
        ) : (
          <div className="message">
            No posts were found that match the search criteria.
          </div>
        )}
      </div>
    </>
  );
};

export default FeedPosts;
