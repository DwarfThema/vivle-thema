import { UseCls } from "./useCls";

interface IBtn {
  color: string;
  text?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  [key: string]: any;
}

export default function Btn({ color, onClick, text, ...rest }: IBtn) {
  return (
    <button
      onClick={onClick}
      {...rest}
      className={`w-10 h-10 z-50 bg-${color}-400`}
    >
      {text}
    </button>
  );
}
