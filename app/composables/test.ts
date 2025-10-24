export const useTest = () => {
  const nuxtApp = useNuxtApp();
  const bar = useFoo();
};

export const useHello = () => {
  const nuxtApp = useNuxtApp();
  return nuxtApp.$hello;
};
