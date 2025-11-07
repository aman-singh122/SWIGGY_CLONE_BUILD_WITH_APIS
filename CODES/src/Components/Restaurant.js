import { useEffect, useState } from "react";
import RestCard from "./RestCard";
import Shimmer from "./Shimmer";

export default function Restaurant() {
  const [RestData, setRestData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);     // Error state

  useEffect(() => {
    async function fetchData() {
      try {
        const swiggyAPI =
          "https://www.swiggy.com/dapi/restaurants/list/v5?lat=28.7040592&lng=77.10249019999999&is-seo-homepage-enabled=true";

        // Using AllOrigins proxy to bypass CORS
        const proxy = "https://api.allorigins.win/get?url=";
        const response = await fetch(proxy + encodeURIComponent(swiggyAPI));

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // Parse the nested JSON returned by AllOrigins
        const jsonData = JSON.parse(data.contents);

        // Safely access restaurants array
        const restaurants =
          jsonData?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle
            ?.restaurants || [];

        setRestData(restaurants);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Shimmer while loading
  if (loading) return <Shimmer />;

  // Show error message if fetch failed
  if (error)
    return (
      <div className="text-center mt-20 text-red-500">
        Error: {error}
      </div>
    );

  // Render restaurants
  return (
    <div className="flex flex-wrap w-[80%] mx-auto mt-20 gap-5">
      {RestData.map((restInfo) => (
        <RestCard key={restInfo?.info?.id} restInfo={restInfo} />
      ))}
    </div>
  );
}
