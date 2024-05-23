function BorderlessArtboard({
  children,
  ...styleProps
}: Omit<React.CSSProperties, "background" | "backgroundColor" | "borderRadius"> & { children: any }) {
  return (
    <div style={styleProps} className="bg-[#1e1e1e] rounded-[12.8px] px-3 md:px-5 py-2 flex justify-center items-start">
      {children}
    </div>
  );
}

export default BorderlessArtboard;
