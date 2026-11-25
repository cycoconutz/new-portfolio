import { gsap, ScrollTrigger, SplitText, useGSAP, MOTION } from "./gsap";

// Adds .visible to .reveal elements as they enter the viewport (CSS does the fade).
export function useReveal(scope) {
  useGSAP(
    () => {
      ScrollTrigger.batch(".reveal", {
        start: "top 92%",
        end: "max",
        once: true,
        onEnter: (els) => els.forEach((el) => el.classList.add("visible")),
      });
      ScrollTrigger.refresh();
    },
    { scope }
  );
}

// Web fonts change text metrics, so trigger positions are recomputed once they load.
export function useFontRefresh() {
  useGSAP(() => {
    let live = true;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => live && ScrollTrigger.refresh());
    }
    return () => {
      live = false;
    };
  });
}

// Section titles type in once on entering the viewport, then a caret blinks and goes away.
export function useTypedTitles(scope) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION, () => {
        const carets = [];
        document.querySelectorAll(".sec-title, .contact-title").forEach((el) => {
          const split = SplitText.create(el, { type: "words,chars", wordsClass: "word", aria: "auto" });
          if (!split.chars.length) return;
          gsap.set(split.chars, { opacity: 0 });
          ScrollTrigger.create({
            trigger: el,
            start: "top 88%",
            once: true,
            onEnter: () => {
              const caret = document.createElement("span");
              caret.className = "caret";
              caret.setAttribute("aria-hidden", "true");
              // Inside the last word (nowrap) so the caret can never wrap onto its own line.
              (split.words[split.words.length - 1] || el).appendChild(caret);
              carets.push(caret);
              gsap.to(split.chars, {
                opacity: 1,
                duration: 0.05,
                ease: "none",
                stagger: 0.5 / split.chars.length,
                onComplete: () => gsap.delayedCall(1, () => caret.remove()),
              });
            },
          });
        });
        return () => carets.forEach((c) => c.remove());
      });
      return () => mm.revert();
    },
    { scope }
  );
}
