export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  const response = await fetch("http://34.118.84.225:7860/sdapi/v1/txt2img", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  return responseData;
});
