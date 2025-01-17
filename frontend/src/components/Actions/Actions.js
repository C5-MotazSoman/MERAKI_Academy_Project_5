import React, { useEffect, useState } from "react";
import "./actions.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  addToFriendsList,
  removeFromFriendsList,
  setCurrentUserFriends,
  setVisitedUserFriends,
} from "../redux/reducers/user/index";
import { setModalBox } from "../redux/reducers/modalBox/index";

const Actions = ({ id }) => {
  const [isReported, setIsReported] = useState("Report");
  const [isFriend, setIsFriend] = useState();
  //three buttons are going to be rendered with the following actions:
  //currentUser can addFriend(if not in  currentUserFriends) or removeFriend(if in currentUserFriends)/reportUser/sendMessage
  const dispatch = useDispatch();
  //user states:
  const { token, userId, currentUserFriends } = useSelector((state) => {
    return {
      token: state.user.token,
      userId: state.user.userId,
      currentUserFriends: state.user.currentUserFriends,
      setVisitedUserFriends: state.user.setVisitedUserFriends,
    };
  });
  //modalBox states:
  const { user, type, message, details, show } = useSelector((state) => {
    return {
      user: state.modalBox.user,
      type: state.modalBox.type,
      message: state.modalBox.message,
      details: state.modalBox.details,
      show: state.modalBox.show,
    };
  });

  //a function that reports a user by id/ this function will be handeled inside ModalBox component:
  const reportUserById = () => {
    dispatch(
      setModalBox({
        user: id,
        type: "report",
        message: "Report User",
        details: "",
        show: true,
      })
    );
  };

  //a function that sends a message to user by id:
  const sendMessageToUser = () => {
    dispatch(
      setModalBox({
        user: id,
        type: "sendMessage",
        message: "",
        details: "",
        show: true,
      })
    );
  };
  //a function that adds a user as a friend if not in currentUserFriends
  const addFriend = () => {
    let addFriendUrl = `http://localhost:5000/user/${id}`;
    axios
      .post(addFriendUrl, {}, { headers: { authorization: token } })
      .then((result) => {
        if (result.data.success) {
          //!toast notification to be added "added successfully"
          dispatch(addToFriendsList(result.data.result[0])); //! to be deleted if not used
          setIsFriend(true);
          getAllFriendsOfCurrentUser();
          getAllFriendsOfVisitedUser();
        }
      })
      .catch((error) => {
        console.log({ fromAddFriend_error: error }); //! to be deleted and replaced by toast notification
      });
  };

  //a function that removes a user from currentUserFriends if
  const removeFriend = () => {
    let removeUserUrl = `http://localhost:5000/user/${id}`;
    axios
      .delete(removeUserUrl, { headers: { authorization: token } })
      .then((result) => {
        if (result.data.success) {
          //!toast notification to be added "added successfully"
          dispatch(removeFromFriendsList(result.data.result[0].id)); //! to be deleted if not used
          setIsFriend(false);
          getAllFriendsOfCurrentUser();
          getAllFriendsOfVisitedUser();
        }
      })
      .catch((error) => {
        console.log({ fromRemoveFriend_error: error }); //! to be deleted and replaced by toast notification
      });
  };

  //check if friends:
  const checkIfFriend = () => {
    let checked = currentUserFriends.filter((friend) => {
      return friend.id == id;
    });
    return checked.length ? setIsFriend(true) : setIsFriend(false);
  };

  //to re-render visitedUser Friends:
  const getAllFriendsOfVisitedUser = async () => {
    let getFriendsUrl = ` http://localhost:5000/user/friends/${id}`;
    axios
      .get(getFriendsUrl, { headers: { authorization: token } })
      .then((result) => {
        if (result.data.success) {
          dispatch(setVisitedUserFriends(result.data.result));
        }
      })
      .catch((error) => {
        console.log({ fromGetAllFriends_error: error }); //! to be deleted and replaced by toast notification
      });
  };

  //to re-render the currentUser Friends (for Add/Remove)
  const getAllFriendsOfCurrentUser = async () => {
    let getFriendsUrl = ` http://localhost:5000/user/friends/${userId}`;
    axios
      .get(getFriendsUrl, { headers: { authorization: token } })
      .then((result) => {
        if (result.data.success) {
          dispatch(setCurrentUserFriends(result.data.result));
        }
      })
      .catch((error) => {
        console.log({ fromGetAllFriends_error: error }); //! to be deleted and replaced by toast notification
      });
  };
  useEffect(() => {
    getAllFriendsOfVisitedUser();
    getAllFriendsOfCurrentUser();
    checkIfFriend();
  }, [isFriend, id]);

  console.log(currentUserFriends);
  return (
    <div className="actionsComponent">
      actionsComponent
      <div className="actionButtons">
        {isFriend ? (
          <button onClick={() => removeFriend()}>Remove</button>
        ) : (
          <button onClick={() => addFriend()}>Add</button>
        )}
        <button onClick={() => sendMessageToUser()}>Send Message</button>
        {/* function to be added later in the backend to remove report from user */}
        <button onClick={() => reportUserById()}>{isReported}</button>
      </div>
    </div>
  );
};

export default Actions;
