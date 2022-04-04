import { gql } from "apollo-server-core";

export default gql`
  type CommonResult {
    ok: Boolean!
    message: String!
    id: Int
  }

  type SeeFollowResult {
    ok: Boolean!
    message: String!
    users: [User]
    totalPages: Int
    totalFollow: Int
  }
`;
