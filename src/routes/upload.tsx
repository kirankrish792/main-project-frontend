import axios from "axios";
import { createSignal, JSX, Match, Switch } from "solid-js";
import { useNavigate } from "solid-start";
import NavBar from "~/components/NavBar";
import { useContractData, useUserData } from "~/store";
import { Editor } from "~/components/createMonaco";

export default function Upload() {
  const navigator = useNavigate();
  const { setContractDetails } = useContractData();

  const [abi, setAbi] = createSignal();
  const [byteCode, setByteCode] = createSignal();
  const [contractName, setContractName] = createSignal();

  const { account } = useUserData();

  const [contract, setContract] = createSignal("//Write Smart Contract Here");

  const handleContractChange = (event: any) => {
    if (typeof event == "string") {
      setContract(() => event);
    }
  };

  const handleDeploy = async (event: Event) => {
    event.preventDefault();

    console.log(account(),contractName(),abi())

    const res = await axios.post(`http://localhost:9789/deploy`, {
      account: account(),
      bytecode: byteCode(),
      abi: JSON.stringify(abi()),
      contractName:contractName()
    });

    if (res.status == 200) {
      setContractDetails(() => ({
        ...res.data.options,
        contractName: contractName(),
      }));
      navigator("/contractInteraction");
    }
  };

  const handleCompile = async (event: Event) => {
    // setContractName(()=>pickContractName.exec(contract()))
    event.preventDefault();
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/compile`, {
      solidityCode: contract(),
    });
    if (res.status == 200) {
      if (res.data) {
        setContractName(res.data.contractName);
        setAbi(res.data.abi);
        setByteCode(res.data.bytecode);
      }
    }
  };

  return (
    <main class="">
      <NavBar />
      <div class="p-4">
        <div>Account : {account}</div>
        <Switch>
          <Match when={!abi()}>
            <div class="flex">
              <div class="w-[20%]">
                <button
                  onClick={handleCompile}
                  class="bg-slate-700 py-2 px-4 rounded-lg"
                >
                  Compile
                </button>
              </div>
              <div class="w-[80%]">
                <Editor
                  class=""
                  value={() => contract()}
                  onChange={handleContractChange}
                  style={{
                    "max-height": "100vh",
                    height: "80vh",
                    width: "100%",
                    border: "solid grey 2px",
                  }}
                  options={{
                    theme: "vs",
                    language: "sol",
                    minimap: {
                      enabled: false,
                    },
                  }}
                />
              </div>
            </div>
          </Match>
          <Match when={abi()}>
            <div class="py-8">Contract Compiled Sucessfully</div>
            <button
              onClick={handleDeploy}
              class="bg-slate-700 py-2 px-4 rounded-lg"
            >
              Deploy
            </button>
          </Match>
        </Switch>
      </div>
    </main>
  );
}
