interface Book {
  name: string | null
}
interface Purchase {
  success: true | false
}
type ErrorResponse = {
  message: string
}

export { Book, Purchase, ErrorResponse }
