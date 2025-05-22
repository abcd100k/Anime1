import { useState } from "react";
import { useRouter } from "next/router";

const Header = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search/result?q=${query}`);
    }
  };

  return (
    <header>
      <h1>Mxime Xyz</h1>
      <p>Get free all movies or anime</p>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </header>
  );
};

export default Header;