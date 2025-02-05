import { readFileSync } from "fs";
import { StartListChart } from "./StartListChart";
import { StartLists } from "@/scripts/generateStartlistStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StartListPage() {
  const startLists = JSON.parse(
    readFileSync("src/scripts/startLists.json", "utf8")
  ) as StartLists;

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <Card className="w-full max-w-[500px]">
        <CardHeader>
          <CardTitle className="text-2xl">
            Vasaloppet Start Groups Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StartListChart startLists={startLists} />
        </CardContent>
      </Card>
    </main>
  );
}
