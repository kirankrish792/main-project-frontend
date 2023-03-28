import axios from "axios";
import { createSignal, JSX, Show } from "solid-js";
import { useNavigate } from "solid-start";
import { useContractData, useUserData } from "~/store";

export default function Upload() {

  const navigator = useNavigate()
  const { setContractDetails } = useContractData()


  const [abi, setAbi] = createSignal()
  const [byteCode, setByteCode] = createSignal()
  const [error, setError] = createSignal()

  const baseUrl = "http://127.0.0.1:9789"


  const { account } = useUserData()
  const [contract, setContract] = createSignal("");

  // const handleAccountChange: JSX.EventHandler<HTMLInputElement, Event> = (event) => {
  //   setAccount(() => event.currentTarget.value);
  // };

  const handleContractChange: JSX.EventHandler<HTMLTextAreaElement, Event> = (event) => {
    setContract(() => event.currentTarget.value);
  };

  const handleDeploy = async (event) => {
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



  const handleCompile = async (event) => {
    event.preventDefault();
    const res = await axios.post(
      `${baseUrl}/compile`,
      {
        "solidityCode": contract()
      }
    );
    if (res.status == 200) {
      if (res.data) {
        console.log(res.data)
        setAbi(res.data.abi);
        setByteCode(res.data.bytecode);
      }
    }
    else {
      console.log(res)
      setError(res)
    }
  }

  return (
    <main>
      <div>Account : {account}</div>
      {/* <input type="text" name="account" onInput={handleAccountChange} value={account()}/> */}
      <textarea name="" id="" cols="30" rows="10" onInput={handleContractChange} value={contract()} />
      <button onClick={handleCompile}>Compile</button>

      <Show when={abi()}>
        <button onClick={handleDeploy}>Deploy</button>
      </Show>

      <div>
        {error()}
      </div>
    </main>
  );
}
