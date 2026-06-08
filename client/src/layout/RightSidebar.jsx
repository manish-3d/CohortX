import RightChatPanel
from "../components/RightChatPanel";

export default function RightSidebar(){

return(

<div

style={{

padding:
"24px",

borderLeft:
"1px solid #e5e7eb",

background:
"#ffffff",

position:
"sticky",

top:
0,

height:
"100vh",

overflow:
"auto",

}}

>

<RightChatPanel />

<h3>

Live Now

</h3>

<p>

Future Feature

</p>

<br/>

<h3>

Trending Projects

</h3>

<p>

Coming Soon

</p>

</div>

);

}
