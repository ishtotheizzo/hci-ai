"use client"; // 👈 Add this exact string at the very top
import * as React from "react";
import { Radio, RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@headlessui/react";

const screenTypes = [
  {
    type: "Seven Screen",
    additionToPrompt: "create 7 100vw and 100vh monitor sized",
    description:
      "This is for facilitated engagements, and usually provides minimal intereactivity. This is great for facilitating discussions and decision making.",
  },
  {
    type: "Web Application",
    additionToPrompt: "Create an interactive singular page website",
    description:
      "This is highly interactive webpage that allows users to interact and explore data",
  },
];

const plans = [
  {
    name: "Explorer",
    value: 1,
    description:
      "Users know what type of data they want to share, and they want to visualize users exploring them",
    audience: ["researchers", "general public"],
  },
  {
    name: "Planners",
    value: 2,
    description:
      "Users are highly technical, wanting to plan and see scenarios based on available data",
    audience: ["community leaders", "subject matter experts"],
  },
  {
    name: "Data Scientist",
    value: 3,
    description:
      "Users have data, but would like to see different ways to present information and see modeling",
    audience: ["researchers", "data specialists"],
  },
  {
    name: "Open Query",
    value: 4,
    description:
      "Users want to play with different options for visualizations and start thinking of the possible",
    audience: ["all peoples"],
  },
];

export default function GuidedExample() {
  const [selected, setSelected] = useState(null);
  const [screen, setScreens] = useState(screenTypes[0]);
  const handleReset = () => {
    setSelected(null);
    setScreens(screenTypes[0]);
  };
  return (
    <div className="w-full px-4">
      <div className="mx-auto w-full max-w-md">
        <RadioGroup
          by="name"
          value={selected}
          onChange={setSelected}
          aria-label="target-users"
          className="space-y-2"
        >
          {plans.map((plan) => (
            <Radio
              key={plan.name}
              value={plan}
              className="group relative flex cursor-pointer rounded-lg bg-white/5 px-5 py-4 text-white shadow-md transition focus:not-data-focus:outline-none data-checked:bg-white/10 data-focus:outline data-focus:outline-white"
            >
              <div className="flex w-full items-center justify-between">
                <div className="text-sm/6">
                  <p className="font-semibold text-white">{plan.name}</p>
                  <div className="flex gap-2 text-white/50">
                    <div>{plan.description}</div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {plan.audience.map((aud) => (
                      <span
                        key={aud}
                        className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white/80 ring-1 ring-inset ring-white/20"
                      >
                        {aud}
                      </span>
                    ))}
                  </div>{" "}
                </div>
                <CheckCircleIcon className="size-6 fill-white opacity-0 transition group-data-checked:opacity-100" />
              </div>
            </Radio>
          ))}
        </RadioGroup>
        {selected && (
          <RadioGroup
            by="type"
            value={screen}
            onChange={setScreens}
            aria-label="screen-type"
            className="mt-6 space-y-2"
          >
            {screenTypes.map((screen) => (
              <Radio
                key={screen.type}
                value={screen}
                className="group relative flex cursor-pointer rounded-lg bg-white/5 px-5 py-4 text-white shadow-md transition focus:not-data-focus:outline-none data-checked:bg-white/10 data-focus:outline data-focus:outline-white"
              >
                <div className="flex w-full items-center justify-between">
                  <div className="text-sm/6">
                    <p className="font-semibold text-white">{screen.type}</p>
                    <div className="text-white/50">{screen.description}</div>
                  </div>
                  <CheckCircleIcon className="size-6 fill-white opacity-0 transition group-data-checked:opacity-100" />
                </div>
              </Radio>
            ))}
          </RadioGroup>
        )}

        {selected && screen && (
          <div className="mt-6 flex gap-2">
            <Button
              as={Link}
              href={{
                pathname: "/api",
                query: {
                  audience: selected.value,
                  screen: JSON.stringify(screen),
                },
              }}
              className="rounded-lg bg-white px-5 py-4 text-black shadow-md data-focus:outline data-focus:outline-white"
            >
              Generate
            </Button>
            <Button
              onClick={handleReset}
              className="cursor-pointer rounded-lg bg-white/5 px-5 py-4 text-white shadow-md data-focus:outline data-focus:outline-white"
            >
              Reset
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
