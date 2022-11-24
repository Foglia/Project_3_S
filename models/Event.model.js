const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
{
 ImageUrl: {
    type: String,
    default: 'images/default-event.png',
    },
 Who: {
    type: String,
    },
 Name: {
    type: String,
    },
 Type: {
    type: String,
    },
 Theme: {
    type: String,
    },
 Permanent: {
    type: Boolean,
    },
    // See how to declare TIME - ex: "2022-11-30T16:16:19"
StartDate: {
    type: Date,
    },
EndDate: {
    type: Date,
    },
Location: {
    type: String,    
    },
// Where, Price, Info and Txt are inside html properties.   
// Where - links, text and HTML
Where: {
    type:String
    },
Price: {
    type: String,
    },
// Where - links, text and HTML
Info: {
    type: String,
    },
Text: {
    type: String
   },
Url: {
    type: String,
  }
},
{
 timestamps: true,
}
);

const Event = model("Event", eventSchema);
module.exports = Event