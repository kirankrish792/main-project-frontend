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
    <nav class="">
      <div class="p-5 flex justify-between">
        <div class=" text-xl font-bold">
          <a href="/">Baas</a>
        </div>
        <div>
          <A href="/apiRegister"><button>API</button></A>
          <button
            class=" bg-blue-600 text-white py-2 px-4 rounded-lg"
            onClick={handleLogin}
            hidden={location === "/dashboard"}
          >
            Dashboard
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
