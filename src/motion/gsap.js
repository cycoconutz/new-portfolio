import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export const MOTION = "(prefers-reduced-motion: no-preference)";
export const DESKTOP = "(min-width: 861px)";

export { gsap, ScrollTrigger, SplitText, useGSAP };
