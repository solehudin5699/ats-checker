'use client';

import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-client';
import { useState } from 'react';
import CVUploader from '../CVUploader';

const AllTabs = [
  {
    label: 'Upload CV',
    icon: '💼',
    key: 'upload-cv',
    component: <CVUploader />,
  },
  {
    label: 'Paste Resume',
    icon: '📄',
    key: 'paste-resume',
    component: (
      <textarea
        className="w-full p-2 border border-blue-300 h-32 rounded-2xl bg-white"
        placeholder="Paste Resume Here..."
        name="resumeText"
      />
    ),
  },
];
export default function ResumeOrCv() {
  const [selectedTab, setSelectedTab] = useState(AllTabs[0]);

  return (
    <div style={container}>
      <h6 className="font-semibold">
        Upload CV <span className="font-normal">or</span> Paste Your Resume
      </h6>
      <nav style={nav}>
        <ul style={tabsContainer}>
          {AllTabs.map((item) => (
            <motion.li
              key={item.label}
              initial={false}
              animate={{
                backgroundColor: item.key === selectedTab.key ? '#eee' : '#eee0',
              }}
              style={tab}
              onClick={() => setSelectedTab(item)}
            >
              {`${item.icon} ${item.label}`}
              {item.key === selectedTab.key ? (
                <motion.div style={underline} layoutId="underline" id="underline" />
              ) : null}
            </motion.li>
          ))}
        </ul>
      </nav>
      <main style={iconContainer}>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab ? selectedTab.label : 'empty'}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={icon}
          >
            <div>{selectedTab.component}</div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

/**
 * ==============   Styles   ================
 */

const container: React.CSSProperties = {
  borderRadius: 10,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const nav: React.CSSProperties = {
  background: '#fdfdfd',
  padding: '5px 5px 0',
  borderRadius: '10px',
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  borderBottom: '1px solid #eeeeee',
  height: 44,
};

const tabsStyles: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  fontWeight: 500,
  fontSize: 14,
};

const tabsContainer: React.CSSProperties = {
  ...tabsStyles,
  display: 'flex',
  width: '100%',
};

const tab: React.CSSProperties = {
  ...tabsStyles,
  borderRadius: 5,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  width: '100%',
  padding: '10px 15px',
  position: 'relative',
  background: 'white',
  cursor: 'pointer',
  height: 36,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flex: 1,
  minWidth: 0,
  userSelect: 'none',
  color: '#0f1115',
};

const underline: React.CSSProperties = {
  position: 'absolute',
  bottom: -2,
  left: 0,
  right: 0,
  height: 2,
  background: '#000',
};

const iconContainer: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  // flex: 1,
  padding: '10px 0px',
};

const icon: React.CSSProperties = {
  width: '100%',
};
