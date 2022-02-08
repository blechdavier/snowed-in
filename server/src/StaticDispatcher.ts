import Express from 'express';

export = (app: Express.Express) => {

    app.use(Express.static("public"))

    app.get("/", (req, res) => {
        res.sendFile("./public/index.html")
    })
}