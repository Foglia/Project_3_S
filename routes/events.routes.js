const express = require("express");
const router = express.Router();
const axios = require('axios');
const { response } = require("../app");
const Event = require("../models/Event.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/events", (req, res, next) => {
    axios.get("https://dados.gov.pt/pt/datasets/r/588d5c20-0851-4c34-b5da-dcb1239e7bca") //limit either slice or map
        .then(response => {
            console.log(response.data)
        })
    res.json(response.data)
}); //get all events


router.get("/events/search", async (req, res, next) => {
    try {
        const { Name } = req.query;

        // this route will get all the events by Name

        let response = await axios.get("https://dados.gov.pt/pt/datasets/r/588d5c20-0851-4c34-b5da-dcb1239e7bca")
        let eventsAll = response.data

        let eventDetail = eventsAll.filter((events) => events.Name === Name)[0]
        console.log(eventDetail)
        res.status(200).json(eventDetail)
    } catch (error) {
        console.log(error)
    }
});

// front end string interpolation 

router.post("/events/:id/favourite", isAuthenticated, async (req, res, next) => {
    const { Name } = req.query
    const userId = req.isAuthenticated; // na rota como parametro //req.payload._id
    try {
        let response = await axios.get("https://dados.gov.pt/pt/datasets/r/588d5c20-0851-4c34-b5da-dcb1239e7bca")

        let allEvents = response.data

        let event = allEvents.filter((events) => events.id === id)

        const favouriteEvent = await Event.create({
            imageUrl: event.ImageUrl, who: event.Who, title: event.title, category: event.category,
            type: event.type, permanent: event.permanent, startDate: event.startDate, endDate: event.endDate, location: event.location
        }) // primeiro nome do model, segundo nome do API

        console.log(favouriteEvent) 

        await User.findByIdAndUpdate(userId, { $push: { favourites: favouriteEvent } })
        res.status(200).json(favouriteEvent)
    } catch (error) {

        console.log(error)
        res.status(500).json(error)
    }
});

module.exports = router;