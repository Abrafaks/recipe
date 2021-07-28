import { faker, User, jwt } from "../config/server.config";

let email = faker.internet.email();
let password = "NormalPassword6!@#";

const user = {
  email,
  password,
  isDeleted: false,
};

email = "c@d.com";

const recipeUser = {
  email,
  passwordHash: "$2b$10$qaVKnj8yjoXkcrQ3GKXhYOcNVNZKvj46PfNp1LnlD7JP5hrBVXWJW",
  isDeleted: false,
};

const finalUser = {
  email,
  password: "Password1!",
  isDeleted: false,
};

const createUser = async function () {
  return new User(recipeUser).save();
};

const getToken = async function () {
  const user = await createUser();
  const { _id, isAdmin } = user;
  const userId = _id;
  const token = jwt.sign(
    {
      userId,
      isAdmin,
    },
    process.env.JWT!
  );
  return { token, userId };
};

const deleteAllUsers = function () {
  return User.deleteMany();
};

export { user, getToken, deleteAllUsers, createUser, finalUser };
