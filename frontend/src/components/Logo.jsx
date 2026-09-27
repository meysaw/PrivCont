function Logo({ size = "default" }) {
  const sizes = {
    small: { text: "text-xl", tag: "text-xs" },
    default: { text: "text-2xl", tag: "text-sm" },
    large: { text: "text-4xl", tag: "text-base" },
  };

  return (
    <div
      className={`inline-flex items-baseline font-extrabold tracking-[-0.04em] ${sizes[size].text}`}
    >
      <span className="text-foreground  text-green-400">Priv</span>
      <span className="text-primary">Cont</span>
      <span className={`text-muted-foreground font-mono ml-0.5 ${sizes[size].tag}`}>
        {"</>"}
      </span>
    </div>
  );
}

export default Logo;