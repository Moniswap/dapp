import { useMemo, type ReactNode, Children, useEffect, ReactElement, cloneElement } from "react";
import clsx from "clsx";

interface StepProps {
  active?: boolean;
  content: ReactNode;
  customIcon?: ReactNode;
  hasBottomConnector?: boolean;
  hasTopConnector?: boolean;
}

interface StepGroupProps {
  activeStep?: number;
  children: ReactNode;
}

function Step({ active, content, customIcon, hasBottomConnector, hasTopConnector }: StepProps) {
  return (
    <>
      {hasTopConnector && <hr className="bg-[#9a9888] min-h-6" />}
      <div className="timeline-middle">
        <div
          className={clsx(
            "flex justify-center items-center py-2 px-2 rounded-[10px] bg-[#47473f] h-8 w-8 md:h-10 md:w-10 z-10",
            {
              "text-[#34d22c]": active,
              "text-[#fff] font-[500] text-sm md:text-lg": !active
            }
          )}
        >
          {customIcon}
        </div>
      </div>
      <div className="timeline-end self-start">{content}</div>
      {hasBottomConnector && <hr className="bg-[#9a9888] min-h-6" />}
    </>
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
    <ul className="timeline timeline-vertical w-full justify-start items-start timeline-compact">
      {groupMembers.map((x, index) => (
        <li key={index} className="w-full">
          {cloneElement(x as ReactElement, {
            active: index <= activeStep,
            customIcon: (x as ReactElement).props.customIcon ?? <span>{index + 1}</span>,
            hasTopConnector: index > 0,
            hasBottomConnector: index < groupMembers.length - 1,
            key: index
          })}
        </li>
      ))}
    </ul>
  );
}

export { Step, StepGroup };
