"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navigation from "./Navigation";
import SubjectPage from "./SubjectPage";
import SearchModal from "./Search";
import { type Subject } from "@/data/vault";

interface SubjectPageClientProps {
  subject: Subject;
}

export default function SubjectPageClient({ subject }: SubjectPageClientProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setIsSearchOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <Navigation onSearchClick={() => setIsSearchOpen(true)} />
      <SubjectPage subject={subject} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
