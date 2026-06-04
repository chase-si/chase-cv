import { notFound } from "next/navigation";

import { PosterMakerWorkbench } from "../poster-maker-workbench";
import { posterTemplates } from "../templates";

export function generateStaticParams() {
  return posterTemplates.map((template) => ({
    styleId: template.id,
  }));
}

export default async function PosterMakerStylePage({
  params,
}: {
  params: Promise<{ styleId: string }>;
}) {
  const { styleId } = await params;
  const template = posterTemplates.find((item) => item.id === styleId);

  if (!template) {
    notFound();
  }

  return <PosterMakerWorkbench initialTemplateId={template.id} />;
}
