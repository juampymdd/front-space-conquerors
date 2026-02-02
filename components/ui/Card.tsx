import { twMerge } from "tailwind-merge";
import { Frame } from "./Frame";

function Card({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={twMerge([
                "relative px-10 pt-8 pb-6.5 w-full [&>svg]:drop-shadow-[0_0px_20px_var(--color-primary)]",
                "[--color-frame-1-stroke:var(--color-primary)]",
                "[--color-frame-1-fill:var(--color-primary)]/20",
                "[--color-frame-2-stroke:var(--color-accent)]",
                "[--color-frame-2-fill:var(--color-accent)]/20",
                "[--color-frame-3-stroke:var(--color-accent)]",
                "[--color-frame-3-fill:var(--color-accent)]/50",
                className,
            ])}
            {...props}
        >
            <Frame
                paths={JSON.parse(
                    '[{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-1-stroke)","fill":"var(--color-frame-1-fill)"},"path":[["M","0% + 34","7"],["L","0% + 79.5","7"],["L","0% + 96.5","13"],["L","100% - 21.5","13"],["L","100% + 0","34"],["L","100% - 13","100% - 15"],["L","100% - 26","100% - 6"],["L","0% + 11.5","100% - 6"],["L","0","100% - 18"],["L","13","0% + 28"],["L","34","7"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-2-stroke)","fill":"var(--color-frame-2-fill)"},"path":[["M","18","100% - 6"],["L","100% - 33.5","100% - 6"],["L","100% - 39.5","100% - 0"],["L","24","100% + 0"],["L","18","100% - 6"]]},{"show":true,"style":{"strokeWidth":"1","stroke":"var(--color-frame-3-stroke)","fill":"var(--color-frame-3-fill)"},"path":[["M","17","7"],["L","0% + 26.5","7"],["L","0% + 12.5","0% + 20"],["L","13","0% + 11"],["L","17","7"]]}]'
                )}
            />
            {children}
        </div>
    );
}

function CardTitle({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={twMerge([
                "flex items-center text-shadow-lg text-shadow-primary font-bold w-full relative",
                className,
            ])}
            {...props}
        >
            {children}
        </div>
    );
}

function CardDescription({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={twMerge(["relative pt-2 opacity-80", className])}
            {...props}
        >
            {children}
        </div>
    );
}

function CardContent({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div className={twMerge(["relative", className])} {...props}>
            {children}
        </div>
    );
}

function CardFooter({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div className={twMerge(["relative", className])} {...props}>
            {children}
        </div>
    );
}

export { Card, CardTitle, CardDescription, CardContent, CardFooter };
