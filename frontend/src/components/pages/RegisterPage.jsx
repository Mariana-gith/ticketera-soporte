import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/register", {
        username,
        email,
        password,
        role,
      });
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Hubo un error al registrar. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Registrarse</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Nombre de usuario</label>
            <input type="text" onChange={(e) => setUsername(e.target.value)} required 
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input type="email" onChange={(e) => setEmail(e.target.value)} required 
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600">Contraseña</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} required 
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600">Registrarse como</label>
            <select onChange={(e) => setRole(e.target.value)} 
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300">
              <option value="user">Usuario</option>
              <option value="admin">Técnico</option>
            </select>
          </div>
          
          <button type="submit" 
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
