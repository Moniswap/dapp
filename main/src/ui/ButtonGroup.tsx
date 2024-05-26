import { Children, ReactElement, ReactNode, cloneElement, useEffect, useMemo } from "react";
import clsx from "clsx";

interface ButtonGroupItemProps {
  active?: boolean;
  index?: number;
  children: ReactNode;
  onClickAction?: (index?: number) => any;
  totalButtonItems?: number;
  alt?: boolean;
}

interface ButtonGroupProps {
  activeButtonIndex?: number;
  children: ReactNode;
  onSingleItemClick?: (index: number) => any;
}

function ButtonGroupItem({ active, index, children, onClickAction, totalButtonItems, alt }: ButtonGroupItemProps) {
  return (
    <button
      onClick={() => onClickAction && onClickAction(index)}
      className={clsx("join-item flex justify-center items-center px-2 md:px-4 py-1 md:py-3 text-[#fff]", {
        "bg-[#ffb443]": active && !alt,
        "bg-[#0c0c0b]": !active && !alt,
        "bg-[#fc8415]": active && alt,
        "bg-[#1e1e1e]": !active && alt,
        "rounded-l-[12.8px]": index === 0,
        "rounded-r-[12.8px]": !!totalButtonItems && index === totalButtonItems - 1
      })}
    >
      {children}
    </button>
  );
}

function ButtonGroup({ activeButtonIndex, onSingleItemClick, children }: ButtonGroupProps) {
  const groupMembers = useMemo(() => Children.toArray(children), [children]);

  useEffect(() => {
    groupMembers.forEach(member => {
      if ((member as ReactElement).type !== ButtonGroupItem) {
        throw new TypeError(
          `unsupported element in ButtonGroup. expected a 'ButtonGroup' but found ${typeof (member as ReactElement)
            .type}`
        );
      }
    });
  }, [groupMembers]);
  return (
    <div className="join border border-[#33332d] rounded-[12.8px]">
      {groupMembers.map((elem, index) => {
        return cloneElement(elem as ReactElement, {
          index,
          key: index,
          active: activeButtonIndex === index,
          totalButtonItems: groupMembers.length,
          onClickAction: !!(elem as ReactElement).props.onClickAction
            ? (elem as ReactElement).props.onClickAction
            : !!onSingleItemClick
            ? onSingleItemClick
            : undefined
        });
      })}
    </div>
  );
}

export { ButtonGroupItem, ButtonGroup };
