import "./styles/feedPosts.css";
import { Search } from "@mui/icons-material";
import { IconButton, InputBase } from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect, useCallback, useState } from "react";
import { setPosts2 } from "../state/authSlice.js";
// import Avatar from "@mui/material/Avatar";
// import AvatarGroup from "@mui/material/AvatarGroup";

const FeedPosts = () => {
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const posts2 = useSelector((state) => state.posts2);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Noua stare pentru textul de căutare

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
          post.description.toLowerCase().includes(searchQuery.toLowerCase())
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
          <IconButton>
            <Search />
          </IconButton>
        </div>
        <button onClick={getPosts}>Afișează toate postările</button>
        <div className="category-buttons">
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => handleCategorySelection(category._id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="feed-posts">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((item) => (
            <div className="post" key={item.id}>
              <div
                className="picture"
                style={{

                  backgroundImage: `url(http://localhost:3001/assets/${item.picturePath})`,
                }}
              ></div>
              <div className="info">
                {item.title} {item.date} {item.description}
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
            Nu s-au găsit postări care să corespundă criteriilor de căutare.
          </div>
        )}
      </div>
    </>
  );
};

export default FeedPosts;
