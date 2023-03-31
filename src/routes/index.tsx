import { useNavigate } from "solid-start";
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
      navigator("/upload");
    }
  };

  return (
    <main class="">
      <nav class="flex-1">
        <div class="p-5 flex justify-between">
          <div class=" text-xl font-bold">BaaS</div>
          <button
            class="bg-slate-700 py-2 px-4 rounded-lg"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </nav>
      <div class="flex flex-col items-center my-40">
        <div class=" text-9xl">BaaS</div>
        <div class="text-2xl">Block Chain as a Service</div>
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
