import axios from "axios";
import { For, createResource } from "solid-js";
import { A, useNavigate } from "solid-start";
import NavBar from "~/components/NavBar";

export default function Dashboard() {
  const navigator = useNavigate();
  const fetcher = async () => {
    const res = await axios(import.meta.env.VITE_BASE_URL + "/contracts");
    return res.data;
  };
  const [contractList] = createResource(fetcher);

  const btn = "py-2 px-4 rounded-lg bg-blue-600 m-2 text-white w-fit";

  return (
    <main class="flex flex-col">
      <NavBar />
      <div class="flex justify-center flex-col">
        <button class={btn} onclick={() => navigator("/upload")}>
          New Contract
        </button>
        <button class={btn}>Add Contract</button>
        <ul>
          <For each={contractList()}>
            {(contract) => {
              return (
                <div>
                  <A href={"/contractInteraction/" + contract.contractAddress}>
                    <button>{contract.contractName}</button>
                  </A>
                </div>
              );
            }}
          </For>
        </ul>
      </div>
    </main>
  );
}
