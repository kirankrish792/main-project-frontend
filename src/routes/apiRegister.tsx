import axios from "axios";
import { Component, Show, createEffect, createSignal } from "solid-js";
import NavBar from "~/components/NavBar";
import { getAccount } from "~/lib/getAccount";
import { useUserData } from "~/store";
import { Permission, Role } from "~/types";
const ApiRegister: Component<{}> = (props) => {
  const { account } = useUserData();

  const [role, setRole] = createSignal("");
  const [permission, setPermission] = createSignal("");
  const [expire, setExpire] = createSignal("");
  const [out, setOut] = createSignal("");

  if (account() == "") {
    getAccount();
  }

  createEffect(() => {
    if (role() == Role.admin) {
      setPermission(Permission.all);
    }
  });

  async function handleSubmit() {
    if (role() != "" && permission() != "" && expire() != "") {
      let res = await axios.post(
        import.meta.env.VITE_BASE_URL + "/api/v1/" + account(),
        {
          role: role(),
          permissions: permission(),
          expiresIn: expire(),
        }
      );
      console.log(res.data);
      setOut(res.data.api_key);
    } else {
      alert("Select Inputs");
    }
  }

  return (
    <main class=" w-screen h-screen ">
      <NavBar />
      <div class="w-full h-3/4 grid grid-cols-3  place-content-center place-items-center">
        <div class="w-[360px] shadow-blue-200 shadow-xl border-blue-500 p-10 rounded-xl">
          <div class="text-center font-medium text-lg">Register API KEY</div>
          <div class=" my-10">
            <div>Role</div>
            <div class=" grid grid-cols-3 my-2">
              <div>
                <input
                  type="radio"
                  name="role"
                  id={Role.admin}
                  onChange={() => setRole(Role.admin)}
                />
                <label for={Role.admin}>Admin</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="role"
                  id={Role.user}
                  onChange={() => setRole(Role.user)}
                />
                <label for="user">User</label>
              </div>
            </div>
          </div>
          <Show when={role() != Role.admin}>
            <div class=" my-10">
              <div class="">Permission</div>
              <hr />
              <div class=" grid grid-cols-3 my-2">
                <div>
                  <input
                    type="radio"
                    name="permission"
                    id="all"
                    onChange={() => setPermission(Permission.all)}
                  />
                  <label for="all">All</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="permission"
                    id="read"
                    onChange={() => setPermission(Permission.read)}
                  />
                  <label for="read">Read</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="permission"
                    id="write"
                    onChange={() => setPermission(Permission.write)}
                  />
                  <label for="write">Write</label>
                </div>
              </div>
            </div>
          </Show>
          <div class=" my-10">
            Expires In
            <hr />
            <div class=" grid grid-cols-3 my-2">
              <div>
                <input
                  type="radio"
                  name="expire"
                  id="30"
                  onChange={() => setExpire("30d")}
                />
                <label for="30">30 days</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="expire"
                  id="60"
                  onChange={() => setExpire("60d")}
                />
                <label for="60">60 days</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="expire"
                  id="90"
                  onChange={() => setExpire("90d")}
                />
                <label for="90">90 days</label>
              </div>
            </div>
          </div>

          <div class="flex justify-center">
            <button
              class="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>

        <Show
          when={out()}
          fallback={
            <div class=" text-gray-900 text-xl font-bold col-span-2">
              Your API Key
            </div>
          }
        >
          <div class="flex flex-col items-center col-span-2">
            <div class=" text-gray-900 text-xl font-bold">Your API Key</div>
            <div
              class="mx-4 max-w-[540px] text-justify p-4"
              style={{ "overflow-wrap": "break-word" }}
            >
              {out()}
            </div>
          </div>
        </Show>
      </div>
    </main>
  );
};

export default ApiRegister;
