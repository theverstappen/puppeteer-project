interface Book {
  name: string | undefined
  link?: string | undefined
}
type Genre = {
  name: string
  link: string
}

type GenreList = Array<Genre>
type BookList = Array<Book>

export { Book, GenreList, Genre, BookList }
