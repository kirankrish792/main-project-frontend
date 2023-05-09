import NavBar from "~/components/NavBar";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  return (
    <main class="">
      <NavBar />
      <div class="flex flex-col items-center my-40">
        <div class="text-6xl font-bold max-w-[450px] text-center">
          <span class="text-blue-500">Block</span>chain as a Service
        </div>
        <div class="text-center max-w-[640px] py-4 mx-auto">
          Blockchain-as-a-Service (BaaS) is a type of cloud computing service
          that provides developers and businesses with the ability to create and
          manage their own blockchain networks without having to set up and
          maintain the underlying infrastructure
        </div>
      </div>
      <div class="absolute bottom-0 max-h-[180px]">
        <img class=" object-cover" src="abstract.png" alt="" />
      </div>
    </main>
  );
}
