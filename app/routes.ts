// ------------------- RouteConfig export -------------------
import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"), // home page at /
    {
        path: "/series/:seriesName/matches",
        file: "containers/MatchListPage.tsx", // Matches page
    },
    {
        path: "/series/:seriesName/matches/:matchId",
        file: "containers/Match.tsx", // Match scoring page
    }
] satisfies RouteConfig;