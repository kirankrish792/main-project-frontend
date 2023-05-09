import axios from "axios";
import {
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

export default function Dashboard() {
  const navigator = useNavigate();
  const [owned, setOwned] = createSignal<boolean>(true);

  const fetcher = async () => {
    const { account } = useUserData();
    if (account() == "") {
      await getAccount();
    }
    const res = await axios(
      import.meta.env.VITE_BASE_URL + "/users/" + account()
    );
    return res.data;
  };
  const [contractList] = createResource(fetcher);

  const btn = "py-2 px-4 rounded-3xl bg-blue-600 m-2 text-white w-fit";

  return (
    <main class="flex flex-col">
      <NavBar />

      <div class="grid grid-cols-10  min-h-[80vh]">
        <div class=" col-span-3 flex items-center justify-center"> hello</div>
        <div class="col-span-7">
          <div>
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
            <button class=" text-blue-900 bg-blue-400 px-4 py-2 rounded-t-3xl">
              Owned Contracts
            </button>
            <button class=" text-blue-900 bg-blue-400 px-4 py-2 rounded-t-3xl">
              Forked Contracts
            </button>
            <div class="bg-blue-400 p-4">
              <div class=" bg-white">
                <Switch>
                  <Match when={owned()}>
                    <ul>
                      <For each={contractList()?.ownedContracts}>
                        {(contract) => {
                          return (
                            <div class="m-4 bg-blue-200 rounded-lg">
                              <A
                                href={
                                  "/contractInteraction/" +
                                  contract.contractAddress
                                }
                                class="flex"
                              >
                                <button class="p-6">
                                  {contract.contractName}
                                </button>
                              </A>
                            </div>
                          );
                        }}
                      </For>
                    </ul>
                  </Match>
                  <Match when={!owned()}>
                    <ul>
                      <For each={contractList()?.forkedContracts}>
                        {(contract) => {
                          return (
                            <div>
                              <A
                                href={
                                  "/contractInteraction/" +
                                  contract.contractAddress
                                }
                              >
                                <button>{contract.contractName}</button>
                              </A>
                            </div>
                          );
                        }}
                      </For>
                    </ul>
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
