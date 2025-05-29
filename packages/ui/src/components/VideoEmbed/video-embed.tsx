export const VideoEmbed = () => {
  return (
    <div
      style={{
        position: "relative",
        paddingBottom: "56.25%",
        height: 0,
        width: "100%",
      }}
      className="mb-6"
    >
      <iframe
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
        src="https://share.layerpath.com/e/cm926gsck000ol70cwlgptoh2/tour"
        title="Amurex Onboarding Video"
      />
    </div>
  );
};
