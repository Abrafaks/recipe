import { faker, User, jwt } from "../config/server.config";

let email = faker.internet.email();
let password = "NormalPassword6!@#";

const user = {
  email,
  password,
};

email += "a@b.com";

const recipeUser = {
  email,
  passwordHash: "$2b$10$xBnHYuKfT3HTt24zEEHDMe81xOqFtBlPrOkZ4uwEeXBuYbi1jUa3K!",
};

const finalUser = {
  email,
  password: "Password1!",
};

const createUser = async function () {
  return new User(recipeUser).save();
};

const getToken = async function () {
  const user = await createUser();
  const { _id, isAdmin } = user;
  const userId = _id;
  return jwt.sign(
    {
      userId,
      isAdmin,
    },
    process.env.JWT!
  );
};

const deleteAllUsers = function () {
  return User.deleteMany();
};

export { user, getToken, deleteAllUsers };
