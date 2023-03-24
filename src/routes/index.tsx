import { createSignal, onMount } from "solid-js";
import { useNavigate } from "solid-start";
import { useUserData } from "~/store";

// export const [userAccount, setUserAccount] = createSignal<string>("")

export default function Home() {

  const navigator = useNavigate()

  const {account,setAccount} = useUserData()

  onMount(()=>setAccount("0xad772a97E1d41C24B88c46B462D2970F438b02ee"))

  return (
    <main>
      <div>Account : {account()}</div>
      {/* <input type="text" onInput={(e) => setUserAccount(e.currentTarget.value)} value={userAccount()} /> */}
      <button onClick={() => navigator("/upload")}>Login</button>
    </main>
  )


}