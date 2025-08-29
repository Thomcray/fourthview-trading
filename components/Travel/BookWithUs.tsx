import BookModal from "./BookModal";

type Reason = {
  title: string;
  description: string;
};
export default function BookWithUs() {
  const reasons: Array<Reason> = [
    {
      title: "Expert Local Guides",
      description:
        "Expert Local Guides from our team of experienced and knowledgeable guides ensures you get the most authentic and informative experience.",
    },
    {
      title: "Exclusive Factory Access",
      description:
        "Gain behind-the-scene access to top factories and manufacturing facilities that are typically closed to the public.",
    },
    {
      title: "Customized Itineraries",
      description:
        "Whether you're a curious traveler, a business delegate, or part of a corporate group, we tailor each visit to meet your interest and goals.",
    },
    {
      title: "Seamless Experience",
      description:
        "From transportation to translation - we handle all the logistics so you can focus on learning and enjoying.",
    },
  ];
  return (
    <div className="max-sm:px-4 flex items-center sm:px-6 lg:px-12 flex-col space-y-4">
      <h1 className="font-bold text-3xl w-96 max-sm:w-80 text-center text-blue-950">
        Why Book With Us
      </h1>

      <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 items-center border-0">
        {reasons.map((reason) => (
          <div
            key={reason.title}
            className="bg-slate-100 h-44 border-0 px-4 py-6 text-white flex flex-col max-sm:text-center space-y-2 rounded-2xl w-full lg:w-96"
          >
            <h1 className="font-bold text-xl w-full max-sm:w-80 text-center border-0 text-blue-950">
              {reason.title}
            </h1>

            <p className="text-black">{reason.description}</p>
          </div>
        ))}
      </div>

      <BookModal />
    </div>
  );
}
