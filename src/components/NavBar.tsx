export default function NavBar(props) {
  return (
    <nav class="">
      <div class="p-5 flex justify-between">
        <div class=" text-xl font-bold">BaaS</div>
        <div>{props.children}</div>
      </div>
    </nav>
  );
}
