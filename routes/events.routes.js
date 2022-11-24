const express = require("express");
const router = express.Router();
const axios = require('axios');
const { response } = require("../app");
const Event = require("../models/Event.model");
/* const User = require("/models/User.model");  */

router.get("/events", (req, res, next) => {
    axios.get("https://dados.gov.pt/pt/datasets/r/588d5c20-0851-4c34-b5da-dcb1239e7bca")
        .then(response => {
            console.log(response.data)
        })
    res.json(response.data)
}); //get all events


router.get("/events/:id", async (req, res, next) => {
    const { title } = req.body

    // this route will get all the events by Name

    try {
        let response = await axios.get("https://dados.gov.pt/pt/datasets/r/588d5c20-0851-4c34-b5da-dcb1239e7bca")
        let eventsAll = response.data

        let eventDetail = eventsAll.filter((events) => events.title === title)
        console.log(eventDetail)
        res.status(200).json(eventDetail)
    } catch (error) {
        console.log(error)
    }
});

router.post("/events/favourite", async (req, res, next) => {
    const { Position } = req.body
    const userId = req.isAuthenticated.currentUser._id;
    try {
        let response = await axios.get("https://dados.gov.pt/pt/datasets/r/588d5c20-0851-4c34-b5da-dcb1239e7bca")

        let allEvents = response.data

        let event = allEvents.filter((eventDetail) => news.Position === Position)

        const favouriteEvent = await Event.create({ ImageUrl: event.ImageUrl })

        console.log(favouriteEvent)

        await User.findByIdAndUpdate(userId, { $push: { favourites: favouriteEvent._id } })

    } catch (error) {
        z
        console.log(error)
        res.status(200).json(favouriteEvent)
    }
});

module.exports = router;