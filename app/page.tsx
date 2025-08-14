import { Pump } from "basehub/react-pump";
import { sendEvent, parseFormData } from "basehub/events";

export default function Home() {
  return (
    <div>
      <Pump
        queries={[
          {
            home: {
              title: true,
              feedback: {
                ingestKey: true,
                schema: true,
              },
            },
          },
        ]}
      >
        {async ([{ home }]) => {
          "use server";
          return (
            <div className="flex flex-col gap-4 max-w-md mx-auto p-4">
              <h1 className="text-2xl font-bold">{home.title}</h1>
              <form
                className="flex flex-col gap-2"
                action={async (formData) => {
                  "use server";
                  const parsed = parseFormData(
                    home.feedback.ingestKey,
                    home.feedback.schema,
                    formData
                  );
                  if (!parsed.success) {
                    throw new Error("Invalid form data");
                  }
                  await sendEvent(home.feedback.ingestKey, parsed.data);
                }}
              >
                {home.feedback.schema.map((field) => {
                  if (field.type === "textarea") {
                    return (
                      <label
                        key={field.id}
                        htmlFor={field.id}
                        className="flex flex-col gap-2"
                      >
                        <span>{field.label}</span>
                        <textarea
                          {...field}
                          className="border border-gray-300 rounded-md p-2"
                        />
                      </label>
                    );
                  }
                  return (
                    <label
                      key={field.id}
                      htmlFor={field.id}
                      className="flex flex-col gap-2"
                    >
                      <span>{field.label}</span>
                      <input
                        {...field}
                        className="border border-gray-300 rounded-md p-2"
                      />
                    </label>
                  );
                })}
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-md"
                >
                  Submit
                </button>
              </form>
            </div>
          );
        }}
      </Pump>
    </div>
  );
}
