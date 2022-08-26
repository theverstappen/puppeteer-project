import { Request, Response } from "express"
import { findBookName } from "../puppeteer"

export const getBook = async (req: Request, res: Response) => {
  const { selectedGenre } = req.body
  try {
    const bookName = await findBookName(selectedGenre as string)
    res.json({
      name: bookName
    })
  } catch (error) {
    res.status(400).send({
      message: (error as Error).message
    })
  }
}
