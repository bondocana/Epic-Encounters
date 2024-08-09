import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const token = useSelector((state) => state.token);
  const userId2 = useSelector((state) => state.user._id);
  const { userId } = useParams();
  const [isOwner, setIsOwner] = useState();

  useEffect(() => {
    if (userId && userId2) {
      setIsOwner(userId === userId2);
    }
  }, [userId, userId2]);


  return <div>ProfilePage</div>;
};

export default ProfilePage;
