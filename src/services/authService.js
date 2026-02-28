import { BASE_URL } from "../config/api";

/*
  Service pour gérer toutes les requêtes liées
  à l'authentification
*/

// Fonction login
export const login = async (email, password) => {

    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    return response.json();
};

// Fonction register
export const register = async (
    nom,
    prenom,
    telephone,
    email,
    password,
    role
) => {

    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nom,
            prenom,
            telephone,
            email,
            password,
            role
        }),
    });

    return response.json();
};

export const logout = async (token) => {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return response.json();
};