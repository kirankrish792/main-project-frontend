import { useNavigate } from "solid-start";
import { useUserData } from "~/store";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {

  const navigator = useNavigate()

  const { setAccount } = useUserData()

  const handleLogin = async () => {

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    if (accounts.length > 0) {
      setAccount(accounts[0])
      navigator("/upload")
    }
  }

  return (
    <main>
      <button onClick={handleLogin}>Login</button>
    </main>
  )
}