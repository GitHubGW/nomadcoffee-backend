import { gql } from "apollo-server-core";

export default gql`
  type Category {
    id: Int!
    name: String!
    slug: String!
    coffeeShops: [CoffeeShop]
    totalCoffeeShops: Int
    createdAt: String!
    updatedAt: String!
  }
`;
