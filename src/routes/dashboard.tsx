import axios from "axios";
import { Component, createSignal, For, JSX, onMount, Show, Switch } from "solid-js";
import { Form } from "solid-start/data/Form";
import { useContractData, useUserData } from "~/store";

import type { ContractData, JsonInterface } from "~/types";

const [output, setOutput] = createSignal("")

interface MethodCall {
  method: string,
  address: string,
  params: string[],
  abi: string,
  contractAddress: string
}

export default function Dashboard() {

  const { contractDetails } = useContractData()
  const { account } = useUserData()

  let inputElements: NodeListOf<HTMLInputElement>;

  onMount(() => {
    inputElements = document.querySelectorAll("input[type='text']")
  })

  const Button: Component<JsonInterface> = (props) => {
    const handleClick: JSX.EventHandler<HTMLButtonElement, Event> = (e) => {
      const obj: MethodCall = {
        method: e.currentTarget.name,
        address: account(),
        params: [],
        abi: JSON.stringify(contractDetails().jsonInterface),
        contractAddress: contractDetails().address
      };

      inputElements.forEach((item) => {
        if (item.name == e.currentTarget.name) {
          obj.params.push(item.value)
          item.value = ""
        }
      })
      handleGet(obj)
    }

    return (
      <div>
        <button onClick={handleClick} name={props.name}>{props.name}</button>
        <Show when={props.inputs.length > 0}>
          <For each={props.inputs}>
            {
              (el, index) => (
                <>
                  <br />
                  <label>
                    {el.name}
                  </label>
                  <input type="text" name={props.name} placeholder={el.type} />
                </>
              )
            }
          </For>
        </Show>
      </div>
    )
  }


  const setterFunctions = contractDetails().jsonInterface.filter((el: JsonInterface) => el.type == "function" && ["nonpayable", "payable"].includes(el.stateMutability))
  const getterFunctions = contractDetails().jsonInterface.filter((el: JsonInterface) => el.type == "function" && ["view", "pure"].includes(el.stateMutability))


  // let categories = contractDetails().jsonInterface.reduce((pre, curr) => ({ ...pre, [curr.name]: [] }), {})

  return (
    <>
      <h2>Contract Address : {contractDetails().address}</h2>
      <hr />
      User Account : {account}
      <h3>Functions</h3>
      <h4>Getter Function</h4>
      <For each={getterFunctions}>
        {
          (item) => (<Button {...item} />)
        }
      </For>
      <h4>Setter Function</h4>
      <For each={setterFunctions}>
        {
          (item) => (<Button {...item} />)
        }
      </For>
      <hr />
      <h3>Output</h3>
      <pre>{JSON.stringify(output(), null, 4)}</pre>
    </>
  )
}

async function handleGet(obj: MethodCall) {


  let res = await axios.post(
    "http://localhost:9789/call", {
    "method": obj.method,
    "address": obj.address,
    "abi": obj.abi,
    "contractAddress": obj.contractAddress,
    "params": obj.params
  })
  setOutput(res.data)
}