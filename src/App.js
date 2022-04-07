import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "./firebase.init";
import { useState } from "react";
import { Button } from "react-bootstrap";
const auth = getAuth(app);
function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handelEmail = (e) => {
    setEmail(e.target.value);
  };
  const handelPassword = (e) => {
    setPassword(e.target.value);
  };

  const [registered, setRegistered] = useState(false);
  const handelRegister = () => {
    setRegistered(!registered)
  };

  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");

  const handelSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      return;
    }
    if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      setError("At least one special character");
      return;
    }
    setError("");
    setValidated(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        console.log(result.user);
      })
      .catch((error) => {
        setError(error.message);
      });
    e.preventDefault();
  };
  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="w-25 p-4 rounded-3">
        <h2 className=" text-primary">Register Account!</h2>
        <Form noValidate validated={validated} onSubmit={handelSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              onBlur={handelEmail}
              type="email"
              placeholder="Enter email"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              onBlur={handelPassword}
              type="password"
              placeholder="Password"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
            <p className="text-danger">{error}</p>
          </Form.Group>
          <div className="d-flex align-items-center">
            <Button variant="primary" type="submit">
              Register
            </Button>
            <span onClick={handelRegister} style={{cursor:"pointer"}}  className="ms-3 text-secondary">Already have account?</span>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default App;
