const { GraphQLError } = require("graphql");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");

const resolvers = {
  Author: {
    name: (root) => root.name,
    id: (root) => root.id,
    born: (root) => root.born,
    bookCount: async (root) => Book.countDocuments({ author: root.id }),
  },

  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),
    allBooks: async (root, args) => {
      const bookQuery = Book.find({}).populate("author");
      if (args.author) {
        const authorId = await Author.find({ name: args.author }).select("id");
        bookQuery.find({ author: authorId });
      }
      if (args.genre) {
        bookQuery.find({ genres: args.genre });
      }
      return bookQuery;
    },
    allAuthors: async () => {
      return Author.find({});
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      let author = await Author.findOne({ name: args.author });
      let isNewAuthor = false;

      if (!author) {
        author = new Author({ name: args.author });
        isNewAuthor = true;
        await author.save();
      }

      const newBook = new Book({
        title: args.title,
        published: args.published,
        genres: args.genres,
        author: author._id,
      });

      try {
        await newBook.save();
      } catch (error) {
        if (isNewAuthor) {
          await Author.deleteOne({ _id: author._id });
        }
        throw new GraphQLError(`Book creation failed: ${error.message}`, {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      await newBook.populate("author");
      return newBook;

      // const session = await mongoose.startSession();
      // session.startTransaction();

      // try {
      //   let author = await Author.findOne({ name: args.author }).session(
      //     session,
      //   );

      //   if (!author) {
      //     author = new Author({ name: args.author });
      //     await author.save({ session });
      //   }

      //   const newBook = new Book({
      //     title: args.title,
      //     published: args.published,
      //     genres: args.genres,
      //     author: author._id,
      //   });
      //   await newBook.save({ session });

      //   await session.commitTransaction();
      //   session.endSession();

      //   await newBook.populate("author");
      //   return newBook;
      // } catch (error) {
      //   await session.abortTransaction();
      //   session.endSession();

      //   throw new GraphQLError(`Create new book failed: ${error.message}`, {
      //     extensions: {
      //       code: "BAD_USER_INPUT",
      //       invalidArgs: [args.author, args.title],
      //     },
      //   });
      // }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }

      author.born = args.setBornTo;
      return author.save();
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError(`Creating user failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== "test") {
        throw new GraphQLError("_resetDatabase is only available in test mode");
      }
      await Author.deleteMany({});
      await Book.deleteMany({});
      await User.deleteMany({});
      return true;
    },
  },
};

module.exports = resolvers;
