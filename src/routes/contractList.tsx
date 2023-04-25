import axios from "axios";
import { Component, For, Show, createResource, createSignal } from "solid-js";
import { useNavigate } from "solid-start";
import NavBar from "~/components/NavBar";
import { getAccount } from "~/lib/getAccount";
import { useUserData } from "~/store";

const contractList: Component<{}> = () => {
  const { account } = useUserData();
  const navigator = useNavigate();

  const fetcher = async () => {
    if (account() == "") {
      await getAccount();
    }
    const res = await axios(import.meta.env.VITE_BASE_URL + "/contracts");
    return res.data;
  };
  const [contractList] = createResource(fetcher);

  const handleFork = (contractAddress) => {
    axios
      .post(import.meta.env.VITE_BASE_URL + "/fork", {
        accountAddress: account(),
        contractAddress,
      })
      .then((res) => navigator("/dashboard"))
      .catch((err) => alert(err.response.data.message));
  };

  return (
    <div>
      <NavBar />
      <Show
        when={!contractList.loading}
        fallback={<div>Loading the Contracts...</div>}
      >
        <ul>
          <Show
            when={
              contractList()?.filter(
                (el) => el.owner.accountAddress != account()
              ).length > 0
            }
            fallback={<div>No Contracts to fork</div>}
          >
            <For
              each={contractList().filter(
                (el) => el.owner.accountAddress != account()
              )}
            >
              {(contract) => (
                <li class="m-2">
                  {contract.contractName}
                  <button
                    class="px-4 py-2 bg-amber-500 rounded-lg"
                    onClick={() => {
                      handleFork(contract.contractAddress);
                    }}
                  >
                    Fork
                  </button>
                </li>
              )}
            </For>
          </Show>
        </ul>
      </Show>
    </div>
  );
};

export default contractList;
