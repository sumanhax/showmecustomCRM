import { useNavigate } from "react-router-dom";

const UserRedirectPage = () => {
  const nevigate = useNavigate();
  const token = localStorage.getItem("ecomToken");
  console.log("Token", token);

  if (token) {
    const userAppUrl = "http://localhost:5173";
    window.location.href = `${userAppUrl}/dashboard`;
  }
  return (
    <>
      <h1>Loading...</h1>
    </>
  );
};
export default UserRedirectPage;
