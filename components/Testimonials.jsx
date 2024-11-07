const testimonials = [
  {
    id: 1,
    body: "Hello! I passed my PPL exam! Thank you for your help and for developing a really good question bank. I found your practice tests really similar to the actual TC Exam. I felt really confident writing it today because of all the preparation that I had.",
    author: {
      name: "Quintin",
      city: "Winnipeg",
    },
  },
  {
    id: 2,
    body: "I just wanted to say a huge thank you!! The questions in your practice exams was absolutely fantastic and covered almost everything I needed! It was brief, complete, and incredibly helpful.I'm so grateful for this product and your support via email. This was the easiest exam I've taken in a while",
    author: {
      name: "Justin",
      city: "Toronto",
    },
  },
  {
    id: 3,
    body: "I just wanted to share some wonderful news with you. I wrote my PPL today and passed! I am incredibly happy and am super thankful for your PPL question bank - it was extremely helpful and I am now proficient in the topics I was previously unsure of. Thank you so so much again! You have a great practice exams. and I will definitely recommend you to friends, family and colleagues. I’m over the moon!",
    author: {
      name: "Srinivas",
      city: "Calgary",
    },
  },
  {
    id: 4,
    body: "Hello, I cleared my PPL exams today with an 87%!! All thanks to your incredible question bank. Please create us a CPL practice exams, I dont mind placing a preorder. Thank you soo much!",
    author: {
      name: "Tunde",
      city: "Thunder Bay",
    },
  },
  {
    id: 5,
    body: "Hello, I’m glad to have come across your PSTAR prep. The exam ended up being a breeze, thanks to the currency of your prep material! Got a 98%. Thanks a lot and definitely gonna take advantage of your PPL soon.",
    author: {
      name: "Nguyen",
      city: "Vancouver",
    },
  },
  {
    id: 6,
    body: "I wrote the PSTAR yesterday and passed with a 96%. I just wanted to thank you for your time and amazing practice exams you offer. The TC questions were practically identical to your exams. Saved me a lot of time and energy.",
    author: {
      name: "Leslie",
      city: "Yellowknife",
    },
  },
  // More testimonials...
];

export default function Testimonials() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          {/* <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">
            Testimonials
          </h2> */}
          <p className="mt-2 text-3xl font-bold tracking-tight text-indigo-600 sm:text-4xl">
            See what our users are saying
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="pt-8 sm:inline-block sm:w-full sm:px-4"
              >
                <figure className="rounded-2xl bg-gray-50 p-6 sm:p-8 text-sm leading-6">
                  <blockquote className="text-gray-900">
                    <p>{`“${testimonial.body}”`}</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.author.name}
                      </div>
                      <div className="text-gray-600">
                        ({testimonial.author.city})
                      </div>
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
