"use client"; // 👈 Add this exact string at the very top
import { Button, Description, Field, Label, Textarea } from "@headlessui/react";
import clsx from "clsx";
import "./globals.css";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <div className="flex h-screen flex-col content-center items-center justify-center">
        <div className="w-100%">
          <Field>
            <Label className="text-5xl font-extrabold text-white  py-8">
              DT HCI LOREM IPSUM DOLOR
            </Label>
            <Description className="text-xl text-white my-8">
              This is the envisioning tool lorem ipsum dolor making this look
              nice
            </Description>
            <Textarea
              className={clsx(
                "mt-3 block w-full resize-none rounded-lg border-white/25 bg-gray-900 px-3 py-1.5 text-sm/6 text-white",
                "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25",
              )}
              rows={3}
            />
            <Button
              className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500 my-4"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                alert("Clicked!");
              }}
            >
              Envision
            </Button>
          </Field>
        </div>
      </div>
      <div className="landingPage"></div>
    </div>
  );
}
