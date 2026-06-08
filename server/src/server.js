
const app =require("./app" );
  

const http =
  require(
    "http"
  );

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

        origin: [
          process.env.CLIENT_URL,
          "http://localhost:5173",
          "http://localhost:5174",
          "http://127.0.0.1:5173",
          "http://127.0.0.1:5174",
        ].filter(Boolean),

        credentials:
          true,

      },

    }

  );

/*
Socket Connection

User opens app

↓

socket connects

*/

io.on(

  "connection",

  (

    socket

  ) => {

    console.log(
      "connected:",
      socket.id
    );

    /*
    Listen

    User sends message
    */

    socket.on(

      "join-conversation",

      (

        conversationId

      ) => {

        if (
          conversationId
        ) {
          socket.join(
            conversationId
          );
        }

      }

    );

    socket.on(

      "leave-conversation",

      (

        conversationId

      ) => {

        if (
          conversationId
        ) {
          socket.leave(
            conversationId
          );
        }

      }

    );

    socket.on(

      "chat-message",

      (

        message

      ) => {

        console.log(
          "received:",
          message
        );

        if (
          message?.conversationId
        ) {
          socket
            .to(message.conversationId)
            .emit(
              "chat-message",
              message
            );
        }

      }

    );

    socket.on(

      "disconnect",

      () => {

        console.log(
          "user left"
        );

      }

    );

  }

);

server.listen(

  5000,

  () => {

    console.log(
      "Server running"
    );

  }

);
