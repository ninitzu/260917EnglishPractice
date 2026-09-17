import { MAX_BOX } from "../leitner";

export function MasteryDots({ box }: { box: number }) {
  return (
    <span className="dots" title={`숙련도 ${box} / ${MAX_BOX}`}>
      {Array.from({ length: MAX_BOX }, (_, i) => (
        <span key={i} className={i < box ? "dots__on" : "dots__off"} />
      ))}
    </span>
  );
}
