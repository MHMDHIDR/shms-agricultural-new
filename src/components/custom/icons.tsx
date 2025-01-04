import { cn } from "@/lib/utils";
import type { JSX } from "react";

const ICON_SIZE_CLASS = "w-5 h-5";

export function Success({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      className={cn(`status__icon--success ${ICON_SIZE_CLASS}`, className)}
      version="1.1"
      viewBox="0 0 87 87"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <title>Great :D Everything is good 👍🏻</title>
      <g
        fill="none"
        fillRule="evenodd"
        id="Page-1"
        stroke="none"
        strokeWidth="1"
      >
        <g id="Group-3" transform="translate(2.000000, 2.000000)">
          <circle
            cx="41.5"
            cy="41.5"
            id="Oval-2"
            r="41.5"
            stroke="rgba(165, 220, 134, 0.2)"
            strokeWidth="4"
          />
          <circle
            className="status__icon--success-circle"
            cx="41.5"
            cy="41.5"
            id="Oval-2"
            r="41.5"
            stroke="#A5DC86"
            strokeWidth="4"
          />
          <polyline
            className="status__icon--success-path"
            id="Path-2"
            points="19 38.8036813 31.1020744 54.8046875 63.299221 28"
            stroke="#A5DC86"
            strokeWidth="4"
          />
        </g>
      </g>
    </svg>
  );
}

export function Error({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      className={cn(`status__icon--error ${ICON_SIZE_CLASS}`, className)}
      version="1.1"
      viewBox="0 0 87 87"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <title>Opps! something went wrong 😞</title>
      <g
        fill="none"
        fillRule="evenodd"
        id="Page-1"
        stroke="none"
        strokeWidth="1"
      >
        <g id="Group-2" transform="translate(2.000000, 2.000000)">
          <circle
            className="status__icon--error-circle status__icon--error-circle-1"
            cx="41.5"
            cy="41.5"
            id="Oval-2"
            r="41.5"
          />
          <circle
            className="status__icon--error-circle status__icon--error-circle-2"
            cx="41.5"
            cy="41.5"
            r="41.5"
          />
          <path
            className="status__icon--error-line status__icon--error-line-1"
            d="M22.244224,22 L60.4279902,60.1837662"
            id="Line"
          />
          <path
            className="status__icon--error-line status__icon--error-line-2"
            d="M60.755776,21 L23.244224,59.8443492"
            id="Line"
          />
        </g>
      </g>
    </svg>
  );
}

export function Loading({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      className={cn(`status__icon--loading ${ICON_SIZE_CLASS}`, className)}
      version="1.1"
      viewBox="0 0 87 87"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <title>Loading... 💬</title>
      <g
        fill="none"
        fillRule="evenodd"
        id="Page-1"
        stroke="none"
        strokeWidth="1"
      >
        <g id="Group-3" transform="translate(2.000000, 2.000000)">
          <circle
            className="status__icon--loading-circle status__icon--loading-circle-1"
            cx="41.5"
            cy="41.5"
            id="Oval-2"
            r="41.5"
          />
          <circle
            className="status__icon--loading-circle status__icon--loading-circle-2"
            cx="41.5"
            cy="41.5"
            r="41.5"
          />
        </g>
      </g>
    </svg>
  );
}
