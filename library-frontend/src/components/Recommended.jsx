import { useQuery } from "@apollo/client/react";

import { ME } from "../queries";
import BookList from "./BookList";

const Recommended = (props) => {
  const result = useQuery(ME);

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const favoriteGenre = result.data.me?.favoriteGenre;

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>

      <BookList genre={favoriteGenre} />
    </div>
  );
};

export default Recommended;
