import { gql } from "apollo-server-core";

export default gql`
  type SeeCategoriesResult {
    ok: Boolean!
    message: String!
    categories: [Category]
  }

  type Query {
    seeCategories(cursorId: Int): SeeCategoriesResult!
  }
`;
