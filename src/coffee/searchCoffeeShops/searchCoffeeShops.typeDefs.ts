import { gql } from "apollo-server-core";

export default gql`
  type Query {
    searchCoffeeShops(name: String, categoryName: String): [CoffeeShop]
  }
`;
