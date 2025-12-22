import clsx from "clsx";
import StarryNightBg from "../assets/starry-night-gradient.png";
type HomeScreen46StarryNightSoftGradientImageProps = {
  additionalClassNames?: string;
};

function HomeScreen46StarryNightSoftGradientImage({ additionalClassNames = "" }: HomeScreen46StarryNightSoftGradientImageProps) {
  return (
    <div className={clsx("absolute h-[1205px] left-[-33px] top-[-46px] w-[1761px]", additionalClassNames)}>
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={StarryNightBg} />
    </div>
  );
}
type Helper2Props = {
  additionalClassNames?: string;
};

function Helper2({ additionalClassNames = "" }: Helper2Props) {
  return (
    <div className={additionalClassNames}>
      <div className="absolute backdrop-blur-[12.5px] backdrop-filter bg-white border border-[rgba(255,255,255,0.3)] border-solid inset-0 opacity-[0.15] rounded-[15px] shadow-[0px_10px_35px_0px_rgba(0,0,0,0.15)]" data-name="tasks" />
    </div>
  );
}
type Helper1Props = {
  additionalClassNames?: string;
};

function Helper1({ additionalClassNames = "" }: Helper1Props) {
  return <Helper2 additionalClassNames={clsx("absolute left-[56px]", additionalClassNames)} />;
}
type HelperProps = {
  additionalClassNames?: string;
};

function Helper({ additionalClassNames = "" }: HelperProps) {
  return <Helper2 additionalClassNames={clsx("absolute h-[262px]", additionalClassNames)} />;
}

function Habits() {
  return (
    <div className="absolute h-[230px] left-[667px] top-[169px] w-[1005px]" data-name="Habits">
      <div className="absolute backdrop-blur-[12.5px] backdrop-filter bg-white border border-[rgba(255,255,255,0.3)] border-solid inset-0 opacity-[0.15] rounded-[15px] shadow-[0px_10px_35px_0px_rgba(0,0,0,0.15)]" data-name="habits" />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[56px] top-[169px]">
      <Helper1 additionalClassNames="h-[530px] top-[169px] w-[573.485px]" />
      <Habits />
      <Helper additionalClassNames="left-[667px] top-[437px] w-[491px]" />
      <Helper additionalClassNames="left-[981px] top-[737px] w-[691px]" />
      <Helper additionalClassNames="left-[1182px] top-[437px] w-[490px]" />
      <Helper1 additionalClassNames="h-[265px] top-[734px] w-[890px]" />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[56px] top-[169px]">
      <Group />
      <p className="absolute font-['Be_Vietnam_Pro:Regular',sans-serif] h-[102px] leading-[normal] left-[82px] not-italic opacity-[0.85] text-[35px] text-white top-[182px] w-[335px]">Today’s Tasks</p>
      <p className="absolute font-['Be_Vietnam_Pro:Regular',sans-serif] h-[102px] leading-[normal] left-[82px] not-italic text-[35px] text-white top-[766px] w-[335px]">Schedule</p>
      <p className="absolute font-['Be_Vietnam_Pro:Regular',sans-serif] h-[102px] leading-[normal] left-[1002px] not-italic text-[35px] text-white top-[756px] w-[335px]">Events</p>
      <p className="absolute font-['Be_Vietnam_Pro:Regular',sans-serif] h-[102px] leading-[normal] left-[1229px] not-italic text-[35px] text-white top-[455px] w-[335px]">Timer</p>
      <p className="absolute font-['Be_Vietnam_Pro:Regular',sans-serif] h-[102px] leading-[normal] left-[696px] not-italic opacity-[0.85] text-[35px] text-white top-[182px] w-[335px]">Habits</p>
      <p className="absolute font-['Be_Vietnam_Pro:Regular',sans-serif] h-[102px] leading-[normal] left-[690px] not-italic text-[35px] text-white top-[455px] w-[335px]">Routine Time</p>
    </div>
  );
}

export default function HomeScreen() {
  return (
    <div className="bg-white relative size-full" data-name="Home Screen">
      <HomeScreen46StarryNightSoftGradientImage />
      <HomeScreen46StarryNightSoftGradientImage additionalClassNames="blur-[15px] filter" />
      <div className="absolute bg-black h-[1117px] left-0 opacity-[0.15] top-0 w-[1728px]" />
      <div className="absolute font-['Be_Vietnam_Pro:Regular',sans-serif] h-[92px] leading-[normal] left-[722px] not-italic text-[32px] text-white top-[48px] w-[512px]">
        <p className="mb-0">Good Morning, Mahi</p>
        <p>11 December, 2025</p>
      </div>
      <div className="absolute font-['Be_Vietnam_Pro:Regular',sans-serif] h-[72px] leading-[12px] left-[56px] not-italic text-[64px] text-white top-[48px] w-[52px]">
        <p className="mb-0">-</p>
        <p className="mb-0">-</p>
        <p>-</p>
      </div>
      <p className="absolute font-['Be_Vietnam_Pro:Regular',sans-serif] h-[92px] leading-[normal] left-[722px] not-italic text-[32px] text-white top-[1028px] w-[386px]">Thought of the day</p>
      <Group1 />
      <p className="absolute font-['Be_Vietnam_Pro:Regular',sans-serif] h-[92px] leading-[normal] left-[1406px] not-italic text-[64px] text-white top-[38px] w-[273px]">11:11 AM</p>
    </div>
  );
}