import "./styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import React, { useRef, useState } from "react";
import TextArea from "./Textarea";



export default function Comment(props) {

  const commentRef = useRef(null)
  const [replyState, setReplyState] = useState(false);
  const [score, setScore] = useState({ up: 0, down: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState(null)

  function handleReplyState() {
    setId(props.id);
    setReplyState(!replyState);
  }

  function handleDown(e) {
    setScore((prev) => {

      return { down: score.down + 1, up: prev.up }
    })

  }

  function handleUp(e) {
    setScore((prev) => {

      return { up: score.up + 1, down: prev.down }
    })
  }

  function handleDelete() {

    if (id !== null) {

      setId(null)
      setIsEditing(false)


    }

    props.deleteReply(id ? id : commentRef.current.id);





  }



  function handleEdit() {

    commentRef.current.className = 'hide';
    setIsEditing(true)

    setReplyState(!replyState);

  }



  return (
    <>
      <div id={props.id}
        ref={commentRef}
        className={"comment-parent-container"}
        style={props.data.replies === undefined ? { marginLeft: "40px" } : null}
      >
        <img
          src={props.data.user.image.png.substr(2)}
          alt="user"
          style={
            props.data.replies === undefined
              ? { width: "25px", height: "25px" }
              : null
          }
        />
        <div className="comment-outer-container">
          <div className="comment-container">
            <b className="username">{props.data.user.username}</b>
            {props.data.replyingTo === undefined ? null : <><span >  <FontAwesomeIcon icon={faReply} flip="horizontal" size="2xs" /></span>
              <b className="username">{props.data.replyingTo}</b></>}


            <div className="comment">{props.data.content}</div>
            <FontAwesomeIcon className='icon' onClick={handleUp} icon={faAngleUp} size="2xs" />
            <FontAwesomeIcon className='icon' onClick={handleDown} icon={faAngleUp} rotation={180} style={{ marginBottom: '.3px', marginLeft: '13px' }} size="2xs" /><br />
            <span className="score">+{score.up}</span><span className="score" style={{ marginLeft: '27px' }}>-{score.down}</span>
          </div>
          {props.currentUser.username === props.data.user.username ? <><button onClick={handleEdit} >Edit</button><button onClick={handleDelete}>Delete</button></> : null}
          <button onClick={() => handleReplyState()}>Reply</button>
        </div>
      </div>
      {replyState ? <TextArea addReply={props.addReply} deleteReply={handleDelete} handleReplyState={handleReplyState} replyingTo={props.data.user.username} replyId={props.id} currentUser={props.currentUser} content={props.data.content} isEditing={isEditing} /> : null}
      <div style={{marginLeft:'25px'}}>
        {props.data.replies?.map((val) => {
          return <Comment id={val.id} data={val} addReply={props.addReply} deleteReply={props.deleteReply} currentUser={props.currentUser} />
        })}

      </div>
    </>
  );
}
