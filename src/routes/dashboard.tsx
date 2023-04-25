import axios from "axios";
import { For, Show, createResource } from "solid-js";
import { A, useNavigate } from "solid-start";
import NavBar from "~/components/NavBar";
import { getAccount } from "~/lib/getAccount";
import { useUserData } from "~/store";

export default function Dashboard() {
  const navigator = useNavigate();

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

  const btn = "py-2 px-4 rounded-lg bg-blue-600 m-2 text-white w-fit";

  return (
    <main class="flex flex-col">
      <NavBar />
      <div class="flex justify-center flex-col">
        <A href="/upload">
          <button class={btn}>New Contract</button>
        </A>
        <A href="/contractList">
          <button class={btn}>Add Contract</button>
        </A>
        <Show
          when={!contractList.loading}
          fallback={<div>Loading the Contracts ...</div>}
        >
          <h2>Owned</h2>
          <ul>
            <For each={contractList()?.ownedContracts}>
              {(contract) => {
                return (
                  <div class="m-4 bg-blue-200 rounded-lg">
                    <A
                      href={"/contractInteraction/" + contract.contractAddress}
                      class="flex"
                    >
                      <button class="p-6">{contract.contractName}</button>
                    </A>
                  </div>
                );
              }}
            </For>
          </ul>
          <h2>Forked</h2>
          <ul>
            <For each={contractList()?.forkedContracts}>
              {(contract) => {
                return (
                  <div>
                    <A
                      href={"/contractInteraction/" + contract.contractAddress}
                    >
                      <button>{contract.contractName}</button>
                    </A>
                  </div>
                );
              }}
            </For>
          </ul>
        </Show>
      </div>
    </main>
  );
}
