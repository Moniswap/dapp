function BorderlessArtboard({
  children,
  ...styleProps
}: Omit<React.CSSProperties, "background" | "backgroundColor" | "borderRadius"> & { children: any }) {
  return (
    <div style={styleProps} className="bg-[#1e1e1e] rounded-[12.8px] px-3 md:px-5 py-5">
      {children}
    </div>
  );
}

export default BorderlessArtboard;
