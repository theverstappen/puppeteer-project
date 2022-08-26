import * as puppeteer from "puppeteer"
import { GenreList, BookList, Book, Genre } from "../types/types"
import { goodReadsUrl, amazonUrl, userAgent, errors, selectors } from "./constants"

const findBookName = async (selectedGenre: string): Promise<string> => {
  const browser: puppeteer.Browser = await puppeteer.launch({ headless: true })
  const page: puppeteer.Page = await browser.newPage()

  await page.setUserAgent(userAgent)
  await page.setViewport({ width: 1920, height: 1080 })

  await page.goto(goodReadsUrl, { waitUntil: "networkidle0", timeout: 0 })

  const genreList: GenreList = await page.$$eval(selectors.genreList, genres =>
    genres.map((genre: any) => {
      return <Genre>{
        name: (genre as HTMLElement).innerText,
        link: (genre as HTMLAnchorElement).href
      }
    })
  )
  if (!genreList.length) throw Error(errors.genreList)
  const selectedBookLink: string = genreList.filter(g => g.name === selectedGenre)[0].link
  await page.goto(selectedBookLink, { waitUntil: "networkidle0" })

  try {
    const closeBtn = await page.$(selectors.modalCloseButton)
    if (closeBtn) {
      await closeBtn.click()
    }
  } catch (error) {
    throw Error(errors.genreList)
  }

  const bookList: BookList = await page.$$eval(selectors.bookImages, books =>
    books.map((book: any) => {
      return <Book>{
        name: (book as HTMLElement).getAttribute("alt")
      }
    })
  )
  if (!bookList.length) throw Error(errors.bookList)

  const randomIndex: number = Math.floor(Math.random() * bookList.length)
  const selectedBook = bookList[randomIndex].name as string

  return selectedBook
}
const checkCaptcha = async (page: puppeteer.Page): Promise<boolean> => {
  try {
    const recaptchaDiv = await page.$(selectors.captcha)
    return recaptchaDiv ? true : false
  } catch (error) {
    return false
  }
}
const selectBook = async (page: puppeteer.Page, selectedBook: string): Promise<Book> => {
  const isCaptcha: boolean = await checkCaptcha(page)
  if (isCaptcha) await page.reload()

  const searchInput = await page.$(selectors.amazonSearchInput)
  if (!searchInput) throw Error(errors.amazonBook)

  await page.type(selectors.amazonSearchInput, selectedBook)

  await page.keyboard.press("Enter")
  // await Promise.all([page.waitForNavigation(), page.keyboard.press("Enter")])
  await page.waitForNavigation()
  const books: BookList = await page.$$eval(selectors.bookList, bookDetails =>
    bookDetails.map((b: any) => {
      return <Book>{
        name: (b as HTMLElement).innerText,
        link: (b as HTMLAnchorElement).href
      }
    })
  )
  if (!books.length) throw Error(errors.amazonBook)
  return books[0]
}

const navigateCheckoutPage = async (page: puppeteer.Page, browser: puppeteer.Browser): Promise<void> => {
  const cartButton = await page.$(selectors.navigateCheckout)
  // navigating checkout page
  if (cartButton) await Promise.all([cartButton.click(), page.waitForNavigation()])
  else {
    await browser.close()
    throw Error(errors.amazonCheckout)
  }
}

const addBasket = async (url: string): Promise<void> => {
  const browser: puppeteer.Browser = await puppeteer.launch({ headless: false })
  const [page] = await browser.pages() // use existing tab don't open a new one
  await page.setUserAgent(userAgent)

  await page.setViewport({ width: 1920, height: 1080 })

  await page.goto(url)

  const isCaptcha: boolean = await checkCaptcha(page)
  if (isCaptcha) await page.reload()

  let addToCardButton = await page.$(selectors.addToCart)

  if (!addToCardButton) {
    // if book format is kindle or audio book there is no add to card button in DOM
    const bookFormats = await page.$$(selectors.bookFormat)
    if (!bookFormats.length) {
      await browser.close()
      throw Error(errors.amazonBookFormat)
    }

    for (const b of bookFormats) {
      const btnText = await page.evaluate(el => el.textContent, b)
      if (btnText.includes("Hardcover") || btnText.includes("Paperback")) {
        await Promise.all([b.click(), page.waitForNavigation()])
        addToCardButton = await page.$(selectors.addToCart)

        if (addToCardButton) await Promise.all([addToCardButton!.click(), page.waitForNavigation()])
        else {
          await browser.close()
          throw Error(errors.amazonBookFormat)
        }

        // await page.waitForSelector(selectors.addToCart, { timeout: 3000 })
        await navigateCheckoutPage(page, browser)
        return
      }
    }
  }

  // await page.goto(selectedBookType.link, { waitUntil: "networkidle0" })

  await Promise.all([addToCardButton!.click(), page.waitForNavigation()])
  await navigateCheckoutPage(page, browser)
}

const purchaseBook = async (selectedBook: string): Promise<void> => {
  const browser: puppeteer.Browser = await puppeteer.launch({ headless: true })
  const page: puppeteer.Page = await browser.newPage()
  await page.setUserAgent(userAgent)
  await page.setViewport({ width: 1920, height: 1080 })

  await Promise.all([page.goto(amazonUrl, { waitUntil: "domcontentloaded" }), page.waitForNavigation()])
  // await page.goto(amazonUrl, { waitUntil: "domcontentloaded" })
  const book: Book = await selectBook(page, selectedBook)
  await browser.close()
  await addBasket(book.link!)
}

export { findBookName, purchaseBook }
