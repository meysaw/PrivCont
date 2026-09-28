function Logo({ size = "default" }) {
  const sizes = {
    small: { text: "text-xl", tag: "text-xs" },
    default: { text: "text-2xl", tag: "text-sm" },
    large: { text: "text-4xl", tag: "text-base" },
  };

  return (
    <div
      className={`inline-flex items-baseline font-brand font-extrabold tracking-[-0.04em] ${sizes[size].text}`}
    >
      <span className="text-foreground  text-green-500">Priv</span>
      <span className="text-primary">Cont</span>
       <span className={`ml-0.5 font-medium text-muted-foreground text-red-500 ${sizes[size].tag}`}>
        {"</>"}
      </span>
    </div>
  );
}

export default Logo;