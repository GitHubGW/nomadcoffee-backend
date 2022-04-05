import { gql } from "apollo-server-core";

export default gql`
  scalar Upload

  type Mutation {
    editCoffeeShop(id: Int!, name: String, latitude: Int, longitude: Int, file: Upload, category: String): CommonResult!
  }
`;
