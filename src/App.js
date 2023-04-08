import "./styles.css";
import Comment from "./Comment";
import { useState, useEffect } from "react";
import data from "./data.json";
import TextArea from "./Textarea";
let j = 9201921;



export default function App() {
  const getLocalItems = () => {
    let list = localStorage.getItem('items');
    console.log(list)
    if (list) {
      return JSON.parse(localStorage.getItem('items'));
    } else {
      return data;
    }
  }

  const [commentStructure, setCommentStructure] = useState(getLocalItems());
  const [text, setText] = useState({ id: ++j, user: commentStructure.currentUser, replies: [] });
  const [isPublish, setIsPublish] = useState(false);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(commentStructure));
  }, [commentStructure]);



  function deleteReply(val) {

    const newCommentStructure = { ...commentStructure };


    function removeComment(obj) {
      for (let x in obj) {
        if (obj[x].id == val) {

          obj.splice(x, 1);
          break;
        }
        if (obj[x].replies !== undefined) {
          removeComment(obj[x].replies);
        }
      }

    }

    removeComment(newCommentStructure.comments)

    setCommentStructure(newCommentStructure);


  }

  function addReply(val) {
    const newCommentStructure = { ...commentStructure };

    if (isPublish) {
      newCommentStructure.comments.push({ ...text })

    } else {


      for (let x of newCommentStructure.comments) {
        if (x['id'] === val[1]) {
          if (x['replies'].length == 0) {
            x['replies'] = []
          }
          x['replies'].push(val[0]);
          break;
        }

        for (let y of x['replies']) {
          if (y['id'] === val[1]) {
            x['replies'].push(val[0]);
            break;
          }
        }

      }

    }



    setCommentStructure(newCommentStructure);


  }

  function autoResize(e) {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";

    const newText = { ...text };




    newText["content"] = e.target.value;
    setText(newText);
  }

  function addComment(e) {
    if (e.keyCode == 13 && !e.shiftKey && e.target.value.length != 0) {

      addReply([text, text.id])
      e.target.value = ''

    }

    if (e.target.value.length != 0) {

      setIsPublish(true);
    } else if (e.target.value.length == 0) {
      setIsPublish(false);
    }


  }

  console.log(commentStructure);
  return (<>
    <div className="publish">
      {'@' + commentStructure.currentUser.username}
      <br />
      <br />
      <img
        className="user-img"
        src={commentStructure.currentUser.image.png.substr(2)}
        alt="user"
      />
      <br />
      <div className="reply new-reply" style={{ marginLeft: '340px' }}>

        <div>
          <textarea onInput={(e) => autoResize(e)} onKeyUp={addComment} autofocus>{

            commentStructure.content

          }</textarea>
          <br />
        </div>
      </div></div>
    <div>
      {commentStructure.comments.map((val, index) => {
        let value = <Comment id={val.id} data={val} deleteReply={deleteReply} addReply={addReply} currentUser={commentStructure.currentUser} />;

        return val.replies === undefined || val.replies.length === 0 ? (
          value
        ) : (
          // <div className="comment-parent-container-div">
          <div>
            <Comment data={val} id={val.id} addReply={addReply} deleteReply={deleteReply} currentUser={commentStructure.currentUser} />
            {val.replies.map((value, i) => {

              return <Comment id={value.id} data={value} addReply={addReply} deleteReply={deleteReply} currentUser={commentStructure.currentUser} />;
            })}
          </div>
          // </div>
        );
      })}
    </div></>
  );
}
