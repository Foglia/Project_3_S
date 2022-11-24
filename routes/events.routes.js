const express = require("express");
const router = express.Router();
const axios = require('axios');
const { response } = require("../app");
const Event = require("../models/Event.model");
const User = require("/models/User.model");

router.get("/events", (req, res, next) => {
    axios.get("https://dados.gov.pt/pt/datasets/r/588d5c20-0851-4c34-b5da-dcb1239e7bca")
        .then(response => {
            console.log(response.data)
        })
    res.json(response.data)
});


router.post("/events/", async (req, res, next) => {
    const { url } = req.body

    //this route will get the events id - not being able to pull just one thing 
    // the purpose of this is to get the id of the event and show all in one page
    //after this route we will need to connect the favs

    try {
        let response = await axios.get("https://dados.gov.pt/pt/datasets/r/588d5c20-0851-4c34-b5da-dcb1239e7bca")
        let allEvents = response.data

        let event = allEvents.map((eventDetail) => eventDetail.url === url)/* [5].Name  */ 
        console.log(event)
        res.status(200).json(event)
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
        console.log(error)
        res.status(200).json(favouriteEvent)
    }
}); 

module.exports = router;