const express = require("express");
const router = express.Router();
const axios = require('axios');
const { response } = require("../app");
const Event = require("../models/Event.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

/* router.get("/events", isAuthenticated, (req, res, next) => {
    axios.get("https://dados.gov.pt/pt/datasets/r/588d5c20-0851-4c34-b5da-dcb1239e7bca") //limit either slice or map
        .then(response => {
            console.log(response.data)
        })
    res.json(response.data)
}); //get all events */

router.get("/events/search", isAuthenticated, async (req, res, next) => {
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
        res.status(500).json(error)
    }
});

// front end string interpolation 

router.post("/events/search/favourite", isAuthenticated, async (req, res, next) => {
    const { Name } = req.query
    const userId = req.payload._id // na rota como parametro //req.payload._id
    try {
        let response = await axios.get("https://dados.gov.pt/pt/datasets/r/588d5c20-0851-4c34-b5da-dcb1239e7bca")

        let allEvents = response.data

        let event = allEvents.filter((events) => events.Name === Name)[0]

        const favouriteEvent = await Event.create({
            imageUrl: event.ImageUrl, Who: event.Who, title: event.Name, location: event.Location,
            where: event.Where
        }) // primeiro nome do model, segundo nome do API



        await User.findByIdAndUpdate(userId, { $push: { favorite: favouriteEvent } })
        res.status(200).json(favouriteEvent)
    } catch (error) {

        console.log(error)
        res.status(500).json(error)
    }
});

router.delete("/events/search/favourite/:id", isAuthenticated, async (req, res, next) => {
    try {
        const { id } = req.params
        const userId = req.payload._id

        await User.findByIdAndUpdate(userId, { $pull: { favorite: id } })
        await Event.findByIdAndRemove(id)
        res.status(200).json(id)

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
});

module.exports = router;