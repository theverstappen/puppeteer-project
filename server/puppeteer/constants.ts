const goodReadsUrl = "https://www.goodreads.com/choiceawards/best-books-2020"
const amazonUrl = "https://www.amazon.com"
const userAgent =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"

const selectors = {
  genreList: ".category.clearFix > a",
  modalCloseButton: ".modal__content .modal__close .gr-iconButton",
  bookImages: ".pollAnswer__bookLink img",
  amazonSearchInput: "#twotabsearchtextbox",
  bookList: ".a-section.a-spacing-small.a-spacing-top-small h2 a",
  addToCart: "#add-to-cart-button",
  navigateCheckout: "#nav-cart",
  bookFormat: ".a-button-text",
  captcha: "[action='/errors/validateCaptcha']"
}

const errors = {
  genreList: "An error occured fetching genre list",
  bookList: "An error occured fetching book from goodreads",
  amazonBook: "An error occured when getting book from amazon",
  amazonCheckout: "An error occured when navigating to the checkout page",
  amazonBookFormat: "An error occured when selecting book format"
}

export { goodReadsUrl, amazonUrl, userAgent, selectors, errors }
