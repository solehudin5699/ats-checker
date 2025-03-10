/* SOURCE: https://github.com/gregberge/react-merge-refs/issues/5#issuecomment-643341631 */
 
import { useCallback } from 'react';

export default function useMergedRefs(refs: (React.ForwardedRef<any> | React.MutableRefObject<any>)[]) {
    return useCallback((current: any) => {
        refs.forEach((ref) => {
            if (typeof ref === 'function') {
                ref(current);
            } else if (ref && !Object.isFrozen(ref)) {
                ref.current = current;
            }
        });
    }, refs);
}
