import { gql } from "apollo-server-core";

export default gql`
  type User {
    id: Int!
    email: String!
    username: String!
    name: String
    location: String
    avatarUrl: String
    githubUsername: String
    following: [User]
    followers: [User]
    isMe: Boolean!
    isFollowing: Boolean!
    totalFollowing: Int!
    totalFollowers: Int!
    createdAt: String!
    updatedAt: String!
  }
`;
