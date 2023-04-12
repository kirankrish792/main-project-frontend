import axios from "axios";
import { Component, createResource, createSignal, For, JSX, onMount, Show } from "solid-js";
import { json, useParams, useSearchParams } from "solid-start";
import NavBar from "~/components/NavBar";
import { useContractData, useUserData } from "~/store";

import type { JsonInterface } from "~/types";

const [output, setOutput] = createSignal("");

interface MethodCall {
  method: string;
  address: string;
  params: string[];
  abi: string;
  contractAddress: string;
}

export default function ContractInteraction() {
  const { address } = useParams();

  const fetcher = async () => {
    const res = await axios(
      import.meta.env.VITE_BASE_URL + "/contracts/" + address
    );
    console.log(res.data)
    return res.data;
  };
  const [contractDetails] = createResource(fetcher);

  // const { contractDetails } = useContractData();
  const { account } = useUserData();

  let inputElements: NodeListOf<HTMLInputElement>;

  onMount(() => {
    inputElements = document.querySelectorAll("input[type='text']");
  });

  

  const Button: Component<JsonInterface & { func: string }> = (props) => {
    const handleClick: JSX.EventHandler<HTMLButtonElement, Event> = (e) => {
      const obj: MethodCall = {
        method: e.currentTarget.name,
        address: account(),
        params: [],
        abi: contractDetails.abi,
        contractAddress: contractDetails.address,
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

  const ABI = JSON.parse(contractDetails.abi)

  const setterFunctions = ABI.filter(
    (el: JsonInterface) =>
      el.type == "function" &&
      ["nonpayable", "payable"].includes(el.stateMutability)
  );
  const getterFunctions = ABI.filter(
    (el: JsonInterface) =>
      el.type == "function" && ["view", "pure"].includes(el.stateMutability)
  );

  // let categories = contractDetails().jsonInterface.reduce((pre, curr) => ({ ...pre, [curr.name]: [] }), {})

  console.log(contractDetails());

  return (
    <main>
      <NavBar />
      <div class="font-bold text-2xl">
        <div>
          <div>Contract Name:{contractDetails.contractName}</div>
        </div>
        <div>Contract Address : {contractDetails.address}</div>
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
}

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
