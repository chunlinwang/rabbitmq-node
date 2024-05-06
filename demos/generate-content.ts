export default (
  destination: string,
  additionalData: Record<string, any> = {},
) => {
  const data = {
    destination: destination,
    id: Math.floor(Math.random() * 100),
    time: new Date().valueOf(),
    ...additionalData,
  };

  return Buffer.from(JSON.stringify(data));
};
