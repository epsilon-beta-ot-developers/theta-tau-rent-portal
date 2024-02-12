import { Button } from "react-bootstrap";
import { ChangeEvent, FC, FormEvent, useCallback, useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch } from "react-redux";

import "./Login.scss";

// Future: Remove if we want to just use Cognito login page
const Login: FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // dispatch(login({ email, password }));
    },
    [dispatch, email, password]
  );

  return (
    <div className="login-panel">
      <Form className="login-form" onSubmit={handleLogin}>
        <Form.Group className="form-group" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            name="email"
            onChange={handleChangeEmail}
            required
            type="email"
          />
        </Form.Group>
        <Form.Group className="form-group" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            onChange={handleChangePassword}
            required
            type="password"
          />
        </Form.Group>
        <div className="login-button-container">
          <Button type="submit">Login</Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
