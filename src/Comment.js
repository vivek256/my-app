import Action from "./Action";
import data from "./data";
import React,{ useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply, faAngleUp } from '@fortawesome/free-solid-svg-icons'

export default function Comment({
  content,
  replies,
  username,
  currentUser,
  handleEditNode,
  handleDeleteNode,
  handleInsertNode,
  id,
  parentData,
  image,
  replyingTo,
  cmntScore
}) {
  const [editMode, setEditMode] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [score, setScore] = useState({ up: 0, down: 0 });
  const [input, setInput] = useState("");


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

  const addComment = () => {
    if (editMode) {
      const details = {};
      function checkParent(arr, obj = {}) {
        for (let x in arr) {
          if (arr[x]["id"] == id) {
            details.parentId = obj["id"];
            details.position = x;
           
            break;
          }

          for (let y in arr[x]["replies"]) {
            if (arr[x]["replies"][y]["id"] == id) {
              details.parentId = arr[x]["id"];
              details.position = y;
              break;
            }
            checkParent(arr[x]["replies"][y]["replies"], arr[x]["replies"][y]);
          }
        }
      }

      checkParent(parentData, {});
      setEditMode(false);

      handleEditNode(details.parentId, input, details.position, id,cmntScore+score+score.up-score.down);
      setShowInput(false);
      setInput("");
    } else {
      handleInsertNode(id, input ,cmntScore+score.up-score.down);
      setShowInput(false);
      setInput("");
    }
  };

  const handleDelete = () => {
    handleDeleteNode(id);
  };

  const handleEdit = (e) => {
    setEditMode(true);
  };

  function autoResize(e) {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";

    setInput(e.target.value);
  }

  const handleComment = (e) => {
    if (e.keyCode == 13 && !e.shiftKey) {
      if (input.trim().length !== 0) {
        addComment(e);
      }
    }
  };

  return (
    <>
      {editMode ? (
        <div className="reply new-reply">
          <div>
            <textarea
              className="reply new-reply"
              autoFocus
              onInput={(e) => autoResize(e)}
              onKeyUp={handleComment}
            >
              {editMode ? content : input}
            </textarea>
            <Action
              type={"Cancel"}
              className="cancelReply"
              handleClick={() => setEditMode(false)}
            />
          </div>
        </div>
      ) : (
        <div className={"comment-parent-container"}>
          <img
          src={image.png.substr(2)}
          alt="user"
          style={
              replies === undefined
              ? { width: "25px", height: "25px" }
              : null
          }
        />
          <div className="comment-outer-container">
            <div className="comment-container">
              <b className="username">{username}</b>
              {replyingTo === undefined ? null : <><span >  <FontAwesomeIcon icon={faReply} flip="horizontal" size="2xs" /></span>
              <b className="username">{replyingTo}</b></>}
              <div className="comment">{content}</div>
              <FontAwesomeIcon className='icon' onClick={handleUp} icon={faAngleUp} size="2xs" />
            <FontAwesomeIcon className='icon' onClick={handleDown} icon={faAngleUp} rotation={180} style={{ marginBottom: '.3px', marginLeft: '13px' }} size="2xs" /><br />
            <span className="score">+{score.up}</span><span className="score" style={{ marginLeft: '27px' }}>-{score.down}</span>
            </div>
            {editMode ? (
              <>
                <Action type={"Save"} />
                <Action
                  type={"Cancel"}
                  handleClick={() => setEditMode(false)}
                />
              </>
            ) : (
              <>
                <Action type={"Reply"} handleClick={() => setShowInput(true)} />
                <Action type={"Edit"} handleClick={(e) => handleEdit()} />
                <Action type={"Delete"} handleClick={() => handleDelete()} />
              </>
            )}
          </div>
        </div>
      )}

      <div style={{ marginLeft: "25px" }}>
        {showInput ? (
          <>
            <div className="reply new-reply">
              <div>
                <textarea
                  contentEditable={editMode}
                  suppressContentEditableWarning={editMode}
                  className="reply new-reply"
                  autoFocus
                  onInput={(e) => autoResize(e)}
                  onKeyUp={handleComment}
                ></textarea>
                <Action
                  type={"Cancel"}
                  className="cancelReply"
                  handleClick={() => setShowInput(false)}
                />
              </div>
            </div>
          </>
        ) : null}
        {replies?.map((cmnt) => {
          return (
            <Comment
              handleInsertNode={handleInsertNode}
              handleDeleteNode={handleDeleteNode}
              handleEditNode={handleEditNode}
              replies={cmnt.replies}
              content={cmnt.content}
              username={cmnt.user.username}
              currentUser={currentUser}
              id={cmnt.id}
              image={cmnt.user.image}
              parentData={parentData}
              replyingTo={cmnt.replyingTo}
              cmntScore={cmnt.score}
            />
          );
        })}
      </div>
    </>
  );
}
