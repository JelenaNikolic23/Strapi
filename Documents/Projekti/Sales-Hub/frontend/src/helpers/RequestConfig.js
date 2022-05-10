export default function request_config() {
  // Provide token
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: "Bearer " + token
    }
  };
}
