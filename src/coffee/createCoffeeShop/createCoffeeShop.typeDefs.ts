import { gql } from "apollo-server-core";

export default gql`
  scalar Upload

  type Mutation {
    createCoffeeShop(name: String!, latitude: Int, longitude: Int, file: Upload, category: String): CommonResult!
  }
`;
