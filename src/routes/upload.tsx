import axios from "axios";
import { createSignal, JSX, Match, Switch } from "solid-js";
import { useNavigate } from "solid-start";
import NavBar from "~/components/NavBar";
import { useContractData, useUserData } from "~/store";

export default function Upload() {

  const navigator = useNavigate()
  const { setContractDetails } = useContractData()

  
  const [abi, setAbi] = createSignal()
  const [byteCode, setByteCode] = createSignal()

  const baseUrl = "http://127.0.0.1:9789"


  const { account } = useUserData()
  const [contract, setContract] = createSignal("");

  const handleContractChange: JSX.EventHandler<HTMLTextAreaElement, Event> = (event) => {
    setContract(() => event.currentTarget.value);
  };

  const handleDeploy = async (event: Event) => {
    event.preventDefault();

    const res = await axios.post(
      `${baseUrl}/deploy`,
      {
        "account": account(),
        "bytecode": byteCode(),
        "abi": JSON.stringify(abi())
      }
    );

    if (res.status == 200) {
      setContractDetails(() => res.data.options)
      navigator("/dashboard")
    }
  };



  const handleCompile = async (event: Event) => {

    // setContractName(()=>pickContractName.exec(contract()))
    event.preventDefault();
    const res = await axios.post(
      `${baseUrl}/compile`,
      {
        "solidityCode": contract()
      }
    );
    if (res.status == 200) {
      if (res.data) {
        setAbi(res.data.abi);
        setByteCode(res.data.bytecode);
      }
    }
  }

  return (
    <main class="flex flex-col items-center">
      <NavBar/>
      <div>Account : {account}</div>
      {/* <input type="text" name="account" onInput={handleAccountChange} value={account()}/> */}
      <Switch>
        <Match when={!abi()}>
          <textarea name="" id="" class="my-4 text-black p-2 w-full max-w-[768px]" rows={20} cols={20} onInput={handleContractChange} value={contract()} placeholder="// Code for smart contract"/>
          <button onClick={handleCompile} class="bg-slate-700 py-2 px-4 rounded-lg">Compile</button>
        </Match>
        <Match when={abi()}>
          <div class="py-8">Contract Compiled Sucessfully</div>
          <button onClick={handleDeploy} class="bg-slate-700 py-2 px-4 rounded-lg">Deploy</button>
        </Match>
      </Switch>
    </main>
  );
}
