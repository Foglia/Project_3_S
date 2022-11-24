const User = require("/models/User.model")
const express = require("express");
const router = express.Router();
const axios = require('axios');
const { response } = require("../app");
const Event = require("../models/Event.model");

//Get an Event by :id and return to the page
router.get('/community', async (req, res, next) => {
    try {
      const oneEvent = await axios.get("https://dados.gov.pt/pt/datasets/r/588d5c20-0851-4c34-b5da-dcb1239e7bca/[0]");  // Will return the created tasks Ids as an actual task, not as an Object
      res.status(200).json(oneEvent); //allProjects - placeholder //API would be x.data
    } catch(error) {
      next(error);
    }
});