import express, { Request } from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cors from "cors"

import { getBook } from "./controllers/book.controller"
import { purchase } from "./controllers/amazon.controller"

dotenv.config()

const app = express()

app.set("port", process.env.PORT || 3001)
app.use(cors<Request>())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post("/getBook", getBook)
app.post("/purchase", purchase)

app.listen(app.get("port"), () => {
  console.log("App is running at http://localhost:%d in %s mode", app.get("port"), app.get("env"))
  console.log("Press CTRL-C to stop\n")
})

export default app
