const { model, Schema } = require("mongoose")

const reviewSchema = new Schema( 
    {
        comment: {
            type: String,
            maxlength: 200,
            required: true
        },
        roomId: {
            type: Schema.Types.ObjectId,
            ref: "Room"
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
)

module.exports = model("Review", reviewSchema)