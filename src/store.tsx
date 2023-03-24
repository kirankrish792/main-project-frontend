import { Accessor, createContext, createSignal, Setter, useContext } from "solid-js";

interface UserDataContext {
  account: Accessor<string>,
  setAccount: Setter<string>
}

export const UserData = createContext<UserDataContext>()

export const UserDataProvider = (props) => {

  const [account, setAccount] = createSignal("")

  return (
    <UserData.Provider value={{ account, setAccount }}>
      {props.children}
    </UserData.Provider>
  )
}

export const useUserData = () => useContext(UserData)!

interface ContractContext {
  contractDetails: Accessor<any>,
  setContractDetails: Setter<any>
}

export const ContractData = createContext<ContractContext>()

export const ContractDataProvider = (props) => {

  const [contractDetails, setContractDetails] = createSignal()

  return (
    <ContractData.Provider value={{ contractDetails, setContractDetails }}>
      {props.children}
    </ContractData.Provider>
  )
}

export const useContractData = () => useContext(ContractData)!