export default defineEventHandler(async () => {
  const response = await fetch("http://34.118.84.225:7860/sdapi/v1/progress", {
    method: "GET",
  });
  const responseData = await response.json();
  return responseData;
});
