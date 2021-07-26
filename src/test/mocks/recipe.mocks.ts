import { faker, Recipe, User } from "../config/server.config";

const title = faker.lorem.sentence();
const description = faker.lorem.sentences(3);
const preparing = [
  faker.lorem.sentence(),
  faker.lorem.sentence(),
  faker.lorem.sentence(),
  faker.lorem.sentence(),
];
const ingredients = [
  [faker.lorem.word(), faker.lorem.word()],
  [faker.lorem.word(), faker.lorem.word()],
  [faker.lorem.word(), faker.lorem.word()],
  [faker.lorem.word(), faker.lorem.word()],
  [faker.lorem.word(), faker.lorem.word()],
  [faker.lorem.word(), faker.lorem.word()],
  [faker.lorem.word(), faker.lorem.word()],
  [faker.lorem.word(), faker.lorem.word()],
];
const image = "/this/will/be.changed";

const recipe = {
  title: title + "1",
  description,
  preparing,
  ingredients,
  image,
};

const recipeTitleEmpty = {
  description,
  preparing,
  ingredients,
  image,
};

const recipeTitleNotString = {
  title: 1,
  description,
  preparing,
  ingredients,
  image,
};

const recipeTitleTooShort = {
  title: "Ab",
  description,
  preparing,
  ingredients,
  image,
};

const recipeTitleTooLong = {
  title: faker.lorem.sentences(20),
  description,
  preparing,
  ingredients,
  image,
};

const recipeDescriptionEmpty = {
  title,
  preparing,
  ingredients,
  image,
};

const recipeDescriptionNotString = {
  title,
  description: ["faker.lorem.sentences(50)"],
  preparing,
  ingredients,
  image,
};

const recipeDescriptionTooLong = {
  title,
  description: faker.lorem.sentences(50),
  preparing,
  ingredients,
  image,
};

const recipePreparingEmpty = {
  title,
  description,
  ingredients,
  image,
};

const recipePreparingNotArray = {
  title,
  description,
  preparing: "Just do it.",
  ingredients,
  image,
};

const recipePreparingContentNotString = {
  title,
  description,
  preparing: [1, "3", { haha: true }, false],
  ingredients,
  image,
};

const recipePreparingContentEmpty = {
  title,
  description,
  preparing: [],
  ingredients,
  image,
};

const recipeIngredientsEmpty = {
  title,
  description,
  preparing,
  image,
};

const recipeIngredients1NotArray = {
  title,
  description,
  preparing,
  ingredients: "just not array.",
  image,
};

const recipeIngredients2NotArray = {
  title,
  description,
  preparing,
  ingredients: [1, 22, "asd"],
  image,
};

const recipeIngredientsContentEmpty = {
  title,
  description,
  preparing,
  ingredients: [[], [], [], ["1tsb", "sugar"]],
  image,
};

const recipeIngredientsContentNotString = {
  title,
  description,
  preparing,
  ingredients: [
    ["3", 2],
    [{ haha: true }, "xd"],
    [true, false],
    [1, 2],
  ],
  image,
};

const recipes = {
  recipe,
  recipeTitleEmpty,
  recipeTitleNotString,
  recipeTitleTooShort,
  recipeTitleTooLong,
  recipeDescriptionEmpty,
  recipeDescriptionNotString,
  recipeDescriptionTooLong,
  recipePreparingEmpty,
  recipePreparingNotArray,
  recipePreparingContentNotString,
  recipePreparingContentEmpty,
  recipeIngredientsEmpty,
  recipeIngredients1NotArray,
  recipeIngredients2NotArray,
  recipeIngredientsContentEmpty,
  recipeIngredientsContentNotString,
};

const deleteAllRecipes = function () {
  return Recipe.deleteMany();
};

const addSomeRecipes = async function (userId: string) {
  const recipe1 = new Recipe({ ...recipe, userId });
  const recipe2 = new Recipe({
    ...recipeDescriptionEmpty,
    userId,
  });

  const recipeForId = await recipe1.save();
  await recipe2.save();
  return recipeForId._id;
};

export { recipes, deleteAllRecipes, addSomeRecipes };
