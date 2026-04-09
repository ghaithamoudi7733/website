import { notFound } from "next/navigation";
import SubjectPageClient from "@/components/SubjectPageClient";
import { getSubjectBySlug, getAllSubjects } from "@/data/vault";

interface SubjectPageParams {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const subjects = getAllSubjects();
  return subjects.map((subject) => ({
    slug: subject.slug,
  }));
}

export default async function SubjectPageRoute({ params }: SubjectPageParams) {
  const { slug } = await params;
  const subject = getSubjectBySlug(slug);

  if (!subject) {
    notFound();
  }

  return <SubjectPageClient subject={subject} />;
}
