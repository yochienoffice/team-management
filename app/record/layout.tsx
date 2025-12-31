import React from "react";

export default function RecordPageHome({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-hs-main-bg">
      <main className="px-8 lg:p-8 w-full flex justify-center">
        <section className="w-full h-min p-5 bg-white rounded-md shadow-list-shadow">
          {children}
        </section>
      </main>
    </div>
  );
}
