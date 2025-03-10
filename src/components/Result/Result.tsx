'use client';

import { cn } from '@/utils/className';
import type { Variants } from 'motion/react';
import * as motion from 'motion/react-client';
import { useEffect, useRef } from 'react';
import MarkdownEditor from '../MarkdownEditor';

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  result: string;
}
export default function Variants({ isOpen, setIsOpen, result }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { height } = useDimensions(containerRef);

  return (
    <div className="relative">
      <div
        style={{
          ...container,
          width: isOpen ? '100%' : '0',
          maxWidth: '100%',
          height: isOpen ? '100vh' : '0',
        }}
        className="absolute top-0 left-0 right-0 bottom-0 grid place-content-center transition-all duration-300"
      >
        <motion.nav
          initial={false}
          animate={isOpen ? 'open' : 'closed'}
          custom={height}
          ref={containerRef}
          style={nav}
        >
          <motion.div style={background} variants={sidebarVariants} />
          <div
            className={cn(
              'bg-white/90 rounded-2xl overflow-y-auto w-[500px] delay-300',
              isOpen
                ? 'w-[calc(100vw-80px)] transition-all z-10 absolute top-10 left-10 right-10 bottom-10 min-h-[350px]'
                : 'w-0 lg:w-[0] h-0'
            )}
          >
            <div className="p-10">
              <MarkdownEditor value={result} readOnly />
            </div>
          </div>
          <MenuToggle toggle={() => setIsOpen(!isOpen)} />
        </motion.nav>
      </div>
    </div>
  );
}

const sidebarVariants = {
  open: (height = 1000) => ({
    // clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    clipPath: `circle(${height * 2 + 200}px at 50% 50%)`,
    transition: {
      type: 'spring',
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    // clipPath: 'circle(30px at 40px 40px)',
    clipPath: 'circle(0px at 50% 50%)',
    transition: {
      delay: 0.2,
      type: 'spring',
      stiffness: 400,
      damping: 40,
    },
  },
};

const MenuToggle = ({ toggle }: { toggle: () => void }) => (
  <button style={toggleContainer} onClick={toggle}>
    <svg
      fill="currentColor"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M12 13.8053L5.19415 20.6227C4.95306 20.8642 4.62659 21 4.28503 21H4.28501C3.76601 21 3.29719 20.6863 3.09798 20.2051C2.89874 19.7237 3.00924 19.1703 3.3759 18.8013L10.1817 11.984L3.37595 5.1666C2.9038 4.65844 2.91889 3.86856 3.40776 3.37714C3.89831 2.88744 4.6869 2.87233 5.1942 3.34527L12 10.1626L18.8058 3.3453C19.3131 2.87234 20.1016 2.88746 20.5922 3.37716C21.081 3.86854 21.0962 4.65846 20.6241 5.16663L13.8183 11.984L20.6241 18.8013C20.9907 19.1703 21.1013 19.7237 20.902 20.205C20.7028 20.6864 20.234 21 19.7149 21C19.3734 21 19.0469 20.8641 18.8058 20.6227L12 13.8053Z"
        fillRule="evenodd"
      />
    </svg>
  </button>
);

const container: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  maxWidth: '100%',
  height: '100vh',
  backgroundColor: 'var(--accent)',
  borderRadius: 20,
  overflow: 'hidden',
};

const nav: React.CSSProperties = {
  width: '100%',
};

const background: React.CSSProperties = {
  backgroundColor: '#f5f5f5',
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  width: '100%',
};

const toggleContainer: React.CSSProperties = {
  outline: 'none',
  border: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  cursor: 'pointer',
  position: 'absolute',
  top: 18,
  left: 15,
  width: 50,
  height: 50,
  borderRadius: '50%',
  background: 'transparent',
};

const useDimensions = (ref: React.RefObject<HTMLDivElement | null>) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
  }, [ref]);

  return dimensions.current;
};
