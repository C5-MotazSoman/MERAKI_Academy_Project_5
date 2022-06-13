import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./messages.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  setAllMessages,
  setMessagesWith,
} from "../redux/reducers/message/index";
import { setModalBox } from "../redux/reducers/modalBox/index";
//for real-time connection:
import { io } from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
const socket = io.connect(ENDPOINT);

const Messages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //user states:
  //to use user token for axios calls
  const { token, userId } = useSelector((state) => {
    return {
      token: state.user.token,
      userId: state.user.userId,
    };
  });
  //message states to be used:
  const { allMessages } = useSelector((state) => {
    return {
      allMessages: state.message.allMessages,
    };
  });

  //modalBox states:
  const {
    modalId,
    modalType,
    modalMessage,
    modalDetails,
    modalShow,
  } = useSelector((state) => {
    return {
      modalId: state.modalBox.modalId,
      modalType: state.modalBox.modalType,
      modalMessage: state.modalBox.modalMessage,
      modalDetails: state.modalBox.modalDetails,
      modalShow: state.modalBox.modalShow,
    };
  });
  // a function that sets allMessages in redux store:
  const getAllMessages = () => {
    dispatch(setMessagesWith([]));
    let getMessagesUrl = `http://localhost:5000/message/get/user/room`;
    axios
      .get(getMessagesUrl, { headers: { authorization: token } })
      .then((result) => {
        if (!result.data.result.length) {
          // dispatch(
          //   setModalBox({
          //     modalId: "",
          //     modalType: "alert",
          //     modalMessage: "Inbox",
          //     modalDetails: "Your inbox is empty",
          //     modalShow: true,
          //   })
          // );
        } else {
          dispatch(setAllMessages(result.data.result));
          console.log({ all_conversations: result.data.result });
          // dispatch(
          //   setModalBox({
          //     modalId: "",
          //     modalType: "ok",
          //     modalMessage: "Inbox",
          //     modalDetails: `you have ${allMessages.length} conversations!`,
          //     modalShow: true,
          //   })
          // );
        }
      })
      .catch((error) => {});
  };

  //a function to join a room between two users
  const joinRoom = (room, withUser) => {
    navigate(`/message/${room}/${withUser}`);
    socket.emit("JOIN_ROOM", room);
  };
  //a function to remove the room between two users:
  const deleteRoom = (roomId) => {
    let removeRoomUrl = `http://localhost:5000/message/room/${roomId}`;
    axios
      .put(removeRoomUrl, {}, { headers: { authorization: token } })
      .then((result) => {
        getAllMessages();
      })
      .catch((error) => {
        console.log({ removeRoome_error: error });
      });
  };
  useEffect(() => {
    getAllMessages();
  }, []);
  return (
    <div className="messagesComponent">
      {allMessages.length &&
        allMessages.map((room, ind) => {
          return (
            <>
              <div className="messageCardsContainer">
                {room.receivedBy == userId ? (
                  <div className="messageCard">
                    <div className="senderInfo">
                      <img
                        src={room.profileImg}
                        onClick={() => navigate(`/user/${room.sentBy}`)}
                      />
                      <h3>{room.firstName + " " + room.lastName}</h3>
                    </div>
                    <div className="inboxButtons">
                      <button
                        className=""
                        onClick={() => {
                          room.sentBy != userId
                            ? navigate(`/message/${room.roomId}/${room.sentBy}`)
                            : navigate(
                                `/message/${room.roomId}/${room.receivedBy}`
                              );
                        }}
                      >
                        Show
                      </button>
                      <button
                        className=""
                        onClick={() => {
                          deleteRoom(room.roomId);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="messageCard">
                    <div className="senderInfo">
                      <img
                        src={room.u2Img}
                        onClick={() => navigate(`/user/${room.receivedBy}`)}
                      />
                      <h3>{room.u2f + " " + room.u2l}</h3>
                    </div>
                    <div className="inboxButtons">
                      <button
                        className=""
                        onClick={() => {
                          room.sentBy != userId
                            ? joinRoom(room.roomId, room.sentBy)
                            : joinRoom(room.roomId, room.receivedBy);
                        }}
                      >
                        Show
                      </button>
                      <button
                        className=""
                        onClick={() => {
                          deleteRoom(room.roomId);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* to render sent messages */}
            </>
          );
        })}
    </div>
  );
};

export default Messages;
