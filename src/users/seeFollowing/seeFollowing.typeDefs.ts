import { gql } from "apollo-server-core";

export default gql`
  type Query {
    seeFollowing(username: String!, cursor: Int): SeeFollowResult!
  }
`;
