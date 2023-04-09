import data from "../data";

const useNode = () => {
  const insertNode = function (tree, commentId, item,score) {
   
    if (tree.id === commentId) {
      tree.replies.push({
        id: new Date().getTime(),
        content: item,
        user:data.currentUser,
        replies: [],
        score:score,
      });

      return tree;
    }

    let latestNode = [];
    if (Array.isArray(tree)) {
      latestNode = tree.map((obj) => {
        return insertNode(obj, commentId, item);
      });

      return [...tree];
    } else {
      latestNode = tree.replies.map((obj) => {
        return insertNode(obj, commentId, item);
      });

      return { ...tree };
    }
  };

  const editNode = function (tree, parentId, value, position, id) {
    
    if (parentId === undefined) {
      tree[position].id = new Date().getTime();
      tree[position].content = value;
      return [...tree];
    }
    if (tree.id === parentId) {
      
      tree.replies[position].content = value;
      tree.replies[position].id = new Date().getTime();
      
      return tree;
    }

    let latestNode = [];
    if (Array.isArray(tree)) {
      latestNode = tree.map((obj) => {
        return editNode(obj, parentId, value, position, id);
      });

      return [...tree];
    } else {
      latestNode = tree.replies.map((obj) => {
        return editNode(obj, parentId, value, position, id);
      });

      return { ...tree };
    }
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
