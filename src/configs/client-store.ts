export function getStore(key: string): any {
  const store =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem(key) || "null")
      : null;
  return store;
}

export function getToken() {
  const store =
    typeof window !== "undefined"
      ? window.localStorage.getItem("tokenCUA68")
      : null;
  return store;
}
export function setStore<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}
