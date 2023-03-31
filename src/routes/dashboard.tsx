import { useNavigate } from "solid-start";
import NavBar from "~/components/NavBar";

export default function Dashboard() {

  const navigator = useNavigate()

  return (
    <main class="flex flex-col">
      <NavBar />
      <div class="flex justify-center items-center">
        <button class="py-2 px-4 rounded-lg bg-blue-600" onclick={()=>navigator("/upload")}>New Contract</button>
      </div>
    </main>
  );
}
