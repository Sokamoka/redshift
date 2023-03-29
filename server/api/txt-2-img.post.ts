export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  const response = await fetch(`${process.env.API_BASE_URL}/txt2img`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  return responseData;
});
