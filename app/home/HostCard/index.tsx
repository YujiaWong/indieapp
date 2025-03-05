import { Card } from "@heroui/react";

export default () => {
  const list = [
    {
      text: "A page show a top story",
      svgPath:
        "M140-120q-24.75 0-42.37-17.63Q80-155.25 80-180v-642q0-5.25 4.5-7.13Q89-831 93-827l54 54 55-56q4.64-5 10.82-5t11.18 5l56 56 56-56q4.64-5 10.82-5t11.18 5l55 56 56-56q4.64-5 10.82-5t11.18 5l56 56 55-56q4.64-5 10.82-5t11.18 5l56 56 56-56q4.64-5 10.82-5t11.18 5l55 56 54-54q4-4 8.5-2.13 4.5 1.88 4.5 7.13v642q0 24.75-17.62 42.37Q844.75-120 820-120zm0-60h310v-280H140zm370 0h310v-110H510zm0-170h310v-110H510zM140-520h680v-120H140z",
      color: "text-orange-400",
    },
    {
      text: "A Landing page for your startup",
      svgPath:
        "M140-160q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18zm0-60h461v-163H140zm521 0h159v-386H661zM140-443h461v-163H140z",

      color: "text-cyan-400",
    },
    {
      text: "An app to help me track my crypto portfolio",
      svgPath:
        "M370-150v-60H270q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h60v-420h-60q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h100v-60q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v60h110v-60q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v63q54 11 87 53t33 94q0 28-11 55.5T677-495q39 20 61 56.5t22 78.1q0 62.4-43.5 106.4T610-210h-10v60q0 12.75-8.68 21.37-8.67 8.63-21.5 8.63-12.82 0-21.32-8.63-8.5-8.62-8.5-21.37v-60H430v60q0 12.75-8.68 21.37-8.67 8.63-21.5 8.63-12.82 0-21.32-8.63-8.5-8.62-8.5-21.37m20-360h180q38 0 64-26.44T660-600q0-38-26-64t-64-26H390zm0 240h220q38 0 64-26.44T700-360q0-38-26-64t-64-26H390z",
      color: "text-green-400",
    },
    {
      text: "A dashboard to manage my startup's operations",
      svgPath:
        "M224.12-161q-49.12 0-83.62-34.42Q106-229.83 106-279H70q-12.75 0-21.37-8.63Q40-296.25 40-309v-431q0-24 18-42t42-18h519q24.75 0 42.38 17.62Q679-764.75 679-740v107h75q14.25 0 27 6.37 12.75 6.38 21 17.63l112 149q3 3.75 4.5 8.25T920-442v133q0 12.75-8.62 21.37Q902.75-279 890-279h-41q0 49-34.38 83.5t-83.5 34.5-83.62-34.42Q613-229.83 613-279H342q0 49-34.38 83.5t-83.5 34.5m-.12-60q24 0 41-17t17-41-17-41-41-17-41 17-17 41 17 41 41 17M100-339h22q17-27 43.04-43t58-16 58.46 16.5T325-339h294v-401H100zm631 118q24 0 41-17t17-41-17-41-41-17-41 17-17 41 17 41 41 17m-52-204h186L754-573h-75zM360-540",
      color: "text-pink-400",
    },
  ];

  return (
    <div className="flex justify-center items-center gap-4 w-4/5 mx-auto pb-2 pt-24">
      {list.map((item, index) => (
        <Card
          key={index}
          isPressable
          className="w-[170px] h-32 border border-white border-[0.5px] p-3 rounded-lg text-sm flex flex-col gap-7 transition-colors hover:bg-muted hover:cursor-pointer"
        >
          <p className="text-wrap text-xs text-left">{item.text}</p>

          <span className="absolute bottom-2 right-2 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 -960 960 960"
              className={`shrink-0 h-5 w-5  ${item.color} ml-auto`}
              fill="currentColor"
            >
              <path d={item.svgPath}></path>
            </svg>
          </span>
        </Card>
      ))}
    </div>
  );
};
