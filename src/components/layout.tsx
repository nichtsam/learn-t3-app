import type { PropsWithChildren } from "react";

export const Layout = ({ children }: PropsWithChildren) => (
    <main className="scrollbar-hide scrollbar-hide m-auto h-screen overflow-auto border-x border-slate-400 md:max-w-2xl">
        {children}
    </main>
);
