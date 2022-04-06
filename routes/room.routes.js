const { Router } = require('express')

const Room = require('../models/Room.model')
const Review = require('../models/Review.model')

const router = Router()

router.post('/', async (req, res) => {
    const { id } = req.user
    try {
        const room = await Room.create({ ...req.body, userId: id})
        res.status(200).json(room)
    } catch (error) {
        res.status(500).json({ message: "Error while trying to create room", error})
    }
})

router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find()
        res.status(200).json(rooms)
    } catch (error) {
        res.status(500).json({ message: "Error while trying to get all room", error})
    }
})

router.get('/:roomId', async (req, res) => {
    const { roomId } = req.params
    try {
        const room = await Room.findById(roomId).populate({
            path: "reviews",
            select: ["comment", "userId"],
            populate: {
                path: "userId",
                select: "username"
            }
        })
        res.status(200).json(room)
    } catch (error) {
        res.status(500).json({ message: "Error while trying to get one room", error})
    }
})

router.put('/:roomId', async (req, res) => {
    const { roomId } = req.params
    try {
        const updatedRoom = await Room.findByIdAndUpdate(roomId, req.body, { new: true})
        res.status(200).json(updatedRoom)
    } catch (error) {
        res.status(500).json({ message: "Error while trying to update a room", error})
    }
})

router.delete('/:roomId', async (req, res) => {
    const { roomId } = req.params
    try {
        await Room.findByIdAndDelete(roomId)
        await Review.deleteMany({ roomId })
        res.status(204).json()
    } catch (error) {
        res.status(500).json({ message: "Error while trying to delete a room", error})
    }
})

module.exports = router