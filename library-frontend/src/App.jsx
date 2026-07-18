import { useState } from "react";
import { useApolloClient } from "@apollo/client/react";

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import Recommended from "./components/Recommended";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("access-token"));
  const [page, setPage] = useState("authors");
  const client = useApolloClient();

  const handleLogout = () => {
    setToken(null);
    setPage("authors");
    localStorage.clear();
    client.resetStore();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {!token && <button onClick={() => setPage("login")}>login</button>}
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token && (
          <button onClick={() => setPage("recommended")}>recommended</button>
        )}
        {token && <button onClick={handleLogout}>logout</button>}
      </div>

      <Authors show={page === "authors"} token={token} />
      <Books show={page === "books"} />
      <Login show={page === "login"} setToken={setToken} setPage={setPage} />
      <NewBook show={page === "add"} />
      <Recommended show={page === "recommended"} />
    </div>
  );
};

export default App;
