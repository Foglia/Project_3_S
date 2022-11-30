const express = require("express");
const router = express.Router();
const axios = require('axios');
const Event = require("../models/Event.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment")
const { isAuthenticated } = require("../middleware/jwt.middleware");


//GET ALL events from the API
router.get("/events", async (req, res, next) => {
  try {
    let response = await axios.get("http://culturaportugal.gov.pt/umbraco/api/eventsapi/GetEvents")
    let eventsAll = response.data

    res.status(200).json(eventsAll)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
});

//Event details FROM THE API
router.get("/event-search", async (req, res, next) => {
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

// POST - create an event with ID in our database
router.post("/event-search", isAuthenticated, async (req, res, next) => {
  const { Name } = req.query
  const userId = req.payload._id 
  try {
    let response = await axios.get("https://dados.gov.pt/pt/datasets/r/588d5c20-0851-4c34-b5da-dcb1239e7bca")

    let allEvents = response.data

    let event = allEvents.filter((events) => events.Name === Name)[0]

    //check if it exists 
    let eventExists = await Event.findOne({ title: event.Name })

    if (eventExists) {
      res.json(eventExists);
      return;
    }

    const attendEvent = await Event.create({
      imageUrl: event.ImageUrl, title: event.Name, category: event.Theme,
      type: event.Type, permanent: event.Permanent, startDate: event.StartDate, endDate: event.EndDate, location: event.Location,
      where: event.Where, price: event.Price, info: event.Info, link: event.Url
    }) 
    console.log(attendEvent)

    res.status(200).json(attendEvent)

  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
});

//Get details from MB
router.get('/events/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    let eventDetails = await Event.findById(id).populate("attendance comments")
    res.status(200).json(eventDetails)
  } catch (error) {
    res.json(error)
    next(error)
  }
})

// COMMENTS CRUD --

// POST - /api/community/create-comment/:ID - Create a Comment
router.post('/events/:id/create-comment', isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const user = req.payload;
    const newComment = await Comment.create({ title, description, user: user._id });

    // Push comment to the event
    await Event.findByIdAndUpdate(id, {
      $push: {
        comments: newComment._id,
      },
    })
    // Push comment to the User
    const updateUser = await User.findByIdAndUpdate(user._id, { $push: { comments: newComment._id }, }, { new: true })
    res.status(200).json(updateUser)
  } catch (error) {
    console.log(error);
  }
})

// DELETE -  /api/community/delete-comment/:id
router.delete('/events/:id/delete-comment/', isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.payload._id

    await Comment.findByIdAndRemove(id);
    res.status(200).json();
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $pull: {
        comments: deletedComment._id,
      },
    }, { new: true } )
    res.status(200).json(updatedUser);
  } catch (error) {
    res.json(error);
  }
})

//Show comments in community 

router.get('/events/comment/:id', isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.payload._id

    const showComment = await Comment.findById(id);
    res.status(200).json(showComment);
  } catch (error) {
    res.json(error);
  }
})

//Attendance

router.put('/events/attend/:id', isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.payload._id

    const updateEvent = await Event.findByIdAndUpdate(id, { $push: { attendance: userId } });
    const updatedUser = await User.findByIdAndUpdate(userId, { $push: { atendeeEvent: id } }, { new: true })

    res.status(200).json(updatedUser)

  } catch (error) {
    res.json(error)
    next(error)
  }
})

// Favorites

router.put('/events/favorite/:id', isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.payload._id

    const favoriteExists = await Event.findById(id)
    if ( favoriteExists.favorite.includes(userId)) {
      res.status(403).json({message: 'already fav'})
      return 
    }
    const updateEvent = await Event.findByIdAndUpdate(id, { $push: { favorite: userId } });
    const updatedUser = await User.findByIdAndUpdate(userId, { $push: { favorite: id } }, { new: true })

    res.status(200).json(updatedUser)

  } catch (error) {
    res.json(error)
    next(error)
  }
})

module.exports = router;
