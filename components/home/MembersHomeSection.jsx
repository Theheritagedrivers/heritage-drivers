"use client";

import { Calendar, Mail, Wrench } from "lucide-react";

export default function MembersHomeSection({
  tc,
  memberName,
}) {
  return (
    <section>
      <div className="mb-10 flex justify-center">
        <img
          src="/logo.png"
          alt="The Heritage Drivers"
          className="h-40 object-contain"
        />
      </div>

      <p className="text-sm uppercase tracking-[0.4em] text-[#b6924f]">
        {tc("secureAccess")}
      </p>

      <h1 className="mt-6 text-5xl leading-tight text-[#f2e6cf]">
        {tc("welcome")}, {memberName}
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-[#bcb09a]">
        {tc("membersIntro")}
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-[1.5rem] border border-[#2d2416] bg-[#131313] p-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-[#b6924f]" />
            <h3 className="text-lg text-[#f2e6cf]">
              {tc("eventCardTitle")}
            </h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#a99c83]">
            {tc("eventCardText")}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-[#2d2416] bg-[#131313] p-6">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-[#b6924f]" />
            <h3 className="text-lg text-[#f2e6cf]">
              {tc("notesTitle")}
            </h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#a99c83]">
            {tc("notesText")}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-[#2d2416] bg-[#131313] p-6">
          <div className="flex items-center gap-3">
            <Wrench className="h-5 w-5 text-[#b6924f]" />
            <h3 className="text-lg text-[#f2e6cf]">
              {tc("atelierTitle")}
            </h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#a99c83]">
            {tc("atelierText")}
          </p>
        </div>
      </div>
    </section>
  );
}