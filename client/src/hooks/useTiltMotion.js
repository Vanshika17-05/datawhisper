import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";

export function useTiltMotion(maxTilt = 6) {
  const reduced = useReducedMotion();
  const rotateX = useSpring(useMotionValue(0), { stiffness: 260, damping: 24, mass: .55 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 260, damping: 24, mass: .55 });
  const onPointerMove = (event) => {
    if (reduced || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    rotateY.set(((event.clientX - rect.left) / rect.width - .5) * maxTilt * 2);
    rotateX.set(-((event.clientY - rect.top) / rect.height - .5) * maxTilt * 2);
  };
  const reset = () => { rotateX.set(0); rotateY.set(0); };
  return reduced ? {} : { style: { rotateX, rotateY, transformPerspective: 900, transformStyle: "preserve-3d" }, onPointerMove, onPointerLeave: reset, onPointerCancel: reset };
}
