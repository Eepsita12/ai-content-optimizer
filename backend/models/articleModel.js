const mongoose = require('mongoose')

const Schema = mongoose.Schema

const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publishedDate: {
        type: String,
        required: true
    }, 
    sourceUrl: {
        type: String,
        required: true
    },
    originalContent: {
        type: String,
        required:true
    },
    updatedContent: {
        type: String
    },
    tags: {
        type: Array
    },
    images: {
        type: Array
    },
    hyperlinks: {
        type: Array
    }, 
    isOptimized: {
        type: Boolean,
        required:true
    },
    optimizedAt: {
        type: Date
    },
    references: {
        type: Array
    }
}, {timestamps: true})

module.exports= mongoose.model('Article',articleSchema)