"use client";

import { START_GROUPS } from "@/lib/constants";
import { StartLists } from "@/scripts/generateStartlistStats";
import { useEffect, useState } from "react";
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from "recharts";

export const StartListChart = ({ startLists }: { startLists: StartLists }) => {
  const [startList, setStartList] = useState<StartLists[number]>();
  const years = Object.keys(startLists);
  const [year, setYear] = useState<number>(Number(years[0]));

  let data = startList ? formatStartList(startList) : [];

  return (
    <div>
      <BarChart width={730} height={600} data={data}>
        <XAxis dataKey="name" />
        <YAxis domain={[0, 5000]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Kvinnor" fill="#FFC0CB" />
        <Bar dataKey="Män" fill="#0A75AD" />
      </BarChart>
      <input
        type="range"
        min={years[0]}
        max={years[years.length - 1]}
        value={year}
        onChange={(e) => {
          const value = e.target.value;
          if (startLists[Number(value)]) {
            setYear(Number(value));
            setStartList(startLists[Number(value)]);
          } else {
            setYear(Number(value) + 1);
            setStartList(startLists[Number(value) + 1]);
          }
        }}
        style={{ width: "100%" }}
      ></input>
      <h1>{year}</h1>
    </div>
  );
};

const formatStartList = (startList: StartLists[number]) => {
  if (startList.perStartGroup) {
    const data = Object.entries(startList.perStartGroup)
      .map(([startGroup, startListForStartGroup]) => {
        return {
          name: START_GROUPS[startGroup as keyof typeof START_GROUPS],
          Män: startListForStartGroup.men,
          Kvinnor: startListForStartGroup.women,
        };
      })
      .filter((startGroup) => startGroup.name !== "%");

    return data;
  }

  const data = [
    {
      name: "Total",
      Män: startList.total.men,
      Kvinnor: startList.total.women,
    },
  ];

  return data;
};
