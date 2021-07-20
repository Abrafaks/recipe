import { faker, Recipe } from "../config/server.config";

const recipe = {
  title: faker.lorem.sentence(),
  description: faker.lorem.sentences(3),
  preparing: [
    faker.lorem.sentence(),
    faker.lorem.sentence(),
    faker.lorem.sentence(),
    faker.lorem.sentence(),
  ],
  ingredients: [
    [faker.lorem.word(), faker.lorem.word()],
    [faker.lorem.word(), faker.lorem.word()],
    [faker.lorem.word(), faker.lorem.word()],
    [faker.lorem.word(), faker.lorem.word()],
    [faker.lorem.word(), faker.lorem.word()],
    [faker.lorem.word(), faker.lorem.word()],
    [faker.lorem.word(), faker.lorem.word()],
    [faker.lorem.word(), faker.lorem.word()],
  ],
  url: "/this/will/be.changed",
};

const deleteAllRecipes = function () {
  return Recipe.deleteMany();
};

export { recipe, deleteAllRecipes };
