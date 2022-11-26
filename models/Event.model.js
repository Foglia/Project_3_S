const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
{
 imageUrl: {
    type: String,
    default: 'images/default-event.png',
    },
 who: { //Who at the API
    type: String,
    },
 title: { //Name at the API
    type: String,
    },
 category: { //Theme at the API
    type: String,
    },
 type: { 
    type: String,
    },
 permanent: {
    type: Boolean,
    },
    // See how to declare TIME - ex: "2022-11-30T16:16:19"
 startDate: {
    type: Date,
    },
 endDate: {
    type: Date,
    },
 location: {
    type: String,    
    },
// Where, Price, Info and Txt are inside html properties.   
// Where - links, text and HTML
 where: {
    type:String
    },
 price: {
    type: String,
    },
// Where - links, text and HTML
 info: {
    type: String,
    },
 description: { //Text at the API
    type: String
   },
 link: { //Url at the API
    type: String,
  },
users: {type: Schema.Types.ObjectId, ref: 'User'},  
attendance: [ { type: Schema.Types.ObjectId, ref:"User" }],
comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
},
{
 timestamps: true,
}
);

const Event = model("Event", eventSchema);
module.exports = Event

