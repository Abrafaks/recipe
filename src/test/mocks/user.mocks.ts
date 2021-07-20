import { faker, chai, User } from "../config/server.config";

let email = faker.internet.email();
let password = "NormalPassword6!@#";

const user = {
  email,
  password,
};

email += "m";
password += "m";

const recipeUser = {
  email,
  password,
};

const createUser = async function () {
  const response = await chai
    .request("http://localhost:3000")
    .post("/auth/register")
    .set("content-type", "application/json")
    .send({
      email: recipeUser.email,
      password: recipeUser.password,
    });
};

const getToken = async function () {
  await createUser();

  const response = await chai
    .request("http://localhost:3000")
    .post("/auth/login")
    .auth(recipeUser.email, recipeUser.password);
  return response.body.token;
};

const deleteAllUsers = function () {
  return User.deleteMany();
};

export { user, getToken, deleteAllUsers };
