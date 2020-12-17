const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to database')

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Author {
    name: String!
    id: ID
    born: Int
    bookCount: Int!
  }
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      // Fetch all saved book objects
      const books = await Book.find({})
      
      // Filter books by author
      async function authorFilter(bookToFilter){
        const authorBooks = await Book.find({ author: { $in: args.author } })
        console.log('author filter in progress')
        return authorBooks
      }
      // Filter books by genre
      async function genreFilter(bookToFilter) {
        const genreBooks = await Book.find({ genres: { $in: args.genre } })
        console.log('genre filter in progress')
        return genreBooks
      }

      // Conditional applying each/both filter(s)
      if(!args.author && !args.genre){
        return books
      } else if (args.author && args.genre){
        return genreFilter(authorFilter(books))
      } else if (args.genre){
        return genreFilter(books)
      }

      return authorFilter(books)
    },
    allAuthors: (root) => Author.find({}),
  },
  Author: {
    bookCount: async (root) => {
      // const booksWritten = books.filter(book => book.author === root.name)
      const booksWritten = await Book.find({author: {$in: root._id}})
      return booksWritten.length
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      // Search for author
      let author = await Author.findOne({ name: args.author })

      // If we cannot find the author we create a new author
      if (!author){
        const newAuthor = new Author({
          name: args.author
        })

        const savedAuthor = await newAuthor.save()

        const book = new Book({ ...args, author: savedAuthor._id })

        await book.save()

        return book.populate("author").execPopulate()
      }
      
      // Use the returned author to assign the ObjectID to the author field
      const book = new Book({...args, author: author._id})

      await book.save()

      return book.populate("author").execPopulate()
    },
    editAuthor: async (root, args) => {

      let updatedAuthor = await Author.findOne({ name: args.name })
      if (updatedAuthor){
        updatedAuthor.born = args.setBornTo
        return await updatedAuthor.save()
      }

      return null
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})