const { Schema, model } = require("mongoose");
const commentSchema = new Schema(
    {
        title: {
            type: String,
        },
        description: {
            type: String
        },
        atendeeEvent: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    },

    {
        timestamps: true,
    }
);

const Comment = model("Comment", commentSchema);
module.exports = Comment;