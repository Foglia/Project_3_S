const express = require("express");
const router = express.Router();
const axios = require('axios');
const { response } = require("../app");
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
router.get('/community/users', async (req, res) => {
  try {
  const userAtendee = await User.find();
  res.json(userAtendee);
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
router.put('/community/:comment', isAuthenticated, async (req, res, next) => {
  try {
    const { comment } = req.body;
    const userId = req.isAuthenticated;
    const newComment = await Comment.create({comment ,userId});
    
    // Push review to the community
    const updateCommunity = await Community.create(userId, {
      $push: {
      comment: newComment._id,
    },
    });
    //Push review to the user
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $push: {
      comment: newComment._id,
    },
    });
  } catch(error) {
    res.json(error);  
  }
})

// Delete Comment
router.put('/community/:comment', isAuthenticated, async (req, res, next) => {
  const {id, eventName} = req.params;
  try {
    const removeComment = await Comment.findByIdAndRemove(id);
    await User.findByIdAndUpdate(removedComment.user, {
      $pull: { comment: removedComment._id },
    });
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
