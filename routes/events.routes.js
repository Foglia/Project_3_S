const express = require("express");
const router = express.Router();
const axios = require('axios');
const { response } = require("../app");



router.get("/events", (req, res, next) => {
    axios.get("https://dados.gov.pt/pt/datasets/r/588d5c20-0851-4c34-b5da-dcb1239e7bca")
        .then(response => {
            console.log(response.data)
        })
    res.json(response.data)
});

// this route has been created but the API is not showing on Postman:
// "message": "Internal server error. Check the server console"
// not showing on the inspect on website either but once sent to postman 
// it shows on the terminal 
//I'm unsure if the get is needed

router.post("/events", async (req, res, next) => {
    const { url } = req.body

    //this route will get the events id

    try {
        let response = await axios.get("https://dados.gov.pt/pt/datasets/r/588d5c20-0851-4c34-b5da-dcb1239e7bca")
        let allEvents = response.data

        let event = allEvents.filter((eventDetail) => eventDetail.url === url)
        console.log(event)
        res.json(event[ImageUrl])
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;