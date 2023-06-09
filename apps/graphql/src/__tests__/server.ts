// we import a function that we wrote to create a new instance of Apollo Server
import { createApolloServer } from "../server";

// we will use supertest to test our server
import request from "supertest";

// this is the query we use for our test
const queryData = {
  query: `query health {
    health
  }`
};
// const queryData = {
//   query: `query sayHello($name: String) {
//     hello(name: $name)
//   }`,
// variables: { name: "world" }
// };

// describe("e2e demo", () => {
//   let server: any, url: string;

//   // before the tests we will spin up a new Apollo Server
//   beforeAll(async () => {
//     // Note we must wrap our object destructuring in parentheses because we already declared these variables
//     // We pass in the port as 0 to let the server pick its own ephemeral port for testing
//     ({ server, url } = await createApolloServer({ port: 0 }));
//   });

//   // after the tests we will stop our server
//   afterAll(async () => {
//     await server?.close();
//   });

//   it("testing health", async () => {
//     const response = await request(url).post("/").send(queryData);
//     expect(response.body.data?.health).toBeDefined();
//   });
// });
