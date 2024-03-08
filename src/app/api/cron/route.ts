export async function GET() {
  const result = await fetch(
    "http://worldtimeapi.org/api/timezone/America/Chicago",
    {
      cache: "no-store",
    }
  );
  const data = await result.json();

  return Response.json({ datetime: data.datetime, hej: "Hej på dig1" });
}

const eventNamesVasaloppet = {
  2020: "VL_999999167888680000000764",
};
