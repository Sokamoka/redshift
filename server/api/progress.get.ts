export default defineEventHandler(async () => {
  const response = await fetch(`${process.env.API_BASE_URL}/progress`, {
    method: "GET",
  });
  const responseData = await response.json();
  return responseData;
});
