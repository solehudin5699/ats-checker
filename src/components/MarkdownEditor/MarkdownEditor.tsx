import { MDXEditor, MDXEditorMethods, MDXEditorProps, realmPlugin } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import './markdown.css';
import { ALL_PLUGINS, FIELD_PLUGINS, READONLY_PLUGINS } from './_boilerplate';
import { cn } from '@/utils/className';
import React, { useCallback, useEffect, useMemo } from 'react';
import useMergedRefs from '@/hooks/useMergeRefs';
import debounce from '@/utils/debounce';

interface MarkdownEditorProps extends Partial<Omit<MDXEditorProps, 'plugins'>> {
  onChange?: (markdown: string) => void;
  plugins?: MDXEditorProps['plugins'] | 'all' | 'field' | 'readonly';
  readOnly?: boolean;
  value?: string;
}

const pluginOptiosn = {
  all: ALL_PLUGINS,
  readonly: READONLY_PLUGINS,
  field: FIELD_PLUGINS,
};

const MarkdownEditor = React.forwardRef<MDXEditorMethods, MarkdownEditorProps>(function Component(
  props,
  ref
) {
  const { value, onChange, readOnly, plugins, ...rest } = props;
  const internalRef = React.useRef<MDXEditorMethods>(null);
  const mergedRefs = useMergedRefs([ref, internalRef]);

  const pluginSelected = useMemo(() => {
    if (readOnly) {
      return READONLY_PLUGINS;
    } else if (plugins instanceof realmPlugin) {
      return plugins;
    } else if (['all', 'readonly', 'field'].includes(plugins as string)) {
      return pluginOptiosn[plugins as keyof typeof pluginOptiosn] as MDXEditorProps['plugins'];
    }
    return ALL_PLUGINS;
  }, [plugins, readOnly]);

  const setValues = useCallback(
    debounce((value: string) => {
      internalRef?.current?.setMarkdown?.(value);
    }, 30),
    []
  );

  useEffect(() => {
    setValues(value || '');
  }, [value]);

  return (
    <MDXEditor
      {...rest}
      contentEditableClassName={cn(
        'prose',
        rest.contentEditableClassName,
        value ? '' : '!text-[#9AA4B2] !font-normal !text-sm'
      )}
      markdown={value || ''}
      onChange={onChange}
      plugins={pluginSelected}
      readOnly={readOnly}
      ref={mergedRefs}
    />
  );
});

// MarkdownEditor.defaultProps = {
//     plugins: undefined,
//     readOnly: false,
//     onChange: () => {},
//     value: '',
// };

export default MarkdownEditor;
