import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { io, Socket } from "socket.io-client";

// const SOCKET_URL = "http://localhost:7000/events";
const SOCKET_URL = `${process.env.NEXT_PUBLIC_SOCKET_URL}/events`;
class WSSocket {
  public socket!: Socket;

  constructor() {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      secure: true,
      rejectUnauthorized: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
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

  listenAvailableRooms = (
    callback: (rooms: { roomId: string; roomName: string }[]) => void
  ) => {
    this.socket.emit("fetchRooms");
    this.socket.on("getRooms", (rooms) => {
      callback(rooms);
    });
  };

  deleteRoom = (roomId: string) => {
    this.socket.emit("deleteRoom", {
      roomId: roomId,
    });
  };

  redirectAfterRoomDelete = (router: AppRouterInstance) => {
    this.socket.on("roomDeleted", () => {
      console.log(`Room has been deleted`);
      router.push("/");
    });

    return () => {
      this.socket.off("roomDeleted");
    };
  };

  leaveRoom = (roomId: string, userName: string) => {
    this.socket.emit("leaveRoom", {
      roomId: roomId,
      userName: userName,
    });
  };
}

const socketService = new WSSocket();
export default socketService;
