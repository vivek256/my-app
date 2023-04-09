import data from "../data";
import React from 'react';

const useNode = () => {
  const insertNode = function (tree, commentId, item,score) {
   function addNode(val){

    if(Array.isArray(val)){

    for(let x of val){

        if(x['id'] === commentId){
            x.replies.push({
              id: new Date().getTime(),
              content: item,
              user:data.currentUser,
              replies: [],
              score:score,
            });
            break;
        }

        addNode(x['replies']);

        
    }
}
}

addNode(tree)

return [...tree];
    
  };

  const editNode = function (tree, parentId, value, position, id) {
    
    function editNodeFinal(tree,position,parentId){

      if(Array.isArray(tree)){

          if(parentId === undefined){
              tree[position].id = new Date().getTime();
              tree[position].content = value;
            return
          }

      for(let x of tree){

          if(x['id'] == parentId){
              x.replies[position].content= value;
              x.replies[position].id = new Date().getTime();
              break;
          }


          if(parentId !== undefined){
            editNodeFinal(x['replies'],position,parentId);
          }
          

          
      }
  }
  }

  editNodeFinal(tree,position,parentId);

  return [...tree];
  };

  const deleteNode = function (tree, id) {
    removeComment();
    function removeComment(arr = tree) {
      for (let x in arr) {
        if (arr[x].id == id) {
          arr.splice(x, 1);
          break;
        }
        if (arr[x].replies.length !== 0) {
          removeComment(arr[x].replies);
        }
      }
    }
    return [...tree];
  };

  return { insertNode, editNode, deleteNode };
};

export default useNode;
