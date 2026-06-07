import {
  useRef,
  useState,
} from "react";

import {
  io,
} from "socket.io-client";

import AppLayout
from "../layout/AppLayout";

const socket =
  io(
    "http://localhost:5000"
  );

export default function Live() {

  const videoRef =
    useRef(
      null
    );

  const peer =
    useRef(
      null
    );

  const [
    viewerCount,
    setViewerCount,
  ] =
    useState(
      1
    );

  const [
    title,
    setTitle,
  ] =
    useState(
      "My Live Stream"
    );

  async function startLive() {

    try {

      setViewerCount(
        1
      );

      const room =
        "room-1";

      socket.emit(
        "join-stream",
        room
      );

      console.log(
        "joined room"
      );

      const stream =

        await navigator
        .mediaDevices
        .getUserMedia({

          video:
            true,

          audio:
            true,

        });

      videoRef
        .current
        .srcObject =
        stream;

      peer.current =
        new RTCPeerConnection();

      stream
        .getTracks()
        .forEach(

          track =>

            peer
              .current
              .addTrack(
                track,
                stream
              )

        );

      peer.current
        .onicecandidate = (

          event

        ) => {

          if (
            event.candidate
          ) {

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

        "answer",

        async (
          data
        ) => {

          console.log(
            "answer received"
          );

          await peer
            .current
            .setRemoteDescription(
              data.answer
            );

        }

      );

      socket.on(

        "candidate",

        async (
          data
        ) => {

          if (
            data.candidate
          ) {

            await peer
              .current
              .addIceCandidate(
                data.candidate
              );

          }

        }

      );

      console.log(
        "creating offer"
      );

      const offer =

        await peer
          .current
          .createOffer();

      await peer
        .current
        .setLocalDescription(
          offer
        );

      socket.emit(

        "offer",

        {

          room,

          offer,

        }

      );

      console.log(
        "offer sent"
      );

    }

    catch (
      err
    ) {

      console.log(
        err
      );

      alert(
        "Failed to start live"
      );

    }

  }

  return (

    <AppLayout>

      <div

        style={{

          maxWidth:
            "1100px",

          margin:
            "30px auto",

          padding:
            "24px",

        }}

      >

        {/* HEADER */}

        <div

          style={{

            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            marginBottom:
              "24px",

          }}

        >

          <div>

            <div

              style={{

                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  "12px",

              }}

            >

              <div

                style={{

                  width:
                    "12px",

                  height:
                    "12px",

                  background:
                    "#ef4444",

                  borderRadius:
                    "50%",

                }}

              />

              <h1

                style={{

                  margin:
                    0,

                  fontSize:
                    "34px",

                }}

              >

                LIVE

              </h1>

            </div>

            <input

              value={
                title
              }

              onChange={
                (
                  e
                ) =>

                  setTitle(
                    e
                    .target
                    .value
                  )
              }

              placeholder=
                "Stream title"

              style={{

                marginTop:
                  "16px",

                maxWidth:
                  "350px",

              }}

            />

            <p

              style={{

                marginTop:
                  "10px",

                color:
                  "#666",

              }}

            >

              👁️
              {" "}
              {
                viewerCount
              }
              {" "}
              viewers

            </p>

          </div>

          <div

            style={{

              background:
                "#fee2e2",

              color:
                "#dc2626",

              padding:
                "10px 18px",

              borderRadius:
                "999px",

              fontWeight:
                "700",

            }}

          >

            🔴 LIVE

          </div>

        </div>

        {/* VIDEO */}

        <div

          style={{

            background:
              "#000",

            borderRadius:
              "24px",

            overflow:
              "hidden",

            position:
              "relative",

          }}

        >

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

              display:
                "block",

              maxHeight:
                "720px",

              objectFit:
                "cover",

            }}

          />

          <div

            style={{

              position:
                "absolute",

              top:
                "20px",

              left:
                "20px",

              background:
                "rgba(0,0,0,.6)",

              color:
                "white",

              padding:
                "10px 18px",

              borderRadius:
                "999px",

            }}

          >

            ● LIVE

          </div>

        </div>

        {/* CONTROLS */}

        <div

          style={{

            display:
              "flex",

            gap:
              "14px",

            marginTop:
              "24px",

          }}

        >

          <button

            onClick={
              startLive
            }

            style={{

              background:
                "#ef4444",

              padding:
                "14px 28px",

              borderRadius:
                "14px",

            }}

          >

            Start Stream

          </button>

          <button>

            Share Stream

          </button>

        </div>

      </div>

    </AppLayout>

  );

}