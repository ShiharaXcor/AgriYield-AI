function App() {
  return (
    <div className="min-h-screen bg-canvas dark:bg-bg-dark flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-display font-semibold text-forest">
          AgriYield AI
        </h1>
        <p className="mt-3 font-body text-stone">
          Tailwind v4 + custom theme test
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <span className="px-4 py-2 rounded-lg bg-forest text-white font-body text-sm">
            Forest
          </span>
          <span className="px-4 py-2 rounded-lg bg-gold text-white font-body text-sm">
            Gold
          </span>
          <span className="px-4 py-2 rounded-lg bg-irrigation text-white font-body text-sm">
            Irrigation Blue
          </span>
          <span className="px-4 py-2 rounded-lg bg-rust text-white font-body text-sm">
            Rust
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;