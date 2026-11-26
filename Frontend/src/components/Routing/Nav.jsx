import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function Nav() {
  const { user } = useAuth();
  return (
    <nav>
      {user ? (
        <Link to="/profil">{user.username}</Link>
      ) : (
        <>
          <Link to="/prijava">Prijava</Link>{" "}
          <Link to="/registracija">Registracija</Link>
        </>
      )}
    </nav>
  );
}