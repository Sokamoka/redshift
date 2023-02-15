export default defineNuxtRouteMiddleware((to, from) => {
  const isAuthenticated = useLogin();
  if (!isAuthenticated.value) {
    return navigateTo("/login");
  }
});
