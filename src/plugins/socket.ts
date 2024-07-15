import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_HOST, {
    path: '/io',
    withCredentials: true,
    extraHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    reconnection: true,
    reconnectionAttempts: 5,
    autoConnect: false,
});

socket.on("connect", () => {
    console.log("connected")
});

socket.on("disconnect", () => {
    console.log("disconnected")
});

socket.on("test", (...args) => {
    console.log([args])
});

export default socket;