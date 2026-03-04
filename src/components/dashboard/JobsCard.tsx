import type { JobOffer } from "@/lib/mock-data";

export function JobsCard({ title, jobs }: { title: string; jobs: JobOffer[] }) {
  return (
    <div className="widget glass">
      <div className="widget__header">
        <h2 className="widget__title">{title}</h2>
        <span className="widget__badge">{jobs.length} offres</span>
      </div>
      <ul className="jobs">
        {jobs.map((job) => (
          <li key={job.id} className="jobs__item">
            <div className="jobs__info">
              <h3 className="jobs__title">{job.title}</h3>
              <div className="jobs__meta">
                <span className="jobs__company">{job.company}</span>
                <span className="jobs__location">📍 {job.location}</span>
                <span className="jobs__date">{job.date}</span>
              </div>
            </div>
            <span
              className={`jobs__contract jobs__contract--${job.contract.toLowerCase()}`}
            >
              {job.contract}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
