import type { Route } from "./+types/home";
import { getPublicStats, listEvents } from "@/lib/server/public";
import Hero from "@/components/home/Hero";
import Ticker from "@/components/home/Ticker";
import StatStrip from "@/components/home/StatStrip";
import Pillars from "@/components/home/Pillars";
import KumiKata from "@/components/home/KumiKata";
import SchedulePreview from "@/components/home/SchedulePreview";
import EventsPreview from "@/components/events/EventsPreview";
import BeltLadder from "@/components/home/BeltLadder";
import TurnoutPanel from "@/components/home/TurnoutPanel";
import Coaches from "@/components/home/Coaches";
import Voices from "@/components/home/Voices";
import MatBand from "@/components/home/MatBand";
import JoinBand from "@/components/home/JoinBand";
import Faq from "@/components/home/FAQ";

export async function loader() {
  const [stats, events] = await Promise.all([getPublicStats(), listEvents()]);
  return { stats, events };
}

const Home = ({ loaderData }: Route.ComponentProps) => {
  const { stats, events } = loaderData;

  return (
    <>
      <Hero />
      <Ticker
        items={[
          "Rei-ho",
          "Ukemi",
          "Tachi-waza",
          "Ne-waza",
          "Randori",
          "Kata",
          "Kyu to Dan",
          "Bambili",
        ]}
      />
      <StatStrip stats={stats} />
      <Pillars />
      <KumiKata />
      <SchedulePreview />
      <EventsPreview events={events} />
      <BeltLadder />
      <TurnoutPanel stats={stats} />
      <Coaches />
      <Voices />
      <MatBand />
      <JoinBand />
      <Faq />
    </>
  );
};

export default Home;
