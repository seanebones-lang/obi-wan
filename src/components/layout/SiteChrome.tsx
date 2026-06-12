import { SiteFooter } from "./SiteFooter";
import { BottomNav } from "./BottomNav";

export function SiteChrome() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-lg w-full">
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
