const { Schema, model } = require("mongoose");

const communitySchema = new Schema(
{
  title: { 
    type: String, 
    required: true 
   },
  imageUrl: { 
    type: String 
  },
  location: {
    type: String,    
  },
  //Users Comments:  
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  //Users that will go to the refered event
  users: {type: Schema.Types.ObjectId, ref: 'User'},  
  attendance: [ { type: Schema.Types.ObjectId, ref:"User" }],
},
{
  timestamps: true,
}
)

// comments: [];    

const Community = model("Community", communitySchema);
module.exports = Community;

// To get API values we need to call it in the same way - Schema MODEL?
