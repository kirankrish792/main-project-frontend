import { useNavigate } from "solid-start";
import NavBar from "~/components/NavBar";
import { useUserData } from "~/store";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  const navigator = useNavigate();

  const { setAccount } = useUserData();

  const handleLogin = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      navigator("/dashboard");
    }
  };

  return (
    <main class="">
      <NavBar>
        <button class="bg-slate-700 py-2 px-4 rounded-lg" onClick={handleLogin}>
          Login
        </button>
      </NavBar>
      <div class="flex flex-col items-center my-40">
        <div class=" text-9xl">BaaS</div>
        <div class="text-2xl">BlockChain as a Service</div>
        <div class="text-center text-xl py-4">
          <div>Group 2</div>
          <ul>
            <li>Kiran K S</li>
            <li>Nandu Krishna T</li>
            <li>Aleena Reji</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
