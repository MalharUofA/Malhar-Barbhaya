import { useEffect, useState } from 'react';

export default function useSectionVisible(id) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [id]);

  return isVisible;
}
