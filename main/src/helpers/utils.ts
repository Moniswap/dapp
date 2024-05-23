export const customEllipsize = (address: string, startChars: number, endChars: number) => {
  return `${address.substring(0, startChars)}…${address.substring(address.length - endChars)}`;
};
