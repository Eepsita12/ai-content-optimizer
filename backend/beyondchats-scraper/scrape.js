const axios = require('axios')
const cheerio = require('cheerio')

async function postArticle(articleData) {
    try {
        const response = await axios.post(
            'http://localhost:3000/articles',
            {
                title: articleData.title,
                author: articleData.author,
                publishedDate: articleData.publishedDate,
                sourceUrl: articleData.sourceUrl,
                originalContent: articleData.content,
                tags: articleData.tags,
                images: articleData.images,
                hyperlinks: articleData.hyperlinks
            }
        )

        console.log(`Saved ${articleData.title}`)
        return response.data
    } catch (error) {
        console.error(`Failed to save ${articleData.title}: `, error.response.data || error.message)
    }
}

async function scrapeBlogs() {

    try {
        const url = 'https://beyondchats.com/blogs/'
        const response = await axios.get(url)
        const html = response.data
        const $ = cheerio.load(html)

        const pageNumbers = []
        $('a.page-numbers').each((i, element) => {
            const text = $(element).text().trim()

            if (!isNaN(text) && text !== '') {
                pageNumbers.push(Number(text))
            }
        })

        const lastPage = Math.max(...pageNumbers)
        const lastPageUrl = `https://beyondchats.com/blogs/page/${lastPage}/`

        let currentPage = lastPage
        const collectedLinks = []

        while (collectedLinks.length < 5 && currentPage > 0) {

            const pageUrl = `https://beyondchats.com/blogs/page/${currentPage}/`
            const pageResponse = await axios.get(pageUrl)
            const pageHtml = pageResponse.data
            const page$ = cheerio.load(pageHtml)

            const pageLinks = []
            page$('article a.ct-media-container').each((i, element) => {
                const link = page$(element).attr('href')
                if (link) {
                    pageLinks.push(link)
                }
            })

            pageLinks.reverse()

            pageLinks.forEach((link) => {
                if (collectedLinks.length < 5) {
                    collectedLinks.push(link)
                }
            })
            currentPage--
        }

        console.log('Oldest 5 article links:')
        console.log(collectedLinks)

        for (const link of collectedLinks) {
            const articleData = await scrapeSingleArticle(link)
            await postArticle(articleData)
        }


    } catch (error) {
        console.error('Error while scraping:', error.message)
    }
}

async function scrapeSingleArticle(articleUrl) {
    const response = await axios.get(articleUrl)
    const html = response.data
    const $ = cheerio.load(html)


    const title = $('h1').first().text().trim()

    //content
    const contentParts = []
    $('.elementor-widget-theme-post-content')
        .find('p, h2, h3')
        .each((i, element) => {
            const text = $(element).text().trim()
            if (text) {
                contentParts.push(text)
            }
        })

    const content = contentParts.join('\n\n')

    //Author
    let author = $('.entry-meta a').first().text().trim()
    if (!author) author = 'Unknown'

    //published date
    const publishedDate = $('time').attr('datetime') || $('time').text().trim()

    //tags
    const tags = []

    $('.entry-meta a').each((i, element) => {
        const tag = $(element).text().trim()
        if (tag.startsWith('#')) {
            tags.push(tag.replace('#', ''))
        }
    })

    //hyperlinks
    const hyperlinks = []

    $('.elementor-widget-theme-post-content a').each((i, element) => {
        const href = $(element).attr('href')
        if (href) {
            hyperlinks.push(href)
        }
    })

    //images
    const images = []

    $('.elementor-widget-theme-post-content img').each((i, element) => {
        const src = $(element).attr('src')
        if (src) {
            images.push(src)
        }
    })

    return {
        title,
        author,
        publishedDate,
        content,
        tags,
        hyperlinks,
        images,
        sourceUrl: articleUrl
    }
}

scrapeBlogs()