import { gql } from "apollo-server-core";

export default gql`
  type Mutation {
    createAccount(email: String!, username: String!, password: String!): CommonResult!
  }
`;
