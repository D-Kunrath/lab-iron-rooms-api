const { Router } = require('express')

const Review = require('../models/Review.model')
const Room = require('../models/Room.model')

const router = Router()

router.post('/:roomId', async (req, res) => {
    const { roomId } = req.params
    const { id } = req.user
    try {
        const room = await Room.findById(roomId)
        if (room.userId == id) {
            res.status(400).json({message: "User can't create a review on own room"})
            return
        }
        const newReview = {...req.body, roomId, userId: id}
        const reviewFromDb = await Review.create(newReview)

        await Room.findByIdAndUpdate(roomId, {
            $push: {reviews: reviewFromDb._id}
        })
        res.status(200).json(reviewFromDb)
    } catch (error) {
        res.status(500).json({message: "Error while trying to create new review", error})
    }
})

router.get('/:roomId', async (req, res) => {
    const { roomId } = req.params
    try {
        const reviews = await Review.find({roomId}).populate(
            "userId roomId",
            "username name"
        )
        res.status(200).json(reviews)
    } catch (error) {
        res.status(500).json({message: "Error while trying to get reviews", error})
    }
})

router.delete('/:reviewId', async (req, res) => {
    const { reviewId } = req.params
    const { id } = req.user

    try { 
        const review = await Review.findById(reviewId)

        if (review.userId != id) {
            res.status(400).json("User can only delete own review")
            return
        }

        await Review.findByIdAndDelete(reviewId)

        await Room.findByIdAndUpdate(review.roomId, {
            $pull: {reviews: reviewId}
        })
        res.status(200).json({ message: "Review deleted"})
    } catch (error) {
        res.status(500).json({message: "Error while trying to delete review", error})
    }
})

router.put('/:reviewId', async (req, res) => {
    const { reviewId } = req.params
    const { id } = req.user
    try {
        const updatedReview = await Review.findOneAndUpdate( {_id: reviewId, userId: id}, req.body, {new: true})
        res.status(200).json(updatedReview)
    } catch (error) {
        res.status(500).json({message: "Error while trying to update review", error})
    }
})



module.exports = router