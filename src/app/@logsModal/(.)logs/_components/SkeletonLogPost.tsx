import { Skeleton } from '@/components/ui/skeleton'

const SkeletonLogPost = () => {
    return (
        <div className="flex rounded-lg border px-3 py-2">
            <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-[1rem] w-[20ch] rounded-lg bg-white/50 border-slate-400/20"></Skeleton>
                <Skeleton className="h-[1rem] w-[10ch] rounded-lg bg-white/50 border-slate-400/20"></Skeleton>
            </div>
            <Skeleton className="h-[1rem] w-[4ch] rounded-lg bg-white/50 border-slate-400/20"></Skeleton>
        </div>
    )
}

export default SkeletonLogPost