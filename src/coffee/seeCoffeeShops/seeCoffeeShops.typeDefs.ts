import { gql } from "apollo-server-core";

export default gql`
  type SeeCoffeeShopsResult {
    ok: Boolean!
    message: String!
    coffeeShops: [CoffeeShop]
    totalCoffeeShops: Int!
  }

  type Query {
    seeCoffeeShops(page: Int): SeeCoffeeShopsResult!
  }
`;
