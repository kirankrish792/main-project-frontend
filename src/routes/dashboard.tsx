import axios from "axios";
import {
  Component,
  For,
  Match,
  Show,
  Switch,
  createResource,
  createSignal,
} from "solid-js";
import { A, useNavigate } from "solid-start";
import NavBar from "~/components/NavBar";
import { getAccount } from "~/lib/getAccount";
import { useUserData } from "~/store";

import { JsonInterface } from "~/types";

export interface ContractList {
  accountAddress: string;
  ownedContracts: Contract[];
  forkedContracts: Contract[];
}

export interface Contract {
  _id: string;
  contractName: string;
  abi: JsonInterface;
  contractAddress: string;
  owner: string;
  __v?: number;
}

export default function Dashboard() {
  const navigator = useNavigate();
  const [owned, setOwned] = createSignal<boolean>(true);

  const fetcher = async (): Promise<ContractList> => {
    const { account } = useUserData();
    if (account() == "") {
      await getAccount();
    }
    const res = await axios(
      import.meta.env.VITE_BASE_URL + "/users/" + account()
    );
    console.log(res.data);
    return res.data;
  };
  const [contractList] = createResource(fetcher);

  const btn =
    "py-2 px-4 rounded-3xl bg-blue-600 m-2 text-white w-fit drop-shadow-lg";

  return (
    <main class="flex flex-col">
      <NavBar />

      <div class="grid grid-cols-10  min-h-[80vh]">
        <div class=" col-span-3 flex items-center justify-center">
          <div>
            <Show when={!contractList.loading}>
              <div class=" text-center">
                <div class=" w-[200px] h-[200px] bg-blue-400 drop-shadow-lg p-1 rounded-full">
                  <div class="w-full h-full bg-white rounded-full">
                    <img
                      src="https://xsgames.co/randomusers/avatar.php?g=pixel"
                      alt=""
                      class=" w-full h-full rounded-full"
                    />
                  </div>
                </div>
                <div class="my-10">
                  <div>
                    User :{" "}
                    {contractList()?.accountAddress.substring(0, 6) +
                      "..." +
                      contractList()?.accountAddress.substring(
                        contractList()?.accountAddress.length! - 6,
                        contractList()?.accountAddress.length!
                      )}
                  </div>
                </div>
                <div>Status</div>

                <div>
                  Total Contracts :{" "}
                  {contractList()?.forkedContracts.length! +
                    contractList()?.ownedContracts.length!}
                </div>
                <div>
                  Owned Contracts : {contractList()?.ownedContracts.length!}
                </div>
                <div>
                  Forked Contracts : {contractList()?.forkedContracts.length!}
                </div>
              </div>
            </Show>
          </div>
        </div>

        <div class="col-span-7 p-4">
          <div class="my-10">
            <A href="/upload">
              <button class={btn}>New Contract</button>
            </A>
            <A href="/contractList">
              <button class={btn}>Add Contract</button>
            </A>
          </div>
          <Show
            when={!contractList.loading}
            fallback={<div>Loading the Contracts ...</div>}
          >
            <div class="mt-4">
              <button
                class={`text-blue-600 font-medium ${
                  owned() ? "bg-blue-100" : ""
                } px-4 py-2 rounded-t-lg`}
                onClick={() => setOwned(true)}
              >
                Owned Contracts
              </button>
              <button
                class={`text-blue-600 font-medium ${
                  !owned() ? "bg-blue-100" : ""
                } px-4 py-2 rounded-t-lg`}
                onClick={() => setOwned(false)}
              >
                Forked Contracts
              </button>
            </div>
            <div class="bg-blue-100 p-4 rounded-r-lg rounded-b-lg rounded-bl-lg">
              <div class=" bg-white rounded-xl min-h-[50vh]">
                <Switch>
                  <Match when={owned()}>
                    <RenderContracts
                      contractList={contractList()?.ownedContracts!}
                    />
                  </Match>
                  <Match when={!owned()}>
                    <RenderContracts
                      contractList={contractList()?.forkedContracts!}
                    />
                  </Match>
                </Switch>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </main>
  );
}

const RenderContracts: Component<{ contractList: Contract[] }> = (props) => {
  return (
    <div class=" text-blue-600">
      <div class="grid grid-cols-4 p-4 font-semibold">
        <div class=" col-span-1">Contract Name</div>
        <div class=" col-span-2">Contract Address</div>
      </div>
      <div>
        <For each={props.contractList}>
          {(contract) => {
            return (
              <div class="grid grid-cols-4 p-4 items-center">
                <div class=" col-span-1">{contract.contractName}</div>
                <div class=" col-span-2">{contract.contractAddress}</div>
                <div class=" col-span-1">
                  <A href={"/contractInteraction/" + contract.contractAddress}>
                    <button class=" text-white bg-blue-600 px-6 py-2 rounded-3xl">
                      Open
                    </button>
                  </A>
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
};
