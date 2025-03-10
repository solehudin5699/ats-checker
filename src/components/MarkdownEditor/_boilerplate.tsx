import { LeafDirective } from 'mdast-util-directive';

import {
  diffSourcePlugin,
  markdownShortcutPlugin,
  AdmonitionDirectiveDescriptor,
  DirectiveDescriptor,
  directivesPlugin,
  frontmatterPlugin,
  headingsPlugin,
  // imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  SandpackConfig,
  codeBlockPlugin,
  codeMirrorPlugin,
  sandpackPlugin,
  KitchenSinkToolbar,
  useCellValue,
  inFocus$,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  ListsToggle,
  InsertThematicBreak,
} from '@mdxeditor/editor';
import { useEffect, useRef, useState } from 'react';
import { IoMdCloseCircleOutline as CloseCircleIcon } from 'react-icons/io';
import { cn } from '@/utils/className';

const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim();

export const virtuosoSampleSandpackConfig: SandpackConfig = {
  defaultPreset: 'react',
  presets: [
    {
      label: 'React',
      name: 'react',
      meta: 'live react',
      sandpackTemplate: 'react',
      sandpackTheme: 'light',
      snippetFileName: '/App.js',
      snippetLanguage: 'jsx',
      initialSnippetContent: defaultSnippetContent,
    },
    {
      label: 'React',
      name: 'react',
      meta: 'live',
      sandpackTemplate: 'react',
      sandpackTheme: 'light',
      snippetFileName: '/App.js',
      snippetLanguage: 'jsx',
      initialSnippetContent: defaultSnippetContent,
    },
    {
      label: 'Virtuoso',
      name: 'virtuoso',
      meta: 'live virtuoso',
      sandpackTemplate: 'react-ts',
      sandpackTheme: 'light',
      snippetFileName: '/App.tsx',
      initialSnippetContent: defaultSnippetContent,
      dependencies: {
        'react-virtuoso': 'latest',
        '@ngneat/falso': 'latest',
      },
    },
  ],
};

interface YoutubeDirectiveNode extends LeafDirective {
  attributes: { id: string };
  name: 'youtube';
}

export const YoutubeDirectiveDescriptor: DirectiveDescriptor<YoutubeDirectiveNode> = {
  name: 'youtube',
  type: 'leafDirective',
  testNode(node) {
    return node.name === 'youtube';
  },
  attributes: ['id'],
  hasChildren: false,
  Editor: ({ mdastNode, lexicalNode, parentEditor }) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <button
          onClick={() => {
            parentEditor.update(() => {
              lexicalNode.selectNext();
              lexicalNode.remove();
            });
          }}
        >
          delete
        </button>
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${mdastNode.attributes?.id}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      </div>
    );
  },
};

export const ALL_PLUGINS = [
  toolbarPlugin({ toolbarContents: () => <KitchenSinkToolbar /> }),
  listsPlugin(),
  quotePlugin(),
  headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
  linkPlugin(),
  linkDialogPlugin(),
  // imagePlugin({ imageAutocompleteSuggestions:
  // ['https://via.placeholder.com/150', 'https://via.placeholder.com/150']}),
  tablePlugin(),
  thematicBreakPlugin(),
  frontmatterPlugin(),
  codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
  sandpackPlugin({ sandpackConfig: virtuosoSampleSandpackConfig }),
  codeMirrorPlugin({
    codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript' },
  }),
  directivesPlugin({
    directiveDescriptors: [YoutubeDirectiveDescriptor, AdmonitionDirectiveDescriptor],
  }),
  diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
  markdownShortcutPlugin(),
];

export const READONLY_PLUGINS = [
  listsPlugin(),
  quotePlugin(),
  headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
  linkPlugin(),
  linkDialogPlugin(),
  // imagePlugin({ imageAutocompleteSuggestions:
  // ['https://via.placeholder.com/150', 'https://via.placeholder.com/150']}),
  tablePlugin(),
  thematicBreakPlugin(),
  frontmatterPlugin(),
  codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
  sandpackPlugin({ sandpackConfig: virtuosoSampleSandpackConfig }),
  codeMirrorPlugin({
    codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript' },
  }),
  directivesPlugin({
    directiveDescriptors: [YoutubeDirectiveDescriptor, AdmonitionDirectiveDescriptor],
  }),
  diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
  markdownShortcutPlugin(),
];

export const ToolbarContainer = (props: { children: React.ReactNode }) => {
  const inFocus = useCellValue(inFocus$);

  const [showToolbar, setShowToolbar] = useState(inFocus);
  const tRef = useRef<any>(null);

  const handleClose = () => setShowToolbar(false);
  useEffect(() => {
    clearTimeout(tRef.current);
    if (inFocus) {
      tRef.current = setTimeout(() => setShowToolbar(true), 100);
    }
  }, [inFocus]);

  return (
    <div className={cn('transition-all w-full', showToolbar ? 'h-10' : 'h-0 w-0')}>
      <div className="flex justify-between items-center w-full">
        {props.children}
        <CloseCircleIcon
          className="justify-self-end m-2 text-primary-500 cursor-pointer transition-colors duration-150 hover:text-primary-600 min-w-[24px]"
          size={24}
          onClick={handleClose}
          title="Close toolbar"
        />
      </div>
    </div>
  );
};

export const FIELD_PLUGINS = [
  ...(ALL_PLUGINS.filter((_, idx) => idx !== 0) || []),
  toolbarPlugin({
    toolbarContents: () => (
      <ToolbarContainer>
        <UndoRedo />
        <BoldItalicUnderlineToggles />
        <BlockTypeSelect />
        <CreateLink />
        <ListsToggle />
        <InsertThematicBreak />
      </ToolbarContainer>
    ),
  }),
];
