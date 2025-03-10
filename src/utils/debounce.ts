type DebounceFunction = (...args: any[]) => void;

interface DebounceOptions {
    leading?: boolean;
    trailing?: boolean;
}

function debounce<T extends DebounceFunction>(
    func: T,
    wait: number,
    options?: DebounceOptions
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        const context = this;

        const later = function () {
            timeoutId = null;
            if (!options || options.leading !== false) {
                func.apply(context, args);
            }
        };

        clearTimeout(timeoutId!);

        timeoutId = setTimeout(later, wait);

        if (options && options.leading === true && !timeoutId) {
            func.apply(context, args);
        }
    };
}

export default debounce;
