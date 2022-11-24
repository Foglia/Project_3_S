const express = require('express');
const router = express.Router();
const Community = require('../models/Community.model');
const Event = require('../models/Event.model') 

//Get an Event by :id and return to the page
router.get('/eventDetails/:id', async (req, res, next) => {
    try {
      const {eventTitle} = req.data;
      const eventSingle = await axios.get("https://dados.gov.pt/pt/datasets/r/588d5c20-0851-4c34-b5da-dcb1239e7bca/events/{:eventTitle}"
    );  
      res.status(200).json(eventSingle);
    } catch(error) {
      res.json(error); 
}
});

module.exports = router;
