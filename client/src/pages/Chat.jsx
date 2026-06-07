import {
  useEffect,
  useState,
} from "react";

import {
  io,
} from "socket.io-client";

import api
from "../services/api";

const socket =
  io(
    "http://localhost:5000"
  );

export default function Chat() {

  const [
    messages,
    setMessages,
  ] =
    useState([]);

  const [
    text,
    setText,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  useEffect(

    ()=>{

      loadMessages();

    },

    []

  );

  useEffect(

    ()=>{

      socket.on(

        "chat-message",

        (

          message

        )=>{

          setMessages(

            (

              prev

            )=>

            [

              ...prev,

              message,

            ]

          );

        }

      );

      return ()=>{

        socket.off(
          "chat-message"
        );

      };

    },

    []

  );

  async function loadMessages() {

    try {

      const res =

        await api.get(
          "/messages"
        );

      setMessages(
        res.data
      );

    }

    finally {

      setLoading(
        false
      );

    }

  }

  async function sendMessage() {

    if(
      !text.trim()
    ){
      return;
    }

    try {

      const res =

        await api.post(

          "/messages",

          {

            text,

          }

        );

        socket.emit(

          "chat-message",

          res.data

        );

        setText(
          ""
        );

    }

    catch{

      alert(
        "Send failed"
      );

    }

  }

  if(
    loading
  ){

    return(
      <h2>
        Loading...
      </h2>
    );

  }

  return (

<div

style={{

maxWidth:
"800px",

margin:
"40px auto",

}}

>

<h1>

Chat

</h1>

<div

style={{

border:
"1px solid #eee",

borderRadius:
"16px",

padding:
"20px",

minHeight:
"450px",

}}

>

{

messages.map(

(

m

)=>(

<div

key={
m.id
}

style={{

padding:
"12px",

marginBottom:
"12px",

background:
"#f3f4f6",

borderRadius:
"10px",

}}

>

{
m.text
}

</div>

)

)

}

</div>

<div

style={{

display:
"flex",

gap:
"10px",

marginTop:
"16px",

}}

>

<input

value={
text
}

onChange={

(

e

)=>

setText(

e.target.value

)

}

/>

<button

onClick={
sendMessage
}

>

Send

</button>

</div>

</div>

);

}