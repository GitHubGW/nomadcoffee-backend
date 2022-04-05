import { gql } from "apollo-server-core";

export default gql`
  type SeeCoffeeShopResult {
    ok: Boolean!
    message: String!
    coffeeShop: CoffeeShop
  }

  type Query {
    seeCoffeeShop(name: String!): SeeCoffeeShopResult!
  }
`;
