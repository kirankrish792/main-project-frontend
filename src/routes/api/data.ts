import { json } from "solid-start";
import contractList from "./data.json"


export function GET() {
  return json(contractList);
}