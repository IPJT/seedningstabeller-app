import { readFileSync } from "fs";
import { StartListChart } from "./StartListChart";
import { StartLists } from "@/scripts/generateStartlistStats";

export default function StartListPage() {
  const startLists = JSON.parse(
    readFileSync("src/scripts/startLists.json", "utf8")
  ) as StartLists;

  return (
    <main
      style={{ backgroundColor: "#023651" }}
      className="flex min-h-screen flex-col items-center justify-between p-24"
    >
      <StartListChart startLists={startLists} />
    </main>
  );
}
