import axios from "axios";
import {
  createEffect,
  createSignal,
  JSX,
  Match,
  Show,
  Switch,
  For,
} from "solid-js";
import { useNavigate } from "solid-start";
import NavBar from "~/components/NavBar";
import { useContractData, useUserData } from "~/store";
import { Editor } from "~/components/createMonaco";
import { getAccount } from "~/lib/getAccount";

export default function Upload() {
  const navigator = useNavigate();
  const { setContractDetails } = useContractData();

  const [abi, setAbi] = createSignal();
  const [byteCode, setByteCode] = createSignal();
  const [contractName, setContractName] = createSignal();
  const [error, setError] = createSignal([]);
  const [warning, setWarning] = createSignal([]);
  const [args, setArgs] = createSignal("");

  const { account } = useUserData();

  createEffect(async () => {
    if (account() == "") {
      await getAccount();
    }
  });

  const [contract, setContract] = createSignal("//Write Smart Contract Here");

  const handleContractChange = (event: any) => {
    if (typeof event == "string") {
      setContract(() => event);
    }
  };

  const handleDeploy = async (event: Event) => {
    event.preventDefault();

    console.log(args());

    const res = await axios.post(`http://localhost:9789/deploy`, {
      account: account(),
      args: args().split(","),
      bytecode: byteCode(),
      abi: JSON.stringify(abi()),
      contractName: contractName(),
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
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/compile`, {
        solidityCode: contract(),
      })
      .then((res) => {
        console.log(res);
        if (res.data) {
          const { contractName, abi, bytecode, warning } = res.data;
          setContractName(contractName);
          setAbi(abi);
          setByteCode(bytecode);
          setWarning(warning);
        }
      })
      .catch((err) => {
        setError(err.response.data.message);
        console.log(error());
      });
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
                <Show when={warning().length > 0}>{warning()[0]}</Show>
              </div>
              <div class="w-[80%]">
                <Editor
                  class=""
                  value={() => contract()}
                  onChange={handleContractChange}
                  style={{
                    "max-height": "100vh",
                    height: "60vh",
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

                <Switch>
                  <Match
                    when={error().length > 0 && typeof error() !== "string"}
                  >
                    <For each={error()}>
                      {(err) => (
                        <pre class=" text-sm bg-red-600 bg-opacity-30 text-red-500  overflow-scroll">
                          {err}
                        </pre>
                      )}
                    </For>
                  </Match>
                  <Match
                    when={error().length > 0 && typeof error() === "string"}
                  >
                    <pre class=" text-sm bg-red-600 bg-opacity-30 text-red-500  overflow-scroll">
                      {error()}
                    </pre>
                  </Match>
                </Switch>
              </div>
            </div>
          </Match>
          <Match when={abi()}>
            <div class="py-8">Contract Compiled Sucessfully</div>

            {/* TO Display the constructor */}
            {console.log(abi())}

            <Show when={abi().find((el) => el.type == "constructor") != null}>
              {abi()?.find((el) => el.type == "constructor")["inputs"][0].name}
              <input
                type="text"
                placeholder={
                  abi()?.find((el) => el.type == "constructor")["inputs"][0]
                    .type
                }
                onChange={(e) => setArgs(e.currentTarget.value)}
              />
            </Show>
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
