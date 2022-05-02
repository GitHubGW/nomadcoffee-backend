import { gql } from "apollo-server-core";

export default gql`
  type SeeAllCoffeeShops {
    ok: Boolean!
    message: String!
    coffeeShops: [CoffeeShop]
    totalCoffeeShops: Int!
  }

  type Query {
    seeAllCoffeeShops(page: Int!): SeeAllCoffeeShops
  }
`;
