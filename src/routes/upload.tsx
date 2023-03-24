import axios from "axios";
import { createSignal, JSX } from "solid-js";
import { useNavigate } from "solid-start";
import { useContractData, useUserData } from "~/store";

export default function Upload() {

  const navigator = useNavigate()
  const {setContractDetails} = useContractData()

  const baseUrl = "http://127.0.0.1:9789"


  const { account } = useUserData()
  const [contract, setContract] = createSignal("");

  // const handleAccountChange: JSX.EventHandler<HTMLInputElement, Event> = (event) => {
  //   setAccount(() => event.currentTarget.value);
  // };

  const handleContractChange: JSX.EventHandler<HTMLTextAreaElement, Event> = (event) => {
    setContract(() => event.currentTarget.value);
  };

  const handleSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = async (event) => {
    event.preventDefault();

    const res = await axios.post(
      `${baseUrl}/deploy`,
      {
        "account": account(),
        "solidity": contract()
      }
    );



    if (res.status == 200) {
      setContractDetails(()=>res.data.options)
      navigator("/dashboard")
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <div>Account : {account}</div>
        {/* <input type="text" name="account" onInput={handleAccountChange} value={account()}/> */}
        <textarea name="" id="" cols="30" rows="10" onInput={handleContractChange} value={contract()} />
        <button type="submit">Deploy</button>
      </form>
    </main>
  );
}
