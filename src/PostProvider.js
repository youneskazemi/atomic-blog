import { faker } from "@faker-js/faker";
import { createContext, useContext, useState } from "react";

const PostContext = createContext();
const SearchContext = createContext();

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}
function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }
  return (
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
      }}
    >
      <SearchContext.Provider
        value={{
          searchQuery,
          setSearchQuery,
        }}
      >
        {children}
      </SearchContext.Provider>
    </PostContext.Provider>
  );
}

function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined) throw new Error("using outside posts provider!");
  return context;
}

function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) throw new Error("using outside search provider!");
  return context;
}
export { usePosts, useSearch, PostProvider };
