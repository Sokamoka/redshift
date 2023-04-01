export function generateRandomInt(maxLimit = 1000000000000000) {
  let rand = Math.random() * maxLimit;
  rand = Math.floor(rand);
  return rand;
}
