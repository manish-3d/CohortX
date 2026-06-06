
const app =
  require("./app");

const http =
  require("http");

const {
  Server,
} =
require(
  "socket.io"
);

const server =
  http.createServer(
    app
  );

const io =
  new Server(
    server,
    {
      cors: {
        origin:
          "http://localhost:5173",
      },
    }
  );

io.on(
  "connection",
  (
    socket
  ) => {

    console.log(
      "user connected"
    );

    socket.on(

      "join-stream",

      (
        room
      ) => {

        socket.join(
          room
        );

      }

    );

    socket.on(

      "disconnect",

      ()=>{

        console.log(
          "user left"
        );

      }

    );

  }
);

server.listen(

  5000,

  ()=>{

    console.log(
      "Live server running"
    );

  }

);
