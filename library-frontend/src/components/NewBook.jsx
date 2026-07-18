import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK } from "../queries";

const NewBook = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => console.error(error.message),
  });

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    createBook({
      variables: { title, author, published: parseInt(published), genres },
    });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="title">title</label>
          <input
            value={title}
            name="title"
            id="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        <div>
          <label htmlFor="author">author</label>
          <input
            value={author}
            name="author"
            id="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>

        <div>
          <label htmlFor="published">published</label>
          <input
            type="number"
            value={published}
            name="published"
            id="published"
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>

        <div>
          <label htmlFor="genre" />
          <input
            value={genre}
            name="genre"
            id="genre"
            onChange={({ target }) => setGenre(target.value)}
          />

          <button onClick={addGenre} type="button">
            add genre
          </button>

          <div>genres: {genres.join(" ")}</div>
        </div>

        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
