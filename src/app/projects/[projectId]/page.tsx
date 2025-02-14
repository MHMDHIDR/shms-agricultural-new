import { notFound } from "next/navigation"
import { ProjectIntro } from "@/components/custom/projects/intro"
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants"
import { api } from "@/trpc/server"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string }>
}): Promise<Metadata> {
  const { projectId } = await params
  const project = await api.projects.getProjectById({ projectId })

  return {
    title: `مشروع ${project?.projectName} | ${APP_TITLE}`,
    description: APP_DESCRIPTION,
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const project = await api.projects.getProjectById({ projectId })

  return !project ? notFound() : <ProjectIntro project={project} />
}
