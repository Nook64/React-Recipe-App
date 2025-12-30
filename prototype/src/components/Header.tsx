import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <h1>Rezept-App</h1>
      <nav>
        <Link to="/">Landing Page</Link> | 
      </nav>
    </header>
  );
}

export default Header;