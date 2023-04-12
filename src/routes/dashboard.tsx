import { For, createResource } from "solid-js";
import { A, useNavigate } from "solid-start";
import NavBar from "~/components/NavBar";

export default function Dashboard() {
  const url = new URL("/contractInteraction",location.origin);
  const navigator = useNavigate();
  const fetcher = async () => {
    const res = await fetch("/api/data");
    const data = await res.json();
    return data;
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
              url.searchParams.set("contractAddress", contract.contractAddress);
              return (
                <div>
                  <A href={url.toString()}>
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
