import { io, Socket } from "socket.io-client";

// const SOCKET_URL = "http://192.168.242.175:8000/events";

const SOCKET_URL = "https://ab6b-2409-40e4-2059-cf20-11e1-dd89-5e36-fff4.ngrok-free.app/events"

class WSSocket {
  public socket!: Socket;

  constructor() {
    this.socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });
  }

  initalizeSocket: () => void = async () => {
    try {
      this.socket.on("connect", () => {
        console.log("Connected to server", this.socket.id);
      });

      this.socket.on("error", (error) => {
        console.error(error);
      });
    } catch (error) {
      console.error(error);
    }
  };

  createRoom: (roomName: string) => void = (roomName) => {
    this.socket.emit("createRoom", {
      roomName: roomName,
    });
  };

  listenForRoomUpdate(
    callback: (rooms: { roomId: string; roomName: string }) => void
  ): void {
    this.socket.on("rooms", (rooms) => {
      callback(rooms);
    });
  }

  joinRoom: (room: { roomId: string; user: string }) => void = (room) => {
    this.socket.emit("joinRoom", {
      roomId: room.roomId,
      userName: room.user,
    });
  };

  joinRoomMessage: (callback: (welcomeMsg: string) => void) => void = (
    callback
  ) => {
    this.socket.on("joinedRoom", (message) => {
      callback(message);
    });
  };

  newPeopleInRoom: (callback: (message: string) => void) => void = (
    callback
  ) => {
    this.socket.on("userJoined", (message) => {
      callback(message);
    });
  };

  peopleInRoom = (
    callback: (people: { roomId: string; user: string }[]) => void
  ): void => {
    this.socket.on("totalUsers", (people) => {
      console.log(people, "people");
      callback(people);
    });
  };

  newMessage = (people: {
    roomId: string;
    userName: string;
    message: string;
  }) => {
    this.socket.emit("sendMessage", {
      roomId: people.roomId,
      message: people.message,
      userName: people.userName,
    });
  };

  listenForNewMessage = (
    callback: (message: {
      roomId: string;
      userId: string;
      message: string;
    }) => void
  ) => {
    this.socket.on("newMessage", (message) => {
      console.log(message, "msg");
      callback(message);
    });
  };
}

const socketService = new WSSocket();
export default socketService;
