import axios from "axios";
import { Component, createSignal, For, onMount } from "solid-js"
import { useContractData, useUserData } from "~/store";

import type { ContractData,JsonInterface } from "~/types"

const [address, setAddress] = createSignal("")
const [values, setValues] = createSignal<string[]>([]);
const [output, setOutput] = createSignal("")

export default function Dashboard() {
  const { account } = useUserData()

  const { contractDetails } = useContractData()

  return (
    <>
      <h2>Contract Address : {contractDetails().address}</h2>
      <hr />
      {account}
      <div>Address : <input type="text" onInput={(e) => setAddress(e.currentTarget.value)} value={address()} /></div>
      <h3>Functions</h3>
      <For each={contractDetails().jsonInterface}>
        {
          (item) => (<Button {...item} />)
        }
      </For>
      <hr />
      <h3>Output</h3>
      <div>{JSON.stringify(output())}</div>
      <div>{values()!.toString()}</div>
    </>
  )
}

const Button: Component<JsonInterface> = (props) => {
  if (props.inputs.length > 0) {
    return (
      <div>
        <button>{props.name}</button>
        <For each={props.inputs}>
          {
            (el, index) => (
              <>
                <input type="text" placeholder={[el.type, el.name].join(" ")} onInput={(e) => handleChange(index(), e)} />
              </>
            )
          }
        </For>
      </div>
    )
  }
  return (
    <button>{props.name}</button>

  )
}



function handleChange(index: number, event: Event & { currentTarget: HTMLInputElement }) {
  const newValues = [...values()!];
  newValues[index] = event.currentTarget.value;
  setValues(newValues);
}

// async function handleGet() {
//   let res = await axios.post(
//     "http://localhost:9789/call", {
//     "method": "retrieve",
//     "address": address(),
//     "params[]": ""
//   }
//   )
//   console.log(res)
//   setOutput(res.data)
// }