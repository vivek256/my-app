import "./styles.css";
import { useState } from "react";

let noOfComments = 4;



export default function TextArea(props) {

  const [text, setText] = useState({ id: ++noOfComments, user: props.currentUser });

  function autoResize(e) {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";

    const newText = { ...text };
    newText["content"] = e.target.value;
    //  newText["createdAt"]=
    //  newText["score"]=
    newText["replyingTo"] = props.replyingTo;

    setText(newText);
  }



  function addComment(e) {
    if (e.keyCode == 13 && !e.shiftKey) {
      props.handleReplyState();


      if (props.isEditing) {

        props.deleteReply()

        props.addReply([text, props.id])

      } else {

        props.addReply([text, props.replyId])
      }


    }


  }

  return (
    <>
      <div className="reply new-reply">
        <img
          src={props.currentUser.image.png.substr(2)}
          alt="user"
        />
        <div>
          <textarea onInput={(e) => autoResize(e)} onKeyUp={addComment} autofocus>{

            props.isEditing ? props.content : null

          }</textarea>
          <button className='cancelReply' onClick={() => props.handleReplyState()}> Cancel</button>
          <br />
        </div>
      </div>

    </>
  );
}
