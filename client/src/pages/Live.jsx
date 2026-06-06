
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  io,
} from "socket.io-client";

import Navbar
from "../components/Navbar";

const socket =
  io(
    "http://localhost:5000"
  );

export default function Live() {

  const videoRef =
    useRef(
      null
    );

  const [
    stream,
    setStream,
  ] =
    useState(
      null
    );

  async function startLive() {

    try {

      const media =
        await navigator
          .mediaDevices
          .getUserMedia({

            video:
              true,

            audio:
              true,

          });

      setStream(
        media
      );

      if (
        videoRef.current
      ) {

        videoRef
          .current
          .srcObject =
          media;

      }

      socket.emit(
        "join-stream",
        "cohortx-live"
      );

    }

    catch (
      err
    ) {

      console.log(
        err
      );

      alert(
        "Camera blocked"
      );

    }

  }

  useEffect(

    ()=>{

      return ()=>{

        stream
        ?.getTracks()
        .forEach(

          track=>

          track.stop()

        );

      };

    },

    [
      stream
    ]

  );

  return (

    <>

      <Navbar />

      <div

        style={{

          maxWidth:
            "900px",

          margin:
            "40px auto",

        }}

      >

        <h1>

          Go Live

        </h1>

        <video

          ref={
            videoRef
          }

          autoPlay

          muted

          playsInline

          style={{

            width:
              "100%",

            borderRadius:
              "20px",

            background:
              "black",

          }}

        />

        <br />

        <br />

        <button

          onClick={
            startLive
          }

        >

          Start Stream

        </button>

      </div>

    </>

  );

}