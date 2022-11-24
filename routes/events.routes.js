const express = require("express");
const router = express.Router();
const axios = require('axios');
const { response } = require("../app");
const Event = require("../models/Event.model");
const User = require("../models/User.model");

router.get("/events", (req, res, next) => {
    axios.get("https://dados.gov.pt/pt/datasets/r/588d5c20-0851-4c34-b5da-dcb1239e7bca")
        .then(response => {
            console.log(response.data)
        })
    res.json(response.data)
}); //get all events


router.get("/events/:id", async (req, res, next) => {
    try {
        const { id } = req.body;

        // this route will get all the events by Name

        let response = await axios.get("https://dados.gov.pt/pt/datasets/r/588d5c20-0851-4c34-b5da-dcb1239e7bca")
        let eventsAll = response.data

        let eventDetail = eventsAll.filter((events) => events.id === id)[0].Name
        console.log(eventDetail)
        res.status(200).json(eventDetail)
    } catch (error) {
        console.log(error)
    }
});

router.post("/events/:id/favourite", async (req, res, next) => {
    const { id } = req.body
    const userId = req.isAuthenticated;
    try {
        let response = await axios.get("https://dados.gov.pt/pt/datasets/r/588d5c20-0851-4c34-b5da-dcb1239e7bca")

        let allEvents = response.data

        let event = allEvents.filter((events) => events.id === id)

        const favouriteEvent = await Event.create({
            imageUrl: event.imageUrl, who: event.who, title: event.title, category: event.category,
            type: event.type, permanent: event.permanent, startDate: event.startDate, endDate: event.endDate, location: event.location
        })

        console.log(favouriteEvent) 

        await User.findByIdAndUpdate(userId, { $push: { favourites: favouriteEvent } })

    } catch (error) {

        console.log(error)
        res.status(200).json(favouriteEvent)
    }
});

module.exports = router;