import { notFound } from "next/navigation"
import { Info } from "@/components/custom/projects/info"
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

  return !project ? (
    notFound()
  ) : (
    <>
      <ProjectIntro project={project} />
      <Info
        project={{
          ...project,
          projectDuration: getProjectDuration(project.projectStartDate, project.projectEndDate),
        }}
      />
    </>
  )
}

function getProjectDuration(projectStartDate: Date, projectEndDate: Date): string {
  const startDate = new Date(projectStartDate)
  const endDate = new Date(projectEndDate)

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30))

  return diffMonths > 2 ? `${diffMonths} أشهر` : `${diffMonths} شهر`
}
