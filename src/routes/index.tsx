import NavBar from "~/components/NavBar";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  return (
    <main class="">
      <NavBar/>
      <div class="flex flex-col items-center my-40">
        <div class=" text-9xl">BaaS</div>
        <div class="text-2xl">BlockChain as a Service</div>
        <div class="text-center text-xl py-4">
          <div>Group 2</div>
          <ul>
            <li>Kiran K S</li>
            <li>Nandu Krishna T</li>
            <li>Aleena Reji</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
