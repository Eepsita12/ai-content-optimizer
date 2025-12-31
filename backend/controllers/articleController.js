const Article = require('../models/articleModel')
const mongoose = require('mongoose')

//create Article
const createArticle = async (req,res) => {
    const {title, author, publishedDate, sourceUrl, originalContent, tags, images, hyperlinks} = req.body
    
    //validation
    if (!title || !author || !publishedDate || !sourceUrl || !originalContent) {
    return res.status(400).json({
      error: 'All required fields must be provided'
    })
}

    //add doc to db
    try{

        const existingArticle = await Article.findOne({sourceUrl})
        if(existingArticle){
             return res.status(409).json({
            error: 'Article already exists'
        })
    }
        const article = await Article.create({title, author, publishedDate, sourceUrl, originalContent, tags, images, hyperlinks, isOptimized:false})
        res.status(201).json(article)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}


//get all articles
const getArticles = async (req,res) => {
    try {
        const articles = await Article.find({}).sort({publishedDate:1})
        res.status(200).json(articles)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}


//get a single article
const getArticle = async (req,res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'ID is invalid'})
    }

    try {
        const article = await Article.findById(id)
        if(!article) {
            return res.status(404).json({error: "No such article"})
    }
        res.status(200).json(article)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//delete an article
const deleteArticle = async (req,res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'ID is invalid'})
    }

    try {
        const article = await Article.findOneAndDelete({_id:id})
        if(!article) {
            return res.status(404).json({error: "No such article"})
    }
    res.status(200).json(article)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//update an article
const updateArticle = async (req,res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'ID is invalid'})
    }

    try {

            const updateFields = {
                updatedContent: req.body.updatedContent,
                references: req.body.references,
                isOptimized: true,
                optimizedAt: new Date()
            }

            const updatedArticle = await Article.findOneAndUpdate(
                {_id:id, isOptimized:false}, 
                updateFields, 
                {new : true} //Mongo returns new doc
            )

            if(!updatedArticle) {
            return res.status(404).json({error: "Article not found or already optimized"})
        }

        res.status(200).json(updatedArticle)

        } catch (error) {
        res.status(400).json({error: error.message})
        }   
        
    }

module.exports={
    createArticle,
    getArticles,
    getArticle,
    deleteArticle,
    updateArticle
}