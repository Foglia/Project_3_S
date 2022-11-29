const { Schema, model } = require("mongoose");
const commentSchema = new Schema(
{
    comments: {
    type: String,
    required: false,
    },
    user: {
    type: Schema.Types.ObjectId, ref:"User"
    }
},
{
    timestamps: true,
}
);

const Comment = model("Comment", commentSchema);
module.exports = Comment;