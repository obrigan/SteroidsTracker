import { useRef } from "react";

export function TestComponent() {
  const testRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={testRef}>
      Test Component
    </div>
  );
}