import { gql } from "apollo-server-core";

export default gql`
  scalar Upload

  type Mutation {
    editProfile(username: String, email: String, password: String, name: String, location: String, avatarUrl: Upload, githubUsername: String): CommonResult!
  }
`;
