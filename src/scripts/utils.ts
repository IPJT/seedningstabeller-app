export type pId = "start" | "startlist";

export function getEncodedSearchParamsUrl({
  year,
  event,
  pId,
}: {
  year: number;
  event?: string;
  pId: pId;
}) {
  const decodedUrl = `https://results.vasaloppet.se/2024/index.php?content=ajax2&func=getSearchFields&options[b][search][event_main_group]=${year}&options[b][search][event]=${event}&options[b][lists][event_main_group]=${year}&options[b][lists][event]=&options[b][lists][sex]=&options[lang]=EN_CAP&options[pid]=${pId}`;
  return encodeURI(decodedUrl);
}

export function getYearList(startYear: number, endYear: number) {
  const years = [];

  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  return years;
}
