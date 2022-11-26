const express = require("express");
const router = express.Router();
const fileUploader = require('../config/cloudinary.config');

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");

// ℹ️ Handles password encryption
const jwt = require("jsonwebtoken");

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isAuthenticated) middleware in order to control access to specific routes
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password or name are provided as empty strings
  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  // // This regular expression check that the email is of a valid format
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  // if (!emailRegex.test(email)) {
  //   res.status(400).json({ message: "Provide a valid email address." });
  //   return;
  // }

  // // This regular expression checks password for special characters and minimum length
  // const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  // if (!passwordRegex.test(password)) {
  //   res.status(400).json({
  //     message:
  //       "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
  //   });
  //   return;
  // }

  // Check the users collection if a user with the same email already exists
  User.findOne({ email })
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      // If email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the new user in the database
      // We return a pending promise, which allows us to chain another `then`
      return User.create({ email, password: hashedPassword });
    })
    .then((createdUser) => {
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      const { email, _id } = createdUser;

      // Create a new object that doesn't expose the password
      const user = { email, _id };

      // Send a json response containing the user object
      res.status(201).json({ user: user });
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // Check if email or password are provided as empty string
  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  // Check the users collection if a user with the same email exists
  User.findOne({ email })
    .then((foundUser) => {

      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: "User not found." });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, email } = foundUser;

        // Create an object that will be set as the token payload
        const payload = { _id, email };

        // Create a JSON Web Token and sign it
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "12d",
        });

        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
  router.get("/verify", isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and is made available on `req.payload`
  console.log(`req.payload`, req.payload);

  // Send back the token payload object containing the user data
  res.status(200).json(req.payload);
});

// ..........................................................................//

/* GET 1 USER BY ID */
//Get User profile ......
router.get('/profile/:id', async (req, res) => {
  try {
  const { id } = req.params
  const seeUser = await User.findById(id);
  res.json(seeUser);
} catch(error) {
  console.log(error);
}
});

/* GET ALL USERS */
router.get('/users', async (req, res) => {
  try {
  const seeUsers = await User.find();
  res.json(seeUsers);
} catch(error) {
  console.log(error);
}
});

/* EDIT USER */
// json, no more render - redirect 
// router.put("/profile/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params //try params
//     const {imageUrl, email, firstName, lastName, gender, location ,aboutMe} = req.body;
//     const updatedUser = await User.findByIdAndUpdate(id, {imageUrl, email, firstName, lastName, gender, location ,aboutMe}, { new: true });
//     res.json(updatedUser) //
//   } catch(error) {
//     console.log(error);
//     next(error)
//   }
// });

//img with cloudnary
router.post('/profile/create', isAuthenticated, fileUploader.single('image'), async (req, res, next) => {
  const user = req.payload._id;
  let { firstName, lastName, gender, location, aboutMe } = req.body;
  try {
    let imageUrl;

    if (req.file) {
      imageUrl = req.file.path;
    } else {
      imageUrl = 'https://upload.wikimedia.org/wikipedia/en/e/ed/Nyan_cat_250px_frame.PNG';
    }

    let createdProfile = await User.create({firstName, lastName, gender, location, aboutMe, imageUrl})
    await User.findByIdAndUpdate(user,{$push:{uploads:createdImage._id}})
  } catch (error) {
    console.log(error);
  }
});


router.put("/profile/:id", fileUploader.single('imageUrl'), async (req, res, next) => {
  try {
    const { id } = req.params //try params
    const {imageUrl, email, firstName, lastName, gender, location ,aboutMe} = req.body;
    
    if (req.file) {
      imageUrl = req.file.path;
    } else {
      imageUrl = currentImage;
    }

    const updatedUser = await User.findByIdAndUpdate(id, {imageUrl, email, firstName, lastName, gender, location ,aboutMe}, { new: true });
    res.json(updatedUser) //
  } catch(error) {
    console.log(error);
    next(error)
  }
});

//see profile
router.get("/profile/:id", async (req, res, next) => {
  const userId = req.params.id
  const user = await User.findById(userId).populate("favorite");
  res.render("profile/profile", user);
});

//delete profile 
router.delete("/profile/:id", async (req, res, next) => {
  const userId = req.params.id
  const user = await User.deleteOne(userId).populate("favorite");
  res.render("profile/profile", user);
});

module.exports = router;


//post sem id
//put com id
// isAuthenticated // TIROU
