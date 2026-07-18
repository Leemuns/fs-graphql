import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";

const BookList = ({ genre }) => {
  const result = useQuery(ALL_BOOKS, { variables: { genre } });

  if (result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;

  return (
    <table>
      <tbody>
        <tr>
          <th></th>
          <th>author</th>
          <th>published</th>
        </tr>
        {books.map((a) => (
          <tr key={a.id}>
            <td>{a.title}</td>
            <td>{a.author.name}</td>
            <td>{a.published}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BookList;
