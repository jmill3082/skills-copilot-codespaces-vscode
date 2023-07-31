// Create web server

// Import modules
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { Comment } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const { Op } = require("sequelize");

// Get all comments
router.get('/comments', asyncHandler(async (req, res) => {
    const comments = await Comment.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        order: [['createdAt', 'DESC']],
    });
    res.json(comments);
}));

// Get comment by id
router.get('/comments/:id', asyncHandler(async (req, res) => {
    const comment = await Comment.findByPk(req.params.id, {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    if (comment) {
        res.json(comment);
    } else {
        res.status(404).json({ message: "Comment not found." });
    }
}));

// Create new comment
router.post('/comments', authenticateUser, [
    check('comment').exists({ checkNull: true, checkFalsy: true }).withMessage('Please provide a comment.'),
    check('userId').exists({ checkNull: true, checkFalsy: true }).withMessage('Please provide a user id.'),
    check('postId').exists({ checkNull: true, checkFalsy: true }).withMessage('Please provide a post id.'),
], asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ errors: errorMessages });
    }
    const newComment = await Comment.create(req.body);
    res.status(201).json({ newComment });
}));

// Update comment
router.put('/comments/:id', authenticateUser, [
    check('comment').exists({ checkNull: true, checkFalsy: true }).withMessage('Please provide a comment.'),
    check('userId').exists({ checkNull: true, checkFalsy: true }).withMessage('Please provide a user id.'),
    check('postId').exists({ checkNull: true, checkFalsy: true }).withMessage('Please provide a post id.'),
], asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const comment = await Comment.findByPk(req.params.id);
    if (comment) {
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().