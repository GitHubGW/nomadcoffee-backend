import { gql } from "apollo-server-core";

export default gql`
  type CoffeeShop {
    id: Int!
    name: String!
    latitude: Int
    longitude: Int
    user: User!
    userId: Int!
    coffeeShopPhotos: [CoffeeShopPhoto]
    categories: [Category]
    createdAt: String!
    updatedAt: String!
  }

  type CoffeeShopPhoto {
    id: Int!
    url: String!
    coffeeShop: CoffeeShop!
    coffeeShopId: Int!
    createdAt: String!
    updatedAt: String!
  }
`;
