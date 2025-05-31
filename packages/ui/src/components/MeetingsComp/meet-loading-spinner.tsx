declare global {
  namespace JSX {
    interface IntrinsicElements {
      "l-ring": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          size?: string;
          stroke?: string;
          "bg-opacity"?: string;
          speed?: string;
          color?: string;
        },
        HTMLElement
      >;
    }
  }
}

export const MeetLoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-[#09090B]">
      <div className="p-6 mx-auto">
        <div className="flex items-center justify-center h-screen">
          <l-ring
            size="55"
            stroke="5"
            bg-opacity="0"
            speed="2"
            color="white"
          ></l-ring>
        </div>
      </div>
    </div>
  );
};
