import { useState } from "react";

import BookList from "./BookList";

const Books = (props) => {
  const [genre, setGenre] = useState(undefined);

  const genres = [
    "refactoring",
    "agile",
    "patterns",
    "design",
    "classic",
    "crime",
    "revolution",
  ];

  if (!props.show) {
    return null;
  }

  return (
    <div>
      <h2>books</h2>
      {genre && (
        <p>
          in genre <strong>{genre}</strong>
        </p>
      )}

      <BookList genre={genre} />
      {genres.map((g) => (
        <button key={g} onClick={() => setGenre(g)}>
          {g}
        </button>
      ))}
      <button onClick={() => setGenre(undefined)}>all genres</button>
    </div>
  );
};

export default Books;
