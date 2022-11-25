const express = require("express");
const router = express.Router();
const axios = require('axios');
/* const { response } = require("../app"); */
const Event = require("../models/Event.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment")
const { isAuthenticated } = require("../middleware/jwt.middleware");
const Community = require("../models/Community");

// Get an Event by :id and return to the community page
// It is not returning
router.get("/community/event/search", async (req, res, next) => {
    try {
        const { Name } = req.query;
        let response = await axios.get("https://dados.gov.pt/pt/datasets/r/588d5c20-0851-4c34-b5da-dcb1239e7bca")
        let eventsAll = response.data

        let eventDetail = eventsAll.filter((events) => events.Name === Name)[0]
        console.log(eventDetail)
        res.status(200).json(eventDetail)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}); 

// Get User that will Atendee
// It is returning all users
router.get('/community', async (req, res) => {

  try {
  const userAtendee = await User.find()
  res.status(200).json(userAtendee);
} catch(error) {
  res.json(error);  
}
});

// COMMENTS
// See Comments
router.get('/community/comments', async (req, res, next) =>{
   try {
    const commentsView = await Comment.find();
    res.json(commentsView)
  } catch(error) {
    res.json(error);  
  }
})

// Create Comments
router.post('/community/create-comment/:id', isAuthenticated, async (req, res, next) => {
  try {
    const {id} = req.params;
    const { comments } = req.body;
    const user = req.payload;
    const newComment = await Comment.create({comments, user: user._id});
    
    // Push comment to the community
    /* const updateCommunity = await Community.findByIdAndUpdate(id, {
      $push: {
      comment: newComment._id,
    },
  }) */
  // Push comment to the User
    const updateUser = await User.findByIdAndUpdate(id, { $push: { comments: newComment._id },}, {new: true})
    res.status(200).json(updateUser)
  } catch(error) {
    console.log(error);  
  }
 })

// Delete Comment
router.delete('/community/create-comment/:id', isAuthenticated, async (req, res, next) => {
  try {
    const {id} = req.params;

    const deletedComment = await Comment.findByIdAndRemove(id);
    const updatedUser = await User.findByIdAndUpdate(id, {
      $pull: {
      comments: deletedComment._id,
    },
  }, {new: true})
    res.status(200).json(updatedUser);
  } catch(error) {
    res.json(error);  
  }
})


// router.get("/events", (req, res, next) => {
//     axios.get("https://dados.gov.pt/pt/datasets/r/588d5c20-0851-4c34-b5da-dcb1239e7bca") //limit either slice or map
//         .then(response => {
//             console.log(response.data)
//         })
//     res.json(response.data)
// }); //get all events


// router.get("/events/search", async (req, res, next) => {
//     try {
//         const { Name } = req.query;

//         // this route will get all the events by Name

//         let response = await axios.get("https://dados.gov.pt/pt/datasets/r/588d5c20-0851-4c34-b5da-dcb1239e7bca")
//         let eventsAll = response.data

//         let eventDetail = eventsAll.filter((events) => events.Name === Name)[0]
//         console.log(eventDetail)
//         res.status(200).json(eventDetail)
//     } catch (error) {
//         console.log(error)
//     }
// });

// front end string interpolation 

module.exports = router;
