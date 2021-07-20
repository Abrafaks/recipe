import faker from "faker";
const email = faker.internet.email();
const password = "NormalPassword6!@#";

const user = {
  email,
  password,
};

const getToken = function () {
  const requester = chai
    .request("http://localhost:3000")
    .post("/auth/login")
    .auth(user.email, user.password)
    .end(function (err, res) {
      return res.body.token;
    });
};

export { user, getToken };
