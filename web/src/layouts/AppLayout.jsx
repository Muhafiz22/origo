import { Link, Outlet } from "react-router";
import Navbar from "../components/layout/Navbar";

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer>Footer will go here</footer>
    </div>
  );
}

export default AppLayout;
