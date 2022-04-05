import { gql } from "apollo-server-core";

export default gql`
  type SeeCategoryResult {
    ok: Boolean!
    message: String!
    coffeeShops: [CoffeeShop]
  }

  type Query {
    seeCategory(name: String!, page: Int): SeeCategoryResult!
  }
`;
