import { RefObject, useEffect, useState } from "react";

interface IPointer {
  x: number;
  y: number;
}

export default function UseFollowPointer(ref: RefObject<HTMLElement>) {
  const [point, setPoint] = useState<IPointer>({ x: 0, y: 0 });
  useEffect(() => {
    if (!ref.current) return;

    const handlePointerMove = ({ clientX, clientY }: MouseEvent) => {
      const follower = ref.current as HTMLElement;
      // const follower = ref.current!;

      const x = clientX - follower.offsetLeft - follower.offsetWidth / 2;
      const y = clientY - follower.offsetTop - follower.offsetHeight / 2;
      setPoint({ x, y });
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return point;
}
