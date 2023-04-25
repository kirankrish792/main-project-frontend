import { useUserData } from "~/store";

export const getAccount = async () => {
  const { setAccount } = useUserData()
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  if (accounts.length > 0) {
    setAccount(accounts[0]);
  }
};