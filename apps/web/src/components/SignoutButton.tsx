import { logout } from "@authdog/browser";

export const SignoutButton = () => {
  return (
    <a
      style={{
        cursor: "pointer",
      }}
      onClick={() => {
        logout();
      }}
      className="relative px-6 py-3 font-bold text-white rounded-lg group"
    >
      <span className="absolute inset-0 w-full h-full transition duration-300 transform -translate-x-1 -translate-y-1 bg-purple-800 ease opacity-80 group-hover:translate-x-0 group-hover:translate-y-0"></span>
      <span className="absolute inset-0 w-full h-full transition duration-300 transform translate-x-1 translate-y-1 bg-pink-800 ease opacity-80 group-hover:translate-x-0 group-hover:translate-y-0 mix-blend-screen"></span>
      <span className="relative">Sign Out</span>
    </a>
  );
};
