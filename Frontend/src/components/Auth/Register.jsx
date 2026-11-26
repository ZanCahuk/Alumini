import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form.username, form.email, form.password);
      navigate("/profil");
    } catch (err) {
      setError(err.response?.data?.message || "Registracija ni uspela (preveri vnos)");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registracija</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        name="username"
        placeholder="Uporabniško ime (min 3 znaki)"
        value={form.username}
        onChange={onChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="E-pošta"
        value={form.email}
        onChange={onChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Geslo (min 6 znakov)"
        value={form.password}
        onChange={onChange}
        required
      />
      <button type="submit">Registriraj se</button>
      <p>
        Že imaš račun? <Link to="/prijava">Prijava</Link>
      </p>
    </form>
  );
}