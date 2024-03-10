import { writeFileSync } from "fs";
import { getEncodedSearchParamsUrl, getYearList } from "./utils";

//run with "pnpm tsx src/app/scripts/getVasaloppetIds.ts"
main();

async function main() {
  const yearArray = getYearList(1922, 2024);

  const yearlyEvents: Record<number, Record<string, string>> = {};

  const promiseArray = yearArray.map((year) => getEventNameToIdRecord(year));
  const eventArray = await Promise.all(promiseArray);

  eventArray.forEach((eventNameToIdRecord, index) => {
    yearlyEvents[yearArray[index]] = eventNameToIdRecord;
  });

  saveToFile(yearlyEvents);
}

async function getEventNameToIdRecord(year: number) {
  try {
    const url = getEncodedSearchParamsUrl({ year, pId: "start" });
    const result = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });
    const data = await result.json();
    const eventList = data.branches.lists.fields.event.data as Array<
      Record<string, [string, string]>
    >;
    const events = eventList.reduce(
      (
        acc: Record<string, string>,
        event: Record<string, [string, string]>
      ) => {
        const [id, name] = event.v;
        acc[name] = id;
        return acc;
      },
      {} as Record<string, string>
    );

    return events;
  } catch (error) {
    console.error(`An error has occurred for year ${year}`, error);
    return {};
  }
}

function saveToFile(yearlyEvents: Record<number, Record<string, string>>) {
  const path = "src/app/scripts/vasaloppetIds.json";

  try {
    writeFileSync(path, JSON.stringify(yearlyEvents, null, 2), "utf8");
    console.log("Data successfully saved to disk");
  } catch (error) {
    console.log("An error has occurred ", error);
  }
}
