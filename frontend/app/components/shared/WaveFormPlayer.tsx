import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

export default function WaveformPlayer({ url }: { url: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const ws = WaveSurfer.create({
            container: ref.current,
            waveColor: "#525252",
            progressColor: "#22c55e",
            height: 64,
            barWidth: 2,
        });

        ws.load(url);

        return () => ws.destroy();
    }, [url]);

    return <div ref={ref} />;
}
