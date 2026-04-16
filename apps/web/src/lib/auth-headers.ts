export const getAuthHeaders = (token: string | null) => ({
  Authorization: `Bearer ${token}`,
});
