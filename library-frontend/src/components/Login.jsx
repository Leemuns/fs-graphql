import { useState } from "react";
import { useMutation, useApolloClient } from "@apollo/client/react";

import { LOGIN, ME } from "../queries";

const Login = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const client = useApolloClient();

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value;
      localStorage.setItem("access-token", token);
      setToken(token);
      setPage("authors");
    },
    onError: () => {
      setError("login failed");
      setTimeout(() => {
        setError(null);
      }, 3000);
    },
  });

  if (!show) {
    return null;
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    await login({ variables: { username, password } });
    await client.refetchQueries({
      include: [ME],
    });

    setUsername("");
    setPassword("");
  };

  return (
    <div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">username</label>
          <input
            value={username}
            name="username"
            id="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">password</label>
          <input
            type="password"
            value={password}
            name="password"
            id="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>

        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;
