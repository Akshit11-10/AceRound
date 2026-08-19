import { apiFetch } from "./api";

export const authApi = {
  register: (name, email, password) =>
    apiFetch("/auth/register", { method: "POST", body: { name, email, password } }),

  login: (email, password) => apiFetch("/auth/login", { method: "POST", body: { email, password } }),

  logout: () => apiFetch("/auth/logout", { method: "POST" }),

  me: () => apiFetch("/auth/me"),

  updateProfile: (name, email) => apiFetch("/auth/profile", { method: "PATCH", body: { name, email } }),

  changePassword: (currentPassword, newPassword) =>
    apiFetch("/auth/password", { method: "PATCH", body: { currentPassword, newPassword } }),

  deleteAccount: (password) => apiFetch("/auth/account", { method: "DELETE", body: { password } }),
};
