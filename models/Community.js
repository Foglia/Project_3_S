const { Schema, model } = require("mongoose");

const communitySchema = new Schema(
{
  Name: { 
    type: String, 
    required: true 
   },
  ImageUrl: { 
    type: String 
  },
  Location: {
    type: String,    
  },
  //Users Comments:  
  comments: {
    type: Schema.Types.ObjectId, ref: 'User' 
  },  
},
{
  timestamps: true,
}
)

// attendance: [ { type: Schema.Types.ObjectId, ref:"User" }],
// comments: [];    

const Community = model("Community", communitySchema);
module.exports = Community;

// To get API values we need to call it in the same way - Schema MODEL?
