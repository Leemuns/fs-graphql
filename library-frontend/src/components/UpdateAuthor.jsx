import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";

import { ALL_AUTHORS, EDIT_BIRTHYEAR } from "../queries";

const UpdateAuthor = () => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const result = useQuery(ALL_AUTHORS);

  const [changeBirthyear] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (result.loading) {
    return <div>loading...</div>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    changeBirthyear({
      variables: { name, born: parseInt(born) },
    });

    setName("");
    setBorn("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Set birthyear</h3>
      <div>
        <label htmlFor="name">name</label>
        <select
          value={name}
          name="name"
          id="name"
          onChange={({ target }) => setName(target.value)}
        >
          {result.data.allAuthors.map((a) => (
            <option value={a.name}>{a.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="born">born</label>
        <input
          value={born}
          name="born"
          id="born"
          onChange={({ target }) => setBorn(target.value)}
        />
      </div>

      <button type="submit">update author</button>
    </form>
  );
};

export default UpdateAuthor;
