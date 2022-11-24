//Get User profile ......
router.get('/profile/:userId', isAuthenticated, async (req, res) => {
    try {
    const { userId } = req.params
    const currentUser = req.isAuthenticated
    const editUser = await User.findById(userId);
    res.json(editUser);
  } catch(error) {
    console.log(error);
  }
  });
  
  // json, no more render - redirect 
  router.put("/profile/:userId", async (req, res, next) => {
    try {
      const { userId } = req.params //try params
      const {firstName, lastName, gender, location ,aboutMe} = req.body;
      const updatedUser = await User.findByIdAndUpdate(userId, {firstName, lastName, gender, location ,aboutMe});
      res.json(updatedUser) //
    } catch(error) {
      console.log(error);
      next(error)
    }
  });
  
  module.exports = router;