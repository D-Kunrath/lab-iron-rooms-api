const { model, Schema } = require('mongoose')

const roomSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        imageUrl: {
            type: String
        },
        reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}],
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
)

module.exports = model('Room', roomSchema)