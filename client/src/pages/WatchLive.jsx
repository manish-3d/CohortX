import {
  useEffect,
  useRef,
} from "react";

import {
  io,
} from "socket.io-client";

import {
  useParams,
} from "react-router-dom";

import AppLayout
from "../layout/AppLayout";

const socket =
  io(
    "http://localhost:5000"
  );

export default function WatchLive() {

  const {
    room,
  } =
    useParams();

  const videoRef =
    useRef(
      null
    );

  const peer =
    useRef(
      null
    );

  useEffect(

    ()=>{

      connect();

      return ()=>{

        socket.off(
          "offer"
        );

        socket.off(
          "candidate"
        );

      };

    },

    []

  );

  async function connect() {

    socket.emit(

      "join-stream",

      room

    );

    console.log(
      "viewer joined"
    );

    peer.current =

      new RTCPeerConnection();

    peer.current.ontrack = (

      event

    )=>{

      console.log(
        "stream received"
      );

      videoRef
      .current
      .srcObject =
      event.streams[0];

    };

    peer.current
    .onicecandidate=(

      event

    )=>{

      if(
        event.candidate
      ){

        socket.emit(

          "candidate",

          {

            room,

            candidate:
            event.candidate,

          }

        );

      }

    };

    socket.on(

      "offer",

      async(
        data
      )=>{

        console.log(
          "offer received"
        );

        await peer
        .current
        .setRemoteDescription(
          data.offer
        );

        const answer =

          await peer
          .current
          .createAnswer();

        await peer
        .current
        .setLocalDescription(
          answer
        );

        socket.emit(

          "answer",

          {

            room,

            answer,

          }

        );

        console.log(
          "answer sent"
        );

      }

    );

    socket.on(

      "candidate",

      async(
        data
      )=>{

        if(
          data.candidate
        ){

          await peer
          .current
          .addIceCandidate(
            data.candidate
          );

        }

      }

    );

  }

  return (

    <AppLayout>

      <div

        style={{

          maxWidth:
            "900px",

          margin:
            "40px auto",

        }}

      >

        <h1>

          Watching Live

        </h1>

        <video

          ref={
            videoRef
          }

          autoPlay

          playsInline

          controls

          style={{

            width:
              "100%",

            borderRadius:
              "18px",

            background:
              "black",

          }}

        />

      </div>

    </AppLayout>

  );

}