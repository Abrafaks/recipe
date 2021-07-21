export const register = {
  post: {
    tags: ["User operations"],
    description: "Register user",
    operationId: "registerUser",
    parameters: [],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#components/schemas/User",
          },
        },
      },
    },
    responses: {
      200: {
        description: "User created successfully",
      },
      400: {
        description: "Account with this email already exists.",
      },
      500: {
        description: "Internal server error",
      },
    },
  },
};
