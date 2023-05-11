import axios from "axios";
import {
  Accessor,
  Component,
  For,
  Show,
  createResource,
  createSignal,
} from "solid-js";
import { A, useNavigate } from "solid-start";
import NavBar from "~/components/NavBar";
import { getAccount } from "~/lib/getAccount";
import { useUserData } from "~/store";
import { Contract } from "./dashboard";

const contractList: Component<{}> = () => {
  const { account } = useUserData();

  const fetcher = async () => {
    if (account() == "") {
      await getAccount();
    }
    const res = await axios(import.meta.env.VITE_BASE_URL + "/contracts");
    return res.data;
  };
  const [contractList] = createResource(fetcher);

  return (
    <div class="">
      <NavBar />
      <Show
        when={!contractList.loading}
        fallback={<div>Loading the Contracts...</div>}
      >
        <Show
          when={
            contractList()?.filter((el) => el.owner.accountAddress != account())
              .length > 0
          }
          fallback={<div>No Contracts to fork</div>}
        >
          <div class="flex justify-center my-10 text-3xl text-blue-600 font-bold">
            Contract List
          </div>
          <div class="flex justify-center">
            <RenderContracts
              contractList={contractList().filter(
                (el) => el.owner.accountAddress != account()
              )}
              account={account}
            />
          </div>
        </Show>
      </Show>
    </div>
  );
};

const RenderContracts: Component<{
  contractList: Contract[];
  account: Accessor<string>;
}> = (props) => {
  const navigator = useNavigate();
  const handleFork = (contractAddress: string) => {
    axios
      .post(import.meta.env.VITE_BASE_URL + "/fork", {
        accountAddress: props.account(),
        contractAddress,
      })
      .then((res) => navigator("/dashboard"))
      .catch((err) => alert(err.response.data.message));
  };
  return (
    <div class=" text-blue-600 shadow-2xl p-8 rounded-xl shadow-blue-400">
      <div class="grid grid-cols-4 p-4 font-semibold">
        <div class=" col-span-1">Contract Name</div>
        <div class=" col-span-2 flex justify-center">Contract Address</div>
      </div>
      <div>
        <For each={props.contractList}>
          {(contract) => {
            return (
              <div class="grid grid-cols-4 p-4 items-center">
                <div class=" col-span-1 font-medium text-xl">
                  {contract.contractName}
                </div>
                <div class=" col-span-2">{contract.contractAddress}</div>
                <div class="col-span-1 flex justify-center">
                  <button
                    class=" text-white bg-blue-600 px-6 py-2 rounded-3xl"
                    onClick={() => handleFork(contract.contractAddress)}
                  >
                    Fork
                  </button>
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
};

export default contractList;
