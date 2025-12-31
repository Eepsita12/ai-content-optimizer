const express = require('express')
const {
    createArticle,
    getArticle,
    getArticles,
    deleteArticle,
    updateArticle
} = require('../controllers/articleController')

const router = express.Router()

// router.get('/test', (req,res) => {
//     res.json({msg: "articles route working"})
// })

//get all articles
router.get('/', getArticles)

//get a single article
router.get('/:id', getArticle)

//create
router.post('/', createArticle)

//update an article to optimized one
router.patch('/:id', updateArticle)

//delete an article
router.delete('/:id', deleteArticle)


module.exports= router