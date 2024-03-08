// run with npx tsx src/app/scripts/generateStartlistStats.ts

import { readFileSync } from "fs";

type AllStartListStats = {
  [year: number]: StartListWithStartGroupStats | StartList;
};

type StartList = {
  total: number;
  women?: number;
  men?: number;
};

type StartListWithStartGroupStats = {
  [k in keyof typeof START_GROUPS]: StartList;
};

const START_GROUPS = {
  Elit: "Elit",
  StartGroup2: "2",
  StartGroup1: "1",
  StartGroup3: "3",
  StartGroup4: "4",
  StartGroup5: "5",
  StartGroup6: "6",
  StartGroup7: "7",
  StartGroup8: "8",
  StartGroup9: "9",
  StartGroup10: "10",
  All: "%",
} as const;

const SEX = {
  Women: "W",
  Men: "M",
  All: "%",
} as const;

main();

async function main() {
  //const yearArray = getYearList(1922, 2024);

  const startList2022 = await getStartListForYear(2022);
}

async function getStartListForYear(
  year: number
): Promise<StartListWithStartGroupStats | StartList> {
  const vasaloppetId = JSON.parse(
    readFileSync("src/app/scripts/vasaloppetIds.json", "utf8")
  )[year]["Vasaloppet"];

  const startGroups = Object.keys(START_GROUPS) as Array<
    keyof typeof START_GROUPS
  >;

  startGroups.forEach(async (startGroupKey) => {
    const numberOfWomenParticipants = await getNumberOfParticipants({
      sex: SEX.Women,
      year,
      startGroup: START_GROUPS.All,
      vasaloppetId,
    });
  });
}

async function getNumberOfParticipants({
  sex,
  year,
  startGroup,
  vasaloppetId,
}: {
  sex: (typeof SEX)[keyof typeof SEX];
  year: number;
  startGroup: (typeof START_GROUPS)[keyof typeof START_GROUPS];
  vasaloppetId: string;
}): Promise<number> {
  const formData = getFormData({
    sex,
    year,
    startGroup,
    vasaloppetId,
  });

  const response = await fetch(
    "https://results.vasaloppet.se/2024/?pid=startlist_list",
    {
      method: "POST",
      cache: "no-store",
      body: formData,
    }
  );

  const result = await response.text();

  console.log(result);
  return 0;
}

function getFormData({
  sex,
  year,
  startGroup,
  vasaloppetId,
}: {
  sex: (typeof SEX)[keyof typeof SEX];
  year: number;
  startGroup: (typeof START_GROUPS)[keyof typeof START_GROUPS];
  vasaloppetId: string;
}) {
  const formData = new FormData();

  formData.append("lang", "EN_CAP");
  formData.append("startpage", "startlist_responsive");
  formData.append("startpage_type", "search");
  formData.append("event_main_group", year.toString());
  formData.append("event", vasaloppetId);
  formData.append("search[name]", "");
  formData.append("search[firstname]", "");
  formData.append("search[start_no]", "");
  formData.append("search[club]", "");
  formData.append("search[team]", "");
  formData.append("search[age_class]", "%");
  formData.append("search[sex]", sex);
  formData.append("search[start_group]", startGroup);
  formData.append("search[nation]", "%");
  formData.append("search[state]", "");
  formData.append("search[postcode]", "");
  formData.append("search[postcode_range_from]", "");
  formData.append("search[postcode_range_to]", "");
  formData.append("search[city]", "");
  formData.append("num_results", "25");
  formData.append("search_sort", "name");
  formData.append("search_sort_order", "ASC");
  formData.append("submit", "");

  return formData;
}
