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
};

const recipeTitleEmpty = {
  description,
  preparing,
  ingredients,
};

const recipeTitleNotString = {
  title: 1,
  description,
  preparing,
  ingredients,
};

const recipeTitleTooShort = {
  title: "Ab",
  description,
  preparing,
  ingredients,
};

const recipeTitleTooLong = {
  title: faker.lorem.sentences(20),
  description,
  preparing,
  ingredients,
};

const recipeDescriptionEmpty = {
  title,
  preparing,
  ingredients,
};

const recipeDescriptionNotString = {
  title: "THIS RECIPE ",
  description: ["This", "is", "array"],
  preparing,
  ingredients,
};

const recipeDescriptionTooLong = {
  title,
  description: faker.lorem.sentences(50),
  preparing,
  ingredients,
};

const recipePreparingEmpty = {
  title,
  description,
  ingredients,
};

const recipePreparingNotArray = {
  title,
  description,
  preparing: "Just do it.",
  ingredients,
};

const recipePreparingContentNotString = {
  title,
  description,
  preparing: [1, "3", { haha: true }, false],
  ingredients,
};

const recipePreparingContentEmpty = {
  title,
  description,
  preparing: [],
  ingredients,
};

const recipeIngredientsEmpty = {
  title,
  description,
  preparing,
};

const recipeIngredients1NotArray = {
  title,
  description,
  preparing,
  ingredients: "just not array.",
};

const recipeIngredients2NotArray = {
  title,
  description,
  preparing,
  ingredients: [1, 22, "asd"],
};

const recipeIngredientsContentEmpty = {
  title,
  description,
  preparing,
  ingredients: [[], [], [], ["1tsb", "sugar"]],
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
  return recipeForId;
};

export { recipes, deleteAllRecipes, addSomeRecipes };
