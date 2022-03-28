import { gql } from "apollo-server-core";

export default gql`
  type User {
    id: Int!
    email: String!
    username: String!
    createdAt: String!
    updatedAt: String!
  }
`;
