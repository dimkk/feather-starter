module.exports = function() {
    const app = this;
    const getArticle = {
        get(url) {
            return new Promise((resolve) => resolve(url))
        }
    }

    app.use('/article', getArticle)
}