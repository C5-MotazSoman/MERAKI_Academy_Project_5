const connection = require("../models/db");


//a function that returns all posts-reactions
const getAllPostsReactions = (req, res) => {
  const query = `SELECT * FROM post_reaction WHERE isDeleted=0`;
  connection.query(query, (error, result) => {
    if (error) {
   return res.status(500).json({
        success: false,
        massage: "server error",
        error: error,
      });
    }
    res.status(201).json({
      success: true,
      massage: `all posts reactions`,
      result: result,
    });
  });
};

//a function that creates a reaction on a specific post by post_id
const addReactionToPost = (req, res) => { //! user can react only one time on a post
  const query = `SELECT * FROM post_reaction WHERE author_id=? AND post_id=?`;
  const query1 = `INSERT INTO post_reaction (author_id,post_id) VALUES (?,?)`; 
  const post_id = req.params.id;
  const author_id=req.token.userId;
  const data=[author_id,post_id];

  //first check if the user has previously reacted on the post:
  connection.query(query,data,(error,result)=>{
    if (error) {
      return res.status(500).json({
           success: false,
           massage: "server error",
           error: error,
         });
       };
       console.log({inside_add_reaction:result})
       if(result.length==0){
         connection.query(query1, data, (error1, result1) => {
           if (error1) {
          return res.status(500).json({
               success: false,
               massage: "server error",
               error: error1,
             });
           }
           res.status(201).json({
             success: true,
             massage: "reaction created successfully",
             result: result1,
           });
         });
       }else if(result[0].isDeleted==1){
         const query3 = `UPDATE post_reaction SET isDeleted=0 WHERE author_id=? AND post_id=?`; //! to set from isDeleted=1 to isDeleted=0 
         connection.query(query3, data, (error3, result3) => {
          if (error3) {
         return res.status(500).json({
              success: false,
              massage: "server error",
              error: error3,
            });
          }
          res.status(201).json({
            success: true,
            massage: "reaction created successfully",
            result: result3,
          });
        });
        }else{
          res.status(403).json({
            success: false,
            massage: "you have already reacted to this post",
          });
        }
  })
};


  //a function that removes a rection from a specific post by post_id 
const removeReactionFromPost = (req, res) => {
  const query = `SELECT * FROM post_reaction WHERE author_id=? AND post_id=? AND isDeleted=0`;
  const query1 = `UPDATE post_reaction SET isDeleted=1 WHERE author_id=? AND post_id=?`;
  const post_id = req.params.id;
  const author_id=req.token.userId;
  const data=[author_id,post_id];

  //first check if the user has previously reacted on the post:
  connection.query(query,data,(error,result)=>{
    if (error) {
      return res.status(500).json({
           success: false,
           massage: "server error",
           error: error,
         });
       };
       if(result.length!=0){
         connection.query(query1, data, (error1, result1) => {
           if (error1) {
          return res.status(500).json({
               success: false,
               massage: "server error",
               error: error1,
             });
           }
           res.status(201).json({
             success: true,
             massage: "reaction removed successfully",
             result: result1,
           });
         });
       }else{
        res.status(403).json({
          success: false,
          massage: "you haven't reacted to this post yet!",
        });
       }
  })
  };

  //a function that returns all comments-reactions
const getAllCommentsReactions = (req, res) => {
  const query = `SELECT * FROM comment_reaction WHERE isDeleted=0`;
  connection.query(query, (error, result) => {
    if (error) {
   return res.status(500).json({
        success: false,
        massage: "server error",
        error: error,
      });
    }
    res.status(201).json({
      success: true,
      massage: `all comments reactions`,
      result: result,
    });
  });
};

//a function that creates a reaction on a specific comment by comment_id
const addReactionToComment = (req, res) => { //! user can react only one time on a comment
  const query = `SELECT * FROM comment_reaction WHERE author_id=? AND comment_id=?`;
  const query1 = `INSERT INTO comment_reaction (author_id,comment_id) VALUES (?,?)`; 
  const comment_id = req.params.id;
  const author_id=req.token.userId;
  const data=[author_id,comment_id];

  //first check if the user has previously reacted on the comment:
  connection.query(query,data,(error,result)=>{
    if (error) {
      return res.status(500).json({
           success: false,
           massage: "server error",
           error: error,
         });
       };
       console.log({inside_add_reaction_commet:result})//! to be deleted
       if(result.length==0){
         connection.query(query1, data, (error1, result1) => {
           if (error1) {
          return res.status(500).json({
               success: false,
               massage: "server error",
               error: error1,
             });
           }
           res.status(201).json({
             success: true,
             massage: "reaction created successfully",
             result: result1,
           });
         });
       }else if(result[0].isDeleted==1){
         const query3 = `UPDATE comment_reaction SET isDeleted=0 WHERE author_id=? AND comment_id=?`; //! to set from isDeleted=1 to isDeleted=0 
         connection.query(query3, data, (error3, result3) => {
          if (error3) {
         return res.status(500).json({
              success: false,
              massage: "server error",
              error: error3,
            });
          }
          res.status(201).json({
            success: true,
            massage: "reaction created successfully",
            result: result3,
          });
        });
        }else{
          res.status(403).json({
            success: false,
            massage: "you have already reacted to this comment",
          });
        }
  })
};

  //a function that removes a rection from a specific comment by comment_id 
  const removeReactionFromComment = (req, res) => {
    const query = `SELECT * FROM comment_reaction WHERE author_id=? AND comment_id=? AND isDeleted=0`;
    const query1 = `UPDATE comment_reaction SET isDeleted=1 WHERE author_id=? AND comment_id=?`;
    const comment_id = req.params.id;
    const author_id=req.token.userId;
    const data=[author_id,comment_id];
  
    //first check if the user has previously reacted on the post:
    connection.query(query,data,(error,result)=>{
      if (error) {
        return res.status(500).json({
             success: false,
             massage: "server error",
             error: error,
           });
         };
         if(result.length!=0){
           connection.query(query1, data, (error1, result1) => {
             if (error1) {
            return res.status(500).json({
                 success: false,
                 massage: "server error",
                 error: error1,
               });
             }
             res.status(201).json({
               success: true,
               massage: "reaction removed successfully",
               result: result1,
             });
           });
         }else{
          res.status(403).json({
            success: false,
            massage: "you haven't reacted to this comment yet!",
          });
         }
    })
    };

module.exports={
  getAllPostsReactions,
    addReactionToPost,
    removeReactionFromPost,
    getAllCommentsReactions,
    addReactionToComment,
    removeReactionFromComment
}