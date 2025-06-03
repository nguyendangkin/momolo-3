import { useRouter } from "next/navigation";
import NProgress from "nprogress";

export const usePRouter = () => {
    const router = useRouter();
    const originalPush = router.push;

    const push = (href: string, options?: any) => {
        NProgress.start();
        originalPush(href, options);
    };

    return {
        ...router,
        push,
    };
};
