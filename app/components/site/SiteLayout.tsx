import { Outlet } from "react-router";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import ScrollProgress from "@/components/visual/ScrollProgress";
import SpotlightSearch from "@/components/search/SpotlightSearch";

const SiteLayout = () => (
  <div className="min-h-screen bg-background text-foreground">
    <ScrollProgress />
    <SpotlightSearch />
    <SiteHeader />
    <main className="pt-[72px]">
      <Outlet />
    </main>
    <SiteFooter />
  </div>
);

export default SiteLayout;
