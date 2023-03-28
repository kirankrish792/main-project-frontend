import axios from "axios";
import { Component, createSignal, For, onMount, Show, Switch } from "solid-js";
import { Form } from "solid-start/data/Form";
import { useContractData, useUserData } from "~/store";

import type { ContractData, JsonInterface } from "~/types";

// const [address, setAddress] = createSignal("")
const [values, setValues] = createSignal<string[]>([]);
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
  // const [contractDetails, setContractDetails] = createSignal({
  //   "address": "0xE5d90332D5CFFb58c022fC89A7C75DB2106a8e2c",
  //   "jsonInterface": [
  //     {
  //       "inputs": [
  //         {
  //           "internalType": "address",
  //           "name": "",
  //           "type": "address"
  //         }
  //       ],
  //       "name": "balances",
  //       "outputs": [
  //         {
  //           "internalType": "uint256",
  //           "name": "totalBalance",
  //           "type": "uint256"
  //         },
  //         {
  //           "internalType": "uint256",
  //           "name": "numDeposits",
  //           "type": "uint256"
  //         },
  //         {
  //           "internalType": "uint256",
  //           "name": "numWithdrawals",
  //           "type": "uint256"
  //         }
  //       ],
  //       "stateMutability": "view",
  //       "type": "function",
  //       "constant": true,
  //       "signature": "0x27e235e3"
  //     },
  //     {
  //       "inputs": [],
  //       "name": "depositeMoney",
  //       "outputs": [],
  //       "stateMutability": "payable",
  //       "type": "function",
  //       "payable": true,
  //       "signature": "0x3f925f7a"
  //     },
  //     {
  //       "inputs": [
  //         {
  //           "internalType": "address payable",
  //           "name": "_to",
  //           "type": "address"
  //         },
  //         {
  //           "internalType": "uint256",
  //           "name": "_amount",
  //           "type": "uint256"
  //         }
  //       ],
  //       "name": "withdrawMoney",
  //       "outputs": [],
  //       "stateMutability": "nonpayable",
  //       "type": "function",
  //       "signature": "0xf274c897"
  //     }
  //   ]
  // })



  let inputElements: NodeListOf<HTMLInputElement>;

  onMount(() => {
    inputElements = document.querySelectorAll("input[type='text']")
  })

  const Button: Component<JsonInterface> = (props) => {
    const handleClick = (e) => {
      const obj: MethodCall = {
        method: [e.target.name] as unknown as string,
        address: "",
        params: [],
        abi: "",
        contractAddress: ""
      };

      obj.method = e.target.name
      obj.address = account()
      obj.abi = JSON.stringify(contractDetails().jsonInterface)
      obj.contractAddress = contractDetails().address



      inputElements.forEach((el) => {
        if (el.name == e.target.name) {
          obj.params.push(el.value)
          el.value = ""
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
                  <input type="text" name={props.name} placeholder={el.type} onInput={(e) => handleChange(index(), e)} />
                </>
              )
            }
          </For>
        </Show>
      </div>
    )
  }


  const setterFunctions = contractDetails().jsonInterface.filter((el) => el.type == "function" && ["nonpayable", "payable"].includes(el.stateMutability))
  const getterFunctions = contractDetails().jsonInterface.filter((el) => el.type == "function" && ["view", "pure"].includes(el.stateMutability))


  // let categories = contractDetails().jsonInterface.reduce((pre, curr) => ({ ...pre, [curr.name]: [] }), {})

  return (
    <>
      <h2>Contract Address : {contractDetails().address}</h2>
      <hr />
      {account}
      {/* <div>Address : <input type="text" onInput={(e) => setAddress(e.currentTarget.value)} value={address()} /></div> */}
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
      <div>{JSON.stringify(output())}</div>
      <div>{values()!.toString()}</div>
    </>
  )
}




function handleChange(index: number, event: Event & { currentTarget: HTMLInputElement }) {
  const newValues = [...values()!];
  newValues[index] = event.currentTarget.value;
  setValues(newValues);
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

  console.log(res)
  setOutput(res.data)
}