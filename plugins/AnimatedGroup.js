import { Children, useEffect, useRef, useState } from "react";

const PRESET_CLASS = {
  fade: "ag-fade",
  slide: "ag-slide",
  scale: "ag-scale",
  "blur-sm": "ag-blur-sm",
  "blur-slide": "ag-blur-slide",
};

export function AnimatedGroup({
  children,
  preset = "fade",
  stagger = 80,
  duration = 500,
  delay = 0,
  threshold = 0.15,
  as: Tag = "div",
  asChild: ChildTag = "div",
  className,
}) {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const animClass = PRESET_CLASS[preset] ?? PRESET_CLASS.fade;
  const kids = Children.toArray(children);

  return (
    <Tag ref={containerRef} className={className}>
      {kids.map((child, i) => (
        <ChildTag
          key={i}
          className={visible ? `ag-item ${animClass}` : "ag-item ag-item--hidden"}
          style={
            visible
              ? {
                  animationDelay: `${delay + i * stagger}ms`,
                  animationDuration: `${duration}ms`,
                }
              : undefined
          }
        >
          {child}
        </ChildTag>
      ))}
    </Tag>
  );
}
