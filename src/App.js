import "./styles.css";
import data from "./data";
import Comment from "./Comment";
import useNode from "./customHook/useNode";
import { useState ,useEffect} from "react";

export default function App() {
  let value = data.comments;
  console.log(value)
  
  const getLocalItems = () => {
    let list = localStorage.getItem('items');
    
    if (list) {
      return JSON.parse(localStorage.getItem('items'));
    } else {
      return value;
    }
  }


  const [commentsData, setCommentsData] = useState(getLocalItems());
  const [input,setInput] = useState("")

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(commentsData));
  }, [commentsData]);

  const { insertNode, editNode, deleteNode } = useNode();

  const handleInsertNode = (folderId, item,score) => {
    const finalStructure = insertNode(commentsData, folderId, item,score);
    

    setCommentsData(finalStructure);
  };

  const handleEditNode = (parentId, value, position, id) => {
    const finalStructure = editNode(
      commentsData,
      parentId,
      value,
      position,
      id
    );
    setCommentsData(finalStructure);
  };

  const handleDeleteNode = (folderId) => {
    const finalStructure = deleteNode(commentsData, folderId);
    setCommentsData([...finalStructure]);
  };




function autoResize(e) {
  e.target.style.height = "auto";
  e.target.style.height = e.target.scrollHeight + "px";

  setInput(e.target.value);
}

const handleComment = (e) => {
  if (e.keyCode == 13 && !e.shiftKey) {
    if (input.trim().length !== 0) {
      
      const newData = [...commentsData];
      newData.push({
        id: new Date().getTime(),
        content: input,
        user:data.currentUser,
        replies: []
      });
     setCommentsData(newData);
     setInput("");
     e.target.value=""
    }
  }
};



  return (<>
  <div className="publish">
  {'@' + data.currentUser.username}
      <br />
      <br />
      <img
        className="user-img"
        src={data.currentUser.image.png.substr(2)}
        alt="user"
      />
      <br />
       <div className="reply new-reply" style={{marginLeft:'350px'}}>
              <div>
                <textarea
                  className="reply new-reply"
                  autoFocus
                  onInput={(e) => autoResize(e)}
                  onKeyUp={handleComment}
                ></textarea>
                
              </div>
            </div></div>
    <div>
      {commentsData.map((cmnt) => {
        return (
          <Comment
            handleInsertNode={handleInsertNode}
            handleDeleteNode={handleDeleteNode}
            handleEditNode={handleEditNode}
            id={cmnt.id}
            replies={cmnt.replies}
            parentData={commentsData}
            content={cmnt.content}
            image={cmnt.user.image}
            username={cmnt.user.username}
            currentUser={data.currentUser.username}
            replyingTo={cmnt.replyingTo}
            cmntScore={cmnt.score}
          />
        );
      })}
    </div></>
  );
}
