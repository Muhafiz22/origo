import { NavLink } from "react-router";

function Home() {
  return (
    <main>
      <h1>Welcome to Origo</h1>

      <NavLink to="/">Dashboard</NavLink>

      <NavLink to="/courses">Courses</NavLink>
    </main>
  );
}

export default Home;
