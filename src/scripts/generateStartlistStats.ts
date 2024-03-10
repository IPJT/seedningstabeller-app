// run with pnpm tsx src/app/scripts/generateStartlistStats.ts

import { readFileSync, writeFileSync } from "fs";
import { getYearList } from "./utils";
import { START_GROUPS } from "@/lib/constants";

export type StartLists = {
  [year: number]: StartList;
};

type StartList = {
  total: {
    total: number;
    women?: number;
    men?: number;
  };
  perStartGroup?: StartListWithStartGroupStats;
};

type StartListWithStartGroupStats = {
  [k in keyof typeof START_GROUPS]?: {
    total: number;
    women?: number;
    men?: number;
  };
};

const SEX = {
  Women: "W",
  Men: "M",
  All: "%",
} as const;

main();

async function main() {
  const yearArray = getYearList(1922, 2024);
  const startLists: StartLists = {};

  for (const year of yearArray) {
    const startList = await getStartListForYear(year);

    if (startList) {
      startLists[year] = startList;
    }
  }

  writeFileSync(
    "src/app/scripts/startLists.json",
    JSON.stringify(startLists, null, 2),
    "utf8"
  );
}

async function getStartListForYear(year: number): Promise<StartList | null> {
  const vasaloppetId = JSON.parse(
    readFileSync("src/app/scripts/vasaloppetIds.json", "utf8")
  )[year]["Vasaloppet"] as string;

  if (!vasaloppetId) {
    return null;
  }

  const startGroups = Object.keys(START_GROUPS) as Array<
    keyof typeof START_GROUPS
  >;

  const startList: StartList = { total: { total: 0 } };

  for (const startGroupKey of startGroups) {
    const StartGroupValue = START_GROUPS[startGroupKey];

    const numberOfFemaleParticipants = await getNumberOfParticipants({
      sex: SEX.Women,
      year,
      startGroup: StartGroupValue,
      vasaloppetId,
    });

    const numberOfMaleParticipants = await getNumberOfParticipants({
      sex: SEX.Men,
      year,
      startGroup: StartGroupValue,
      vasaloppetId,
    });

    if (
      StartGroupValue === START_GROUPS.Elit &&
      numberOfFemaleParticipants === 0 &&
      numberOfMaleParticipants === 0
    ) {
      break;
    }

    if (startList.perStartGroup === undefined) {
      startList.perStartGroup = {};
    }

    startList.perStartGroup[startGroupKey] = {
      total: numberOfFemaleParticipants + numberOfMaleParticipants,
      women: numberOfFemaleParticipants,
      men: numberOfMaleParticipants,
    };
  }

  const totalNumberOfFemaleParticipants = await getNumberOfParticipants({
    sex: SEX.Women,
    year,
    startGroup: START_GROUPS.All,
    vasaloppetId,
  });

  const totalNumberOfMaleParticipants = await getNumberOfParticipants({
    sex: SEX.Men,
    year,
    startGroup: START_GROUPS.All,
    vasaloppetId,
  });

  startList.total = {
    total: totalNumberOfFemaleParticipants + totalNumberOfMaleParticipants,
    women: totalNumberOfFemaleParticipants,
    men: totalNumberOfMaleParticipants,
  };

  if (startList.total.total > 17000) {
    console.log(`Year ${year} has more than 17000 participants`);
  }

  return startList;
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

  let regex = /(\d+)\s+Results\s+\|\s+Unofficial\s+Results/;
  let match = result.match(regex);

  let number = 0;

  if (match) {
    number = parseInt(match[1], 10); // match[1] because match[0] is the full match, and match[1] is the first capturing group
  }

  return number;
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
