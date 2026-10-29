import PoliceFile from "../components/PoliceFile";
import type { Wrapped } from "../types";

export default function RecordPost({ wrapped }: { wrapped: Wrapped }) {
  return (
    <div className="bg-[#120a1f] px-4 py-6">
      <PoliceFile wrapped={wrapped} animate={false} />
    </div>
  );
}
