import { Pill } from "../common/Pill";

interface Props {
  onlyOpen: boolean;
  onChangeOnlyOpen: (value: boolean) => void;
}

export function AlertFilters({ onlyOpen, onChangeOnlyOpen }: Props) {
  return (
    <div className="alert-filters">
      <span>Show:</span>
      <Pill active={!onlyOpen} onClick={() => onChangeOnlyOpen(false)}>
        All
      </Pill>
      <Pill active={onlyOpen} onClick={() => onChangeOnlyOpen(true)}>
        Open only
      </Pill>
    </div>
  );
}
