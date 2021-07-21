export const components = {
  components: {
    schemas: {
      UserDocument: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "User MongoDB id.",
            example: "60ec225655915ba21f1638e2",
          },
          email: {
            type: "string",
            description: "User email.",
            example: "user@example.com",
          },
          passwordHash: {
            type: "string",
            description: "User password hash.",
            example:
              "$2b$10$FsXY.NneuZfPSXQ08Ylf7.h3seczwMOOtKxnfF5pzXbCtRAB8v.8K",
          },
          isAdmin: {
            type: "boolean",
            description: "Defines if user is admin. Default false.",
            example: false,
          },
        },
      },
      User: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "User email.",
            example: "user@example.com",
          },
          password: {
            type: "string",
            description:
              "Strong password - min 8 chars, 1 uppercase, 1 lowercase, 1 sign and 1 number.",
            example: "Password1!",
          },
        },
      },
      Recipe: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Recipe title. Min 3, max 80 chars.",
            example: "Chocolate cookies.",
          },
          description: {
            type: "string",
            description: "Recipe description. Not required. Max 256 chars.",
            example: "My first recipe.",
          },
          preparing: {
            type: "array of strings",
            description:
              "Recipe preparing guide. Each step is new index in array.",
            example:
              "['Prepare ingredients', 'Measure flour', 'Set up the oven']",
          },
          ingredients: {
            type: "array of arrays of strings",
            description:
              "Recipe ingredients. Proposed format is [['amount measure', 'ingredient'],['amount measure', 'ingredient']]",
            example:
              "[['1tbs', 'salt'], ['2 cups', 'water'], ['3 cups', 'flour']]",
          },
          url: {
            type: "string",
            description: "Work in progress. Will be completely changed.",
            example: "/must/start/with/index.js",
          },
        },
      },
      RecipeDocument: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "Recipe MongoDB id.",
            example: "60ec225655915ba21f1638e2",
          },
          title: {
            type: "string",
            description: "Recipe title. Min 3, max 80 chars.",
            example: "Chocolate cookies.",
          },
          description: {
            type: "string",
            description: "Recipe description. Not required. Max 256 chars.",
            example: "My first recipe.",
          },
          preparing: {
            type: "array of strings",
            description:
              "Recipe preparing guide. Each step is new index in array.",
            example:
              "['Prepare ingredients', 'Measure flour', 'Set up the oven']",
          },
          ingredients: {
            type: "array of arrays of strings",
            description:
              "Recipe ingredients. Proposed format is [['amount measure', 'ingredient'],['amount measure', 'ingredient']]",
            example:
              "[['1tbs', 'salt'], ['2 cups', 'water'], ['3 cups', 'flour']]",
          },
          url: {
            type: "string",
            description: "Work in progress. Will be completely changed.",
            example: "/must/start/with/index.js",
          },
          userId: {
            type: "string",
            description: "User MongoDB id.",
            example: "60ec225655915ba21f1638e2",
          },
        },
      },
    },
  },
};
