export const concatTokens = (accessToken: string, refreshToken: string) => {
  const tokensAndHash = {
    accessToken,
    refreshToken,
  };
  return JSON.stringify(tokensAndHash);
};
