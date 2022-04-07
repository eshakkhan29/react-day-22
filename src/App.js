import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import app from "./firebase.init";
import { useState } from "react";
import { Button } from "react-bootstrap";
const auth = getAuth(app);
function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [sendmail, setSendmail] = useState(false);

  //  name
  const handelName = (e) => {
    setName(e.target.value);
  };
  //  email
  const handelEmail = (e) => {
    setEmail(e.target.value);
  };
  //  password
  const handelPassword = (e) => {
    setPassword(e.target.value);
  };
  //  register
  const handelRegister = () => {
    setRegistered(!registered);
  };
  // Submit
  const handelSubmit = (e) => {
    e.preventDefault();

    //  error handel
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      return;
    }
    //  password validation
    if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      setError("At least one special character");
      return;
    } else {
      setError("");
    }

    setValidated(true);

    if (!registered) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((result) => {
          console.log(result.user);
          verifyEmail()
        })
        .catch((error) => {
          setError(error.message);
        });
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((result) => {
          console.log(result.user);
        })
        .catch((error) => {
          setError(error.message);
        });
    }
    e.preventDefault();
  };
  const handelResetPassword = () => {
    sendPasswordResetEmail(auth, email).then(() => {
      console.log("email send");
      setSendmail(true);
    });
  };
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      setSendmail(true);
    }).then(error => {
      setError(error.message)
    })
  }


  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="p-4 rounded-3">
        {sendmail && (
          <p className="text-success">please cheek your email inbox</p>
        )}
        <h2 className="text-primary">
          {!registered ? "Register Account" : "Login Account"}
        </h2>
        <Form noValidate validated={validated} onSubmit={handelSubmit}>
          {!registered && (
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                onBlur={handelName}
                type="text"
                placeholder="Enter Name"
                required
              />
            </Form.Group>
          )}
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
          { registered && <Button onClick={handelResetPassword} variant="link">
            {" "}
            Forget Password?
          </Button>}
          <div className="d-flex align-items-center">
            <Button variant="primary" type="submit">
              {!registered ? "Register" : "Login"}
            </Button>
            <Button onClick={handelRegister} variant="link">
              {!registered ? 'Already have account?' : 'Registration'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default App;
