function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-black/5 dark:bg-white/10 rounded-2xl ${className}`} />
  );
}

export default Skeleton;