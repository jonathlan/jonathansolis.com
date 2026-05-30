"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

type Tab = "relevant" | "marketing" | "technical" | "others";

const courses: Record<Tab, Array<{ title: string; provider: string; date: string }>> = {
  relevant: [
    { title: "Talk to users and validation techniques", provider: "Platzi", date: "Jan 2022" },
    { title: "Product management", provider: "Platzi", date: "Nov 2021" },
    { title: "Product management for developers", provider: "Platzi", date: "Sep 2021" },
    { title: "Product management foundations", provider: "Platzi", date: "Sep 2021" },
    { title: "Financial market analysis", provider: "International Monetary Fund", date: "Jul 2020" },
    { title: "Automation testing with Selenium and Java", provider: "Cool Testers", date: "May 2018" },
    { title: "ISTQB Certified software tester", provider: "International Software Testing Qualifications Board", date: "Oct 2015" },
    { title: "Ruby full stack developer", provider: "Johns Hopkins University", date: "Jun 2018" },
  ],
  marketing: [
    { title: "Brand positioning in digital media", provider: "Platzi", date: "Jun 2021" },
    { title: "Content marketing", provider: "Platzi", date: "Jun 2021" },
    { title: "Content strategies for LinkedIn", provider: "Platzi", date: "Jun 2021" },
    { title: "Copywriting with storytelling techniques", provider: "Platzi", date: "May 2021" },
    { title: "Communication and creative marketing for brands", provider: "Platzi", date: "May 2021" },
    { title: "Marketing strategies in social networks", provider: "Platzi", date: "Mar 2021" },
    { title: "Personal branding", provider: "Platzi", date: "Feb 2019" },
  ],
  technical: [
    { title: "Bootstrap", provider: "Platzi", date: "Dec 2021" },
    { title: "Basics of testing with Java", provider: "Platzi", date: "Nov 2021" },
    { title: "Basics of informatics security for enterprises", provider: "Platzi", date: "Mar 2021" },
    { title: "Bitcoin and blockchain", provider: "Platzi", date: "Feb 2021" },
    { title: "Blockchain and crypto currencies", provider: "Platzi", date: "Jan 2021" },
  ],
  others: [
    { title: "Workshop for changing your career path", provider: "Platzi", date: "Sep 2021" },
    { title: "Investment foundations with Mesfix", provider: "Platzi", date: "Mar 2021" },
    { title: "Podcasts creation", provider: "Platzi", date: "Oct 2020" },
    { title: "Effective online learning", provider: "Platzi", date: "Oct 2020" },
  ],
};

const TABS: { key: Tab; label: string }[] = [
  { key: "relevant", label: "Relevant" },
  { key: "marketing", label: "Marketing" },
  { key: "technical", label: "Technical" },
  { key: "others", label: "Others" },
];

export default function CoursesModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("relevant");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Courses & Certifications">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 -mt-2 mb-4">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === key
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Course list */}
      <ul className="divide-y divide-gray-100">
        {courses[activeTab].map(({ title, provider, date }) => (
          <li key={title} className="flex justify-between items-start gap-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">{title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{provider}</p>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">{date}</span>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
