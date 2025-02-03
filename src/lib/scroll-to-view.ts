/**
 *  A function to scrollToView of an element
 * @param scrollY the y position to scroll to
 * @returns void
 */
export const scrollToView = (scrollY: number | undefined = 500) =>
  setTimeout(
    () =>
      window.scrollTo({
        top:
          scrollY ??
          (document.querySelector(`#hero`) as HTMLElement)?.offsetHeight, // ==> window.scrollY / 3
        behavior: "smooth",
      }),
    100,
  );
