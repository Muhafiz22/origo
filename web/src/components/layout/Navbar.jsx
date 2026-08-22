function Navbar() {
  return (
    <nav className="navbar px-6 lg:px-10">
      <div className="flex-1">
        <a className="font-display text-2xl font-semibold">Origo</a>
      </div>

      <div className="flex-none">
        <button className="btn btn-primary">Sign in</button>
      </div>
    </nav>
  );
}

export default Navbar;
