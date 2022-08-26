import { Request, Response } from "express"
import { purchaseBook } from "../puppeteer"

export const purchase = async (req: Request, res: Response) => {
  const { selectedBook } = req.body
  try {
    await purchaseBook(selectedBook as string)
    res.send({
      success: true
    })
  } catch (error) {
    res.status(400).send({
      message: (error as Error).message
    })
  }
}
