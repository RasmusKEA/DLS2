import { useOktaAuth } from "@okta/okta-react";
import React, { useState, useEffect } from "react";
import { Button, Header } from "semantic-ui-react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [adminUrlWithToken, setAdminUrlWithToken] = useState(null);
  const [customerUrlWithToken, setCustomerUrlWithToken] = useState(null);

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {
      oktaAuth.getUser().then((info) => {
        setUserInfo(info);
      });
    }
  }, [authState, oktaAuth]);

  useEffect(() => {
    if (userInfo) {
      const generateJwtToken = async () => {
        try {
          const response = await axios.post(
            "http://localhost:8080/auth",
            userInfo
          );
          const { token, redirectUrl, roles } = response.data;
          // Append the JWT token as a query parameter in the redirect URL
          const urlWithToken = `${redirectUrl}?token=${token}`;

          const adminUrl = new URL("http://localhost:3001/");
          adminUrl.searchParams.append("token", token);
          setAdminUrlWithToken(adminUrl.toString());

          const customerUrl = new URL("http://localhost:3002/");
          customerUrl.searchParams.append("token", token);
          setCustomerUrlWithToken(customerUrl.toString());

          // Redirect to the updated URL
          if (roles[1] !== "admin") {
            window.location.href = urlWithToken;
          } else {
            setIsAdmin({ token: token });
          }

          console.log(localStorage.getItem("jwt"));
          // Handle the JWT token as needed (e.g., store it in localStorage, send it in requests)
        } catch (error) {
          // Handle any errors that occur during the request
        }
      };

      generateJwtToken();
    }
  }, [userInfo]);

  const login = async () => {
    await oktaAuth.signInWithRedirect();
  };

  if (!authState) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        {authState.isAuthenticated && !isAdmin && (
          <div>
            <Header as="h1">Redirecting...</Header>
          </div>
        )}
        {authState.isAuthenticated && isAdmin && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "75vh",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <Button
                as={Link}
                to={adminUrlWithToken}
                style={{ margin: "10px" }}
              >
                Admin UI
              </Button>
              <Button
                as={Link}
                to={customerUrlWithToken}
                style={{ margin: "10px" }}
              >
                Customer UI
              </Button>
            </div>
          </div>
        )}

        {!authState.isAuthenticated && (
          <div>
            <Header as="h1">PDFInvoice</Header>
            <p>In order to use our service, please login</p>
            <Button id="login-button" primary onClick={login}>
              Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;
