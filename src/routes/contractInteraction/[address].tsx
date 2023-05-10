import axios from "axios";
import {
  Component,
  createResource,
  createSignal,
  For,
  JSX,
  onMount,
  Resource,
  Show,
} from "solid-js";
import { useParams } from "solid-start";
import NavBar from "~/components/NavBar";
import { getAccount } from "~/lib/getAccount";
import { useUserData } from "~/store";

import type { ContractData, JsonInterface } from "~/types";

const [output, setOutput] = createSignal("");

interface MethodCall {
  method: string;
  address: string;
  params: string[];
  abi: string;
  contractAddress: string;
}

interface Contract {
  contractName: string;
  abi: JsonInterface[];
  contractAddress: string;
  owner: {
    accountAddress: string;
    ownedContracts: string[];
    forkedContracts: string[];
  };
}

export default function Wrapper() {
  const { address } = useParams();
  const { account } = useUserData();

  const fetcher = async () => {
    if (account() == "") {
      await getAccount();
    }
    const res = await axios(
      import.meta.env.VITE_BASE_URL + "/contracts/" + address
    );
    return res.data;
  };
  const [contractDetails] = createResource<Contract>(fetcher);

  return (
    <Show when={!contractDetails.loading} fallback={<div>Loading...</div>}>
      <ContractInteraction contract={contractDetails} />
    </Show>
  );
}

const ContractInteraction: Component<{ contract: Resource<Contract> }> = (
  props
) => {
  // const { contractDetails } = useContractData();
  const { contract } = props;
  console.log(contract());

  const { account } = useUserData();

  let inputElements: NodeListOf<HTMLInputElement>;

  onMount(() => {
    inputElements = document.querySelectorAll("input[type='text']");
  });

  const Button: Component<any> = (props) => {
    const handleClick: JSX.EventHandler<HTMLButtonElement, Event> = (e) => {
      const obj: MethodCall = {
        method: e.currentTarget.name,
        address: account(),
        params: [],
        abi: JSON.stringify(contract()!.abi),
        contractAddress: contract()!.contractAddress,
      };

      inputElements.forEach((item) => {
        if (item.name == e.currentTarget.name) {
          obj.params.push(item.value);
          item.value = "";
        }
      });
      handleGet(obj);
    };

    return (
      <div>
        <button
          onClick={handleClick}
          name={props.name}
          class={`${
            props.func == "getter" ? " bg-emerald-700" : " bg-orange-600"
          } rounded-lg px-4 py-2 my-2`}
        >
          {props.name}
        </button>
        <Show when={props.inputs.length > 0}>
          <For each={props.inputs}>
            {(el) => (
              <div class="px-4">
                <label>{el.name}</label>
                <input
                  type="text"
                  name={props.name}
                  placeholder={el.type}
                  class=" px-1 m-2 py-3 bg-gray-800 rounded-lg"
                />
              </div>
            )}
          </For>
        </Show>
      </div>
    );
  };

  console.log(contract()!.abi);

  const setterFunctions = contract()!.abi.filter(
    (el: JsonInterface) =>
      el.type == "function" &&
      ["nonpayable", "payable"].includes(el.stateMutability)
  );
  const getterFunctions = contract()!.abi.filter(
    (el: JsonInterface) =>
      el.type == "function" && ["view", "pure"].includes(el.stateMutability)
  );

  console.log(props["contract"]());

  return (
    <main>
      <NavBar />
      <div class="font-bold text-2xl">
        <div>
          <div>Contract Name:{props["contract"]()!.contractName}</div>
        </div>
        <div>Contract Address : {props["contract"]()!.contractAddress}</div>
      </div>
      <div class=" lg:flex">
        <div class="p-4">
          <div class="font-bold text-xl py-4">
            <div>User Account : {account}</div>
          </div>
          <h3 class="text-lg font-bold">Functions</h3>
          <div class="my-4">
            <h4>Getter Function</h4>
            <For each={getterFunctions}>
              {(item) => <Button {...item} func="getter" />}
            </For>
          </div>
          <div class="my-4">
            <h4>Setter Function</h4>
            <For each={setterFunctions}>
              {(item) => <Button {...item} func="setter" />}
            </For>
          </div>
          <hr />
        </div>
        <div class=" border w-full m-4 p-4 overflow-scroll">
          <h3 class="text-xl py-4 font-bold">Output</h3>
          <pre>{JSON.stringify(output(), null, 4)}</pre>
        </div>
      </div>
    </main>
  );
};

async function handleGet(obj: MethodCall) {
  let res = await axios.post("http://localhost:9789/call", {
    method: obj.method,
    address: obj.address,
    abi: obj.abi,
    contractAddress: obj.contractAddress,
    params: obj.params,
  });
  setOutput(res.data);
}
