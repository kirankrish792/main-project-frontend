import axios from "axios";
import { createSignal, JSX, Match, Show, Switch } from "solid-js";
import { useNavigate } from "solid-start";
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
    <main>
      <div>Account : {account}</div>
      {/* <input type="text" name="account" onInput={handleAccountChange} value={account()}/> */}
      <Switch>
        <Match when={!abi()}>
          <textarea name="" id="" cols="30" rows="10" onInput={handleContractChange} value={contract()} />
          <button onClick={handleCompile}>Compile</button>
        </Match>
        <Match when={abi()}>
          <div>Contract Compiled Sucessfully</div>
          <button onClick={handleDeploy}>Deploy</button>
        </Match>
      </Switch>
    </main>
  );
}
