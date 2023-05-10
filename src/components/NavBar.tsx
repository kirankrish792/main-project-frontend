import axios from "axios";
import { ParentComponent } from "solid-js";
import { useNavigate, useLocation, A } from "solid-start";
import { useUserData } from "~/store";

const NavBar: ParentComponent = (props) => {
  const navigator = useNavigate();
  const location = useLocation().pathname;

  const { account, setAccount } = useUserData();

  async function login(address: string) {
    let res = await axios.post(`${import.meta.env.VITE_BASE_URL}/userLoggin`, {
      address,
    });
    if (res.data.login) {
      navigator("/dashboard");
    }
  }

  const handleLogin = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length > 0) {
      setAccount(accounts[0]);
      login(account());
    }
  };
  return (
    <nav class=" text-blue-500">
      <div class="p-5 flex justify-between">
        <div class=" text-xl font-bold flex items-center">
          <a href="/">ChainCloud</a>
        </div>
        <div class="flex items-center">
          <A href="/apiRegister">
            <button class=" font-semibold mx-4">API</button>
          </A>
          <button
            class="flex items-center bg-blue-600 text-white py-2 px-4 rounded-3xl mx-4"
            onClick={handleLogin}
            hidden={location === "/dashboard"}
          >
            Dashboard
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4 m-1"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class=" h-[2px] bg-gradient-to-r from-white to-blue-50 via-blue-500"></div>
    </nav>
  );
};

export default NavBar;
