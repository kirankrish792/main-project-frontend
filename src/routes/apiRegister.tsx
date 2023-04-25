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
    <main>
      <NavBar />
      <div>
        <div>
          Role
          <hr />
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
        <Show when={role() != Role.admin}>
          <div>
            <div class="">Permission</div>
            <hr />
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
        </Show>
        <div>
          Lifetime
          <hr />
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

        <button
          class="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-500"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <Show when={out()}>
        <div>API Key</div>
        <div class="mx-4" style={{ "word-wrap": "break-word" }}>
          {out()}
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(out() || "");
            alert("copied");
          }}
        >
          Copy
        </button>
      </Show>
    </main>
  );
};

export default ApiRegister;
