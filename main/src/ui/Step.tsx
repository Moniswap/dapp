import { useMemo, type ReactNode, Children, useEffect, ReactElement, cloneElement } from "react";
import clsx from "clsx";

interface StepProps {
  active?: boolean;
  content: ReactNode;
  customIcon?: ReactNode;
  hasConnector?: boolean;
}

interface StepGroupProps {
  activeStep?: number;
  children: ReactNode;
}

function Step({ active, content, customIcon, hasConnector }: StepProps) {
  return (
    <div className="flex justify-center gap-4 items-start w-full">
      <div className="flex flex-col justify-center items-center w-auto flex-wrap">
        <div
          className={clsx(
            "flex justify-center items-center py-2 px-2 rounded-[10px] bg-[#47473f] h-8 w-8 md:h-10 md:w-10 text-center z-10",
            {
              "text-[#34d22c]": active,
              "text-[#fff] font-[500] text-sm md:text-lg": !active
            }
          )}
        >
          {customIcon}
        </div>
        {hasConnector && <div className="bg-[#9a9888] h-auto w-[2px] min-h-3 md:min-h-5 flex flex-1 overflow-hidden" />}
      </div>
      <div className="flex">{content}</div>
    </div>
  );
}

function StepGroup({ activeStep = -1, children }: StepGroupProps) {
  const groupMembers = useMemo(() => Children.toArray(children), [children]);

  useEffect(() => {
    groupMembers.forEach(member => {
      if ((member as ReactElement).type !== Step) {
        throw new TypeError(
          `unsupported element in StepGroup. expected a 'Step' but found ${typeof (member as ReactElement).type}`
        );
      }
    });
  }, [groupMembers]);

  return (
    <ul className="flex flex-col flex-nowrap justify-start items-center w-fit h-full">
      {groupMembers.map((x, index) => (
        <li key={index}>
          {cloneElement(x as ReactElement, {
            active: index <= activeStep,
            customIcon: (x as ReactElement).props.customIcon ?? <span>{index + 1}</span>,
            hasConnector: index < groupMembers.length - 1,
            key: index
          })}
        </li>
      ))}
    </ul>
  );
}

export { Step, StepGroup };
